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
    constructor(name, code, stateVar) {
        this.name = name;
        this.code = code;
        this.array = new Int32Array(new SharedArrayBuffer(1024));

        const [status, setStatus] = stateVar;
        this.status = status;
        this.setStatus = setStatus;
        this.currentIndex = 0;
        this.fetchingSteps = false;

        // Initialize the thread worker
        this.worker = new Worker(new URL("./Thread.js", import.meta.url));
        this.worker.onmessage = this.onMessage;
        this.worker.postMessage(["shared", this.array]);
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
        return (Graph.algorithmChangeManager.length === 0) || (Graph.algorithmChangeManager.index === (Graph.algorithmChangeManager.length-1));
    }

    stepBack() {
        Graph.algorithmChangeManager.undo();
    }

    stepForward() {
        if (!this.canStepForward()) return;
        if (Graph.algorithmChangeManager.index === Graph.algorithmChangeManager.length) {
            this.resumeThread();
        }
    }

    onMessage(message) {
        message = message.data;
        
        switch (message.action) {
            case "addNode":
                Graph.algorithmChangeManager.addNode(message.x, message.y, message.nodeId);
                break;
            case "setNodeAttribute":
                Graph.algorithmChangeManager.setNodeAttribute(message.nodeId, message.name, message.value);
                break;
            case "getNodeAttribute":
                return Graph.getNodeAttribute(message.nodeId, message.name);
                break;
        }
    }
}
