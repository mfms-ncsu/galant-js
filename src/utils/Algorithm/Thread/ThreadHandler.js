/**
 * Manages the thread responsible for executing the user's algorithm in a separate background thread.
 * This class handles communication between the main application and the worker thread.
 */
export default class ThreadHandler {
    //Cytoscape graph representation
    graph;
    //Test/json algorithm
    algorithm;
    //Shared buffer array to stop and start worker
    array;
    //Worker
    worker;
    //On message function to send back to the AlgorithmHandler
    onMessage;

    /**
     * Constructs the ThreadHandler object and initializes fields in preperation
     * for the ser to start the worker
     * 
     * @param {*} graph graoh from the user
     * @param {*} algorithm algorithm from tthe user
     * @param {*} onMessage Onmessage function  from AlgorithmHandler
     */
    constructor(graph, algorithm, onMessage) {
        this.graph = graph;
        this.algorithm = algorithm;
        this.onMessage = onMessage;
        this.array = new Int32Array(new SharedArrayBuffer(1024));
    }

    /**
     * This method will start the Thread. This is done by creating a worker based on
     * the Thread.js file. It sends the Worker a message with this instance of the
     * shared array and then anotehr message of the graph and algorithm. This starts
     * running the users algorithm and creates an instance of onmessage so that it
     * can recieve messages from the Thread.
     */
    startThread() {

        let handleMessage = (message) => {
            this.onMessage(message.data);
        }

        let initWorker = () => {
            this.worker = new Worker(new URL('./Thread.js', import.meta.url));

            this.worker.onmessage = handleMessage;
            this.worker.postMessage(["shared", this.array]);
            console.log('graph sent to worker', this.graph);
            this.worker.postMessage(['graph/algorithm', this.graph, this.algorithm]);
        }

        initWorker();  
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
    
    /**
     * This stores in the shared array the length of the promptResult at index 1
     * and then puts each character of the promptResult in the shared array starting
     * at index 2
     * 
     * @param {*} promptResult the result from prompting the user for input
     */
    enterPromptResult(promptResult) {
        let len = Math.min(promptResult.length, 254)
        Atomics.store(this.array, 1, len);
        for (let i = 0; i < len; i++) {
            Atomics.store(this.array, i + 2, promptResult.charCodeAt(i));
        }
        this.resumeThread();
    }
}
