import { getDefaultStore } from "jotai";
import { algorithmChangeManagerAtom, graphAtom, promptQueueAtom } from "../_atoms/atoms";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import PromptInterface from "interfaces/PromptInterface/PromptInterface";

// Get the store with the atoms to access them outside of React
const store = getDefaultStore();

// Get the atom values from the store
let graph = store.get(graphAtom);
let changeManager = store.get(algorithmChangeManagerAtom);
let promptQueue = store.get(promptQueueAtom);

// Subscribe to atom changes to update the values here whenever the states update
store.sub(graphAtom, () => { graph = store.get(graphAtom) });
store.sub(algorithmChangeManagerAtom, () => { changeManager = store.get(algorithmChangeManagerAtom) });
store.sub(promptQueueAtom, () => { promptQueue = store.get(promptQueueAtom) });

/**
 * Representation of the algorithm loaded into the program. Contains a name and code. Controls a
 * web worker called Thread, which is the execution environment for the code.
 * 
 * @author Henry Morris
 * @author Krisjian Smith
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
    constructor(name, code) {
        this.name = name;
        this.code = code;
        
        this.array = new Int32Array(new SharedArrayBuffer(1024));
        this.array[1] = 0;

        // This array is passed to the Thread running the algorithm.
        // It holds status flags, such as whether the user has entered debug mode
        // 0: debug mode
        // 1: skip to end mode (continues taking steps until 250 steps / end of algorithm)
        this.flags = new Int32Array(new SharedArrayBuffer(8));
        this.flags[0] = 0;
        this.flags[1] = 0;

        this.fetchingSteps = false;
        this.completed = false;

        // Initialize the thread worker
        this.worker = new Worker(new URL("./Thread.js", import.meta.url));
        let handleMessage = (message) => { this.#onMessage(message.data) }
        this.worker.onmessage = handleMessage;
        this.worker.postMessage(["shared", this.array, this.flags]);
        this.worker.postMessage(["graph/algorithm", GraphInterface.toString(graph), graph.isDirected, this.code]);
        this.worker.postMessage(["algorithm", this.code]);
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
            let newQueue = PromptInterface.queuePrompt(
                this.promptQueue,
                { type: 'algorithmError', errorObject: err, algorithmCode: this.code },
                () => {}
            );
            store.set(promptQueueAtom, newQueue);
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
        return changeManager.index > 0;
    }

    /**
     * Checks whether the algorithm can step forward.
     * @returns True if it can, false otherwise
     */
    canStepForward() {
        if (this.fetchingSteps) return false;
        if (this.completed && changeManager.index >= changeManager.changes.length) return false;
        return true;
    }

    /**
     * Moves back a step.
     */
    stepBack() {
        if (!this.canStepBack()) return;
        GraphInterface.undo(graph, changeManager);
    }

    /**
     * Moves forward one step. If you want to step until the end of the algorithm 
     * (Or 250 steps, whichever comes first), you can supply the optional skipToEnd parameter.
     * @param {Boolean} skipToEnd true if you want to skip all the way to the end of the 
     *                         algorithm. False or undefined if you only want to take one step
     */
    stepForward(skipToEnd) {
        // Set skipToEnd to false if nothing was given
        if (skipToEnd === undefined) skipToEnd = false;
        
        // Immediately return if the algorithm cannot continue
        if (!this.canStepForward()) return;

        // If skipToEnd is set to true, redo all saved steps in the ChangeManager
        if (skipToEnd) {
            while (changeManager.index !== changeManager.changes.length-1) {
                GraphInterface.redo();
            }
        }

        // Again, check if we can step forward. If we can't, immediately return
        if (!this.canStepForward()) return;

        // If we are at the end of the list of changes, we need to wake up the thread to generate a new step
        if (changeManager.index !== changeManager.changes.length-1) {
            this.fetchingSteps = true;
            
            // Set the skipToEnd flag to true if necessary
            this.flags[1] = skipToEnd ? 1 : 0;

            this.resumeThread(); // Resume the thread
            this.#setupTimeout() // Set the timer

            // Once the step is complete:
            this.onStepAdded = () => {
                this.fetchingSteps = false;
                this.flags[1] = 0;
            }

        } else {
            // Use redo if there are pre-loaded steps ahead of the index
            GraphInterface.redo(graph, changeManager);
        }
    }

    /**
     * Skips to the end of the algorithm execution.
     */
    skipToEnd() {
        this.stepForward(true);
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
        // Create new variables to set
        let [newGraph, newChangeManager] = [];
        let newQueue;

        switch (message.action) {
            case "setDirected":
                newGraph = GraphInterface.setDirected(graph, message.isDirected);
                store.set(graphAtom, newGraph);
                break;
            case "addNode":
                [newGraph, newChangeManager] = GraphInterface.addNode(graph, changeManager, message.x, message.y);
                store.set(graphAtom, newGraph);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "addEdge":
                [newGraph, newChangeManager] = GraphInterface.addEdge(graph, changeManager, message.source, message.target);
                store.set(graphAtom, newGraph);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "prompt":
                clearTimeout(this.#timeoutId); // Cancel the timer while the prompt is up
                newQueue = PromptInterface.queuePrompt(
                    promptQueue,
                    { type: 'input', label: message.content[1] || message.content[0] },
                    (value) => {
                        this.#setupTimeout(); // Start the timeout timer back up
                        this.enterPromptResult(value); // Send the enetered value to the thread
                    }
                );
                store.set(promptQueueAtom, newQueue);
                break;
            case "message":
                newChangeManager = GraphInterface.addMessage(changeManager, message.message);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "print":
                console.log(message.message);
                break;
            case "deleteNode":
                [newGraph, newChangeManager] = GraphInterface.deleteNode(graph, changeManager, message.nodeId);
                store.set(graphAtom, newGraph);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "setNodePosition":
                [newGraph, newChangeManager] = GraphInterface.setNodePosition(graph, changeManager, message.nodeId, message.x, message.y);
                store.set(graphAtom, newGraph);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "deleteEdge":
                [newGraph, newChangeManager] = GraphInterface.deleteEdge(graph, changeManager, message.source, message.target);
                store.set(graphAtom, newGraph);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "setNodeAttribute":
                [newGraph, newChangeManager] = GraphInterface.setNodeAttribute(graph, changeManager, message.nodeId, message.name, message.value);
                store.set(graphAtom, newGraph);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "setNodeAttributeAll":
                [newGraph, newChangeManager] = GraphInterface.setNodeAttributeAll(graph, changeManager, message.name, message.value);
                store.set(graphAtom, newGraph);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "setEdgeAttribute":
                [newGraph, newChangeManager] = GraphInterface.setEdgeAttribute(graph, changeManager, message.source, message.target, message.name, message.value);
                store.set(graphAtom, newGraph);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "setEdgeAttributeAll":
                [newGraph, newChangeManager] = GraphInterface.setEdgeAttributeAll(graph, changeManager, message.name, message.value);
                store.set(graphAtom, newGraph);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "startRecording":
                newChangeManager = GraphInterface.startRecording(changeManager);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "endRecording":
                clearTimeout(this.#timeoutId);
                // End the recording, but only if it started. It is possible that the user was in debug mode, which
                // means that the recording was never actually started
                if (changeManager.isRecording) {
                    newChangeManager = GraphInterface.endRecording(changeManager);
                    store.set(algorithmChangeManagerAtom, newChangeManager);
                }
                if (this.onStepAdded) this.onStepAdded();
                break;
            case "step":
                clearTimeout(this.#timeoutId);
                if (this.onStepAdded) this.onStepAdded();
                store.set(graphAtom, newGraph);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                break;
            case "complete":
                clearTimeout(this.#timeoutId);
                if (this.onStepAdded) this.onStepAdded();
                this.completed = true;
                break;
            case "redraw":
                break;
            case "error":
                newQueue = PromptInterface.queuePrompt(
                    promptQueue,
                    { type: "algorithmError", errorObject: message.error, algorithmCode: this.code },
                    () => {}
                );
                store.set(promptQueueAtom, newQueue);
            default:
                // If the message was not a type we define here, then we probably just made a mistake 
                // or typo when sending this message. Throw an error to let us know about it
                throw new Error("Unexpected message type: " + message.action);
        }
    }
}