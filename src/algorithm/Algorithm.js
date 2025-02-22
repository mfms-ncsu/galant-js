import Graph from "graph/Graph";

/**
 * Representation of the algorithm loaded into the program. Contains a name and code. Controls a
 * web worker called Thread, which is the execution environment for the code.
 * 
 * @author Henry Morris
 */
export default class Algorithm {

    /** The ID of the timeout instance so that it can be canceled if we get a good message */
    #timeoutId;
    /** The number of miliseconds before a timeout happens. DONT CHANGE THIS */
    #timeoutPeriod = 5000;

    /** A flag that determines if the algorithm is in debug mode */
    debugMode = false;

    /**
     * Constructs a new Algorithm with name, code, a shared array, and a thread worker.
     * @param {String} name Algorithm name
     * @param {String} code Algorithm code
     */
    constructor(name, code, PromptService, stateVar) {
        this.name = name;
        this.code = code;
        this.array = new Int32Array(new SharedArrayBuffer(1024));
        this.array[1] = 0;

        // This array is passed to the Thread running the algorithm.
        // it holds status flags, such as whether the user has entered
        // debug mode
        this.flags = new Int32Array(new SharedArrayBuffer(4));
        this.flags[0] = 0;

        this.PromptService = PromptService;

        const [status, setStatus] = stateVar;
        this.status = status;
        this.setStatus = setStatus;
        this.fetchingSteps = false;
        this.completed = false;

        // Initialize the thread worker
        this.worker = new Worker(new URL("./Thread.js", import.meta.url));
        let handleMessage = (message) => { this.#onMessage(message.data) }
        this.worker.onmessage = handleMessage;
        this.worker.postMessage(["shared", this.array, this.flags]);
        this.worker.postMessage(["graph/algorithm", Graph.toGraphString(), Graph.isDirected, this.code]);
        this.worker.postMessage(["algorithm", this.code]);
    }

    /**
     * Returns the current step number of the algorithm
     */
    getStepNumber() {
        return Graph.algorithmChangeManager.getIndex();
    }

    /**
     * Returns the total number of steps taken in the algorithm.
     * This can be different to the index because you can undo a step
     */
    getTotalSteps() {
        return Graph.algorithmChangeManager.getLength();
    }

    /**
     * Sets up a timeout for the thread to run a step
     */
    #setupTimeout() {
        this.#timeoutId = setTimeout(() => {
            // Kill the thread
            this.killThread();
            
            // Create an error
            var err = new Error("Timeout has occurred.");
            err.lineNumber = -1;

            // Prompt the user with the error
            this.PromptService.addPrompt({
                type: 'algorithmError',
                errorObject: err,
                algorithmCode: this.code
            }, () => { });
        }, this.#timeoutPeriod);
    }
    
    /**
     * Toggles the debug mode on or off
     */
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        this.flags[0] = this.debugMode ? 1 : 0;
    }

    /**
     * Stores a 1 in the shared array and notifies the Thread that it can resume.
     */
    resumeThread() {
        Atomics.store(this.array, 0, 1);
        Atomics.notify(this.array, 0);
    }

    /**
     * This kills the worker Thread, stopping he worker and clearing its space.
     */
    killThread() {
        if (this.worker) {
            this.worker.terminate();
        }
    }

    /**
     * Checks whether the algorithm can step back.
     * @returns True if it can, false otherwise
     */
    canStepBack() {
        return Graph.algorithmChangeManager.getIndex() > 0;
    }

    /**
     * Checks whether the algorithm can step forward.
     * @returns True if it can, false otherwise
     */
    canStepForward() {
        if (this.fetchingSteps) return false;
        if (this.completed && Graph.algorithmChangeManager.getIndex() >= Graph.algorithmChangeManager.getLength()) return false;
        return true;
    }

    /**
     * Moves back a step.
     */
    stepBack() {
        if (!this.canStepBack()) return;
        Graph.algorithmChangeManager.undo();
    }

    /**
     * Moves forward a step.
     */
    stepForward() {
        if (!this.canStepForward()) return;
        if (Graph.algorithmChangeManager.getIndex() === Graph.algorithmChangeManager.getLength()) {
            this.fetchingSteps = true;
            this.resumeThread(); // Resume the thread

            // Once the step is complete:
            this.onStepAdded = () => {
                this.fetchingSteps = false;
            }
        } else {
            // Use redo if there are pre-loaded steps ahead of the index
            Graph.algorithmChangeManager.redo();
        }
    }

    /**
     * Recursive call for skipToEnd.
     * @param {Function} callback Function to call upon completion
     */
    skipToEndStep(callback) {
        if (!this.canStepForward()) return;
        if (Graph.algorithmChangeManager.getIndex() === Graph.algorithmChangeManager.getLength()) {
            this.fetchingSteps = true;
            this.resumeThread(); // Resume the thread

            // Once the step is complete:
            this.onStepAdded = () => {
                this.fetchingSteps = false;
                if (callback) callback();
            }
        } else {
            // Use redo if there are pre-loaded steps ahead of the index
            Graph.algorithmChangeManager.redo();
            if (callback) callback();
        }
    }

    /**
     * Skips to the end of the algorithm execution.
     */
    skipToEnd() {
        let count = 0;
        const algorithm = this;
        function recursiveNext() {
            if (count >= 250) return;
            count++;
            algorithm.skipToEndStep(recursiveNext);
        }

        recursiveNext();
    }

    /**
     * This stores in the shared array the length of the promptResult at index 1
     * and then puts each character of the promptResult in the shared array starting
     * at index 2.
     * @param {Object} promptResult the result from prompting the user for input
     */
    enterPromptResult(promptResult) {
        let len = Math.min(promptResult.length, 254)
        Atomics.store(this.array, 1, len);
        for (let i = 0; i < len; i++) {
            Atomics.store(this.array, i + 2, promptResult.charCodeAt(i));
        }
        this.resumeThread();

        if (this.onStepAdded) this.onStepAdded();
    }

    /**
     * Handles messages from thread.
     * @param {Object} message Message from thread
     */
    #onMessage(message) {
        switch (message.action) {
            case "addNode":
                Graph.algorithmChangeManager.addNode(message.x, message.y);
                break;
            case "prompt":
                this.PromptService.addPrompt(
                    { type: 'input', label: message.content[0] },
                    (value) => {
                        this.enterPromptResult(value);
                    }
                );
                break;
            case "message":
                Graph.algorithmChangeManager.addMessage(message.message);
                break;
            case "print":
                console.log(message.message);
                break;
            case "deleteNode":
                Graph.algorithmChangeManager.deleteNode(message.nodeId);
                break;
            case "setNodePosition":
                Graph.algorithmChangeManager.setNodePosition(message.nodeId, message.x, message.y);
                break;
            case "deleteEdge":
                Graph.algorithmChangeManager.deleteEdge(message.source, message.target);
                break;
            case "setNodeAttribute":
                Graph.algorithmChangeManager.setNodeAttribute(message.nodeId, message.name, message.value);
                break;
            case "setNodeAttributeAll":
                Graph.algorithmChangeManager.setNodeAttributeAll(message.name, message.value);
                break;
            case "setEdgeAttribute":
                Graph.algorithmChangeManager.setEdgeAttribute(message.source, message.target, message.name, message.value);
                break;
            case "setEdgeAttributeAll":
                Graph.algorithmChangeManager.setEdgeAttributeAll(message.name, message.value);
                break;
            case "startRecording":
                this.#setupTimeout(); // Start the timeout timer
                Graph.algorithmChangeManager.startRecording();
                break;
            case "endRecording":
                
                clearTimeout(this.#timeoutId);
                // End the recording, but only if it started. It is
                // possible that the user was in debug mode, which
                // means that the recording was never actually
                // started
                if (Graph.algorithmChangeManager.isRecording()) {
                    Graph.algorithmChangeManager.endRecording();
                }
                if (this.onStepAdded) this.onStepAdded();
                break;
            case "step":
                if (this.onStepAdded) this.onStepAdded();
                break;
            case "complete":
                if (this.onStepAdded) this.onStepAdded();
                this.completed = true;
                break;
            case "error":
                this.services.PromptService.addPrompt({
                    type: "algorithmError",
                    errorObject: message.error,
                    algorithmCode: this.code
                }, () => { });
            default:
                // If the message was not a type we define here, then we probably just made
                // a mistake or typo when sending this message. Throw an error to let us
                // know about it
                throw new Error("Unexpected message type: " + message.action);
        }
    }
}
