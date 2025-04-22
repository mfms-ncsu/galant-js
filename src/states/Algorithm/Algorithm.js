import { getDefaultStore } from "jotai";
import { graphAtom } from "../_atoms/atoms";
import AlgorithmInterface from "interfaces/AlgorithmInterface/AlgorithmInterface";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";

/** Get the graph atom outside a React component */
const store = getDefaultStore(); // Get the store with the atoms to access them outside of React
let graph = store.get(graphAtom); // Get the atom values from the store
store.sub(graphAtom, () => { graph = store.get(graphAtom) }); // Subscribe to atom changes to update the values here whenever the states update

/**
 * Representation of the algorithm loaded into the program. Contains a name and code. Controls a
 * web worker called Thread, which is the execution environment for the code.
 * 
 * @author Henry Morris
 * @author Krisjian Smith
 */
export default class Algorithm {
    /** The ID of the timeout instance so that it can be canceled if we get a good message */
    timeoutId;
    /** The number of miliseconds before a timeout happens. DONT CHANGE THIS */
    timeoutPeriod = 5000;
    /** A flag that determines if the algorithm is in debug mode */
    debugMode = false;
    /** Status flags */
    fetchingSteps = false;
    completed = false;

    /**
     * Constructs a new Algorithm with name, code, a shared array, and a thread worker.
     * @param {String} name Algorithm name
     * @param {String} code Algorithm code
     */
    constructor(name, code) {
        this.name = name;
        this.code = code;
        
        // Shared array used to pass wake messages and prompt results to the Thread
        this.array = new Int32Array(new SharedArrayBuffer(1024));
        this.array[1] = 0;

        // This array is passed to the Thread running the algorithm.
        // It holds status flags, such as whether the user has entered debug mode
        // 0: debug mode
        this.flags = new Int32Array(new SharedArrayBuffer(8));
        this.flags[0] = 0;

        // Initialize the thread worker
        this.worker = new Worker(new URL("./Thread.js", import.meta.url));
        let handleMessage = (message) => { AlgorithmInterface.onMessage(this, message.data) };
        this.worker.onmessage = handleMessage;
        this.worker.postMessage(["shared", this.array, this.flags]);
        this.worker.postMessage(["graph/algorithm", GraphInterface.toString(graph), graph.isDirected, this.code]);
    }
}
