import Graph from "graph/Graph";

/**
 * Representation of the algorithm loaded into the program. Contains a name and code. Controls a
 * web worker called Thread, which is the execution environment for the code.
 * 
 * @author Henry Morris
 */
export default class Algorithm {
    /**
     * Constructs a new Algorithm with name, code, a shared array, and a thread worker.
     * @param {String} name Algorithm name
     * @param {String} code Algorithm code
     */
    constructor(name, code, PromptService, stateVar) {
        this.name = name;
        this.code = code;
        this.array = new Int32Array(new SharedArrayBuffer(1024));

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
        this.worker.postMessage(["shared", this.array]);
        this.worker.postMessage(["graph/algorithm", Graph.toGraphString(), this.code]);
        this.worker.postMessage(["algorithm", this.code]);
    }

    /**
     * Returns a string that will be displayed in the AlgorithmControlsComponent that
     * represents the current index of the algorithm. For example, if we are on step
     * 4 of 6, then this algorithm will return "Step 4 / 6"
     */
    getStepText() {
        return "Step " + Graph.algorithmChangeManager.getIndex() + " / " + Graph.algorithmChangeManager.getLength();
    }

    /**
     * Not sure what this object is supposed to do. It's called by the AlgorithmControlsComponent, and it fails to
     * run if this function isn't there.
     *
     * TODO:
     * FIXME: Either figure out what this configuration object is supposed to do/be or modify the AlgorithmConrtolsComponent
     *        file to no longer require it
     */
    configuration = {controlNodePosition: 0};

    /**
     * This places a 1 at index 0 in the shared array using the Atomics.store method. Once
     * stored it then notifies any process that is waiting and looking at index 0 to check the index. 
     * Which should be the worker Thread that had been created.
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

    canStepBack() {
        return Graph.algorithmChangeManager.getIndex() > 0;
    }

    canStepForward() {
        if (this.fetchingSteps) return false;
        if (this.completed && Graph.algorithmChangeManager.getIndex() >= Graph.algorithmChangeManager.getLength() - 1) return false;
        return true;
    }

    stepBack() {
        if (!this.canStepBack()) return;
        Graph.algorithmChangeManager.undo();
        this.#updateStatus();
    }

    stepForward() {
        if (!this.canStepForward()) return;
        if (Graph.algorithmChangeManager.getIndex() === Graph.algorithmChangeManager.getLength()) {
            this.fetchingSteps = true;
            this.resumeThread();

            this.onStepAdded = () => {
                this.fetchingSteps = false;
                this.#updateStatus();
            }
        } else {
            Graph.algorithmChangeManager.redo();
        }
    }

    skipToEndStep(callback) {
        if (!this.canStepForward()) return;
        if (Graph.algorithmChangeManager.getIndex() === Graph.algorithmChangeManager.getLength()) {
            this.fetchingSteps = true;
            this.resumeThread();

            this.onStepAdded = () => {
                this.fetchingSteps = false;
                this.#updateStatus();
                if (callback) callback();
            }
        } else {
            Graph.algorithmChangeManager.redo();
            this.#updateStatus();
            if (callback) callback();
        }
    }

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
     * Triggers re-render
     */
    #updateStatus() {
        this.setStatus({});
    }

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
                if (this.onStepAdded) this.onStepAdded();
                break;
            case "print":
                if (this.onStepAdded) this.onStepAdded();
                console.log(message.message);
                break;
            case "deleteNode":
                Graph.algorithmChangeManager.deleteNode(message.nodeId);
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
                Graph.algorithmChangeManager.startRecording();
                break;
            case "endRecording":
                Graph.algorithmChangeManager.endRecording();
                if (this.onStepAdded) this.onStepAdded();
                break;
            case "complete":
                this.completed = true;
                break;
            default:
                // If the message was not a type we define here, then we probably just made
                // a mistake or typo when sending this message. Throw an error to let us
                // know about it
                throw new Error("Unexpected message type: " + message.action);
        }
    }
}
