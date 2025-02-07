import Graph from "graph/Graph";

/**
 * 
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
        this.currentIndex = 0;
        this.fetchingSteps = false;
        
        /**
         * The size of each step. For example, if stepSizes[1] = 2, then step 1 in
         * the algorithm did two things (ie, it highlighted two edges)
         */
        this.stepSizes = [];

        /**
         * Used to record the size of a step. Starts at 0, and increments with
         * each action of that step until the step ends.
         */
        this.tempStepSize = 0;

        // Initialize the thread worker
        this.worker = new Worker(new URL("./Thread.js", import.meta.url));
        let handleMessage = (message) => { this.#onMessage(message.data) }
        this.worker.onmessage = handleMessage;
        this.worker.postMessage(["shared", this.array]);
        this.worker.postMessage(["graph/algorithm", Graph.toGraphString(), this.code]);
        this.worker.postMessage(["algorithm", this.code]);
    }

    /**
     * This places a 1 at index 0 in the shared array using the Atomics.store method. Once
     * stored it then notifies any process that is waiting and looking at index 0 to check the index. 
     * Which should be the worker Thread that had been created.
     */
    resumeThread() {
        Atomics.store(this.array, 0, 1);
        Atomics.notify(this.array, 0);
        this.currentIndex++;
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
        return Graph.algorithmChangeManager.index > 0;
    }

    canStepForward() {
        return true;
    }

    stepBack() {
        if (this.currentIndex == 0) return;
        Graph.algorithmChangeManager.undo();
        this.currentIndex--;
    }

    stepForward() {
        if (!this.canStepForward()) return;
        if (Graph.algorithmChangeManager.index === Graph.algorithmChangeManager.length) {
            this.resumeThread();
        } else {
            Graph.algorithmChangeManager.redo();
        }
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
    }

    #onMessage(message) {
        switch (message.action) {
            case "addNode":
                Graph.algorithmChangeManager.addNode(message.x, message.y);
                this.tempStepSize++;
            case "prompt":
                this.PromptService.addPrompt(
                    { type: 'input', label: message.content[0] },
                    (value) => {
                        this.enterPromptResult(value);
                    }
                );
                this.tempStepSize++;
                break;
            case "message":
                this.tempStepSize++;
                break;
            case "deleteNode":
                Graph.algorithmChangeManager.deleteNode(message.nodeId);
                this.tempStepSize++;
                break;
            case "deleteEdge":
                Graph.algorithmChangeManager.deleteEdge(message.source, message.target);
                this.tempStepSize++;
                break;
            case "setNodeAttribute":
                Graph.algorithmChangeManager.setNodeAttribute(message.nodeId, message.name, message.value);
                this.tempStepSize++;
                break;
            case "setNodeAttributeAll":
                Graph.algorithmChangeManager.setNodeAttributeAll(message.name, message.value);
                this.tempStepSize++;
                break;
            case "setEdgeAttribute":
                Graph.algorithmChangeManager.setEdgeAttribute(message.source, message.target, message.name, message.value);
                this.tempStepSize++;
                break;
            case "setEdgeAttributeAll":
                Graph.algorithmChangeManager.setEdgeAttributeAll(message.name, message.value);
                this.tempStepSize++;
                break;
            case "stepStart":
                this.tempStepSize = 0;
                break;
            case "stepEnd":
                this.stepSizes.push(this.tempStepSize);
                this.tempStepSize = 0;
                break;
                
        }
    }
}
