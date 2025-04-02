import { getDefaultStore } from "jotai";
import { algorithmChangeManagerAtom, graphAtom, promptQueueAtom } from "states/_atoms/atoms";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import PromptInterface from "interfaces/PromptInterface/PromptInterface";

/**
 * AlgorithmInterface contains functions to check and augment the algorithm.
 * 
 * @author Henry Morris
 * @author Krisjian Smith 
 */

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
 * When the algorithm is in a step, these will be updated instead of
 * the main atom. This is to prevent the window from redrawing, so the
 * change appears atomic.
 */
let [tempGraph, tempChangeManager] = [];


/**
 * Updates the state of the graph and changeManager, as long as we are
 * not in a step function. If we are in a step function, then we will
 * update the temporary graph and state instead.
 *
 * @param {graph} the graph to set as the state
 * @param {changeManager} the changeManager to set as the state
 */
function updateState(graph, changeManager) {
    
    if (changeManager.isRecording) {
        // Record the changes into the temporary graph and changeManager
        [tempGraph, tempChangeManager] = [graph, changeManager];
        return;
    }

    // Otherwise, record the change to the actual state to update
    // the display
    store.set(graphAtom, graph);
    store.set(algorithmChangeManagerAtom, changeManager);
}

/**
 * Sets up a timeout for the thread to run a step.
 * @param algorithm Algorithm on which to operate
 */
function setupTimeout(algorithm) {
    algorithm.timeoutId = setTimeout(() => {
        // Kill the thread
        killThread(algorithm);
        
        // Create an error
        var err = new Error("Timeout has occurred.");
        err.lineNumber = -1;

        // Prompt the user with the error
        let newQueue = PromptInterface.queuePrompt(
            promptQueue,
            { type: 'algorithmError', errorObject: err, algorithmCode: algorithm.code },
            () => {}
        );
        store.set(promptQueueAtom, newQueue);
    }, algorithm.timeoutPeriod);
}

/**
 * Toggles the debug mode on or off.
 * * @param algorithm Algorithm on which to operate
 */
function toggleDebugMode(algorithm) {
    algorithm.debugMode = !algorithm.debugMode;
    algorithm.flags[0] = algorithm.debugMode ? 1 : 0;
}

/**
 * Stores a 1 in the shared array and notifies the Thread that it can resume.
 * * @param algorithm Algorithm on which to operate
 */
function resumeThread(algorithm) {
    Atomics.store(algorithm.array, 0, 1);
    Atomics.notify(algorithm.array, 0);
}

/**
 * This kills the worker Thread, stopping he worker and clearing its space.
 * @param algorithm Algorithm on which to operate
 */
function killThread(algorithm) {
    if (algorithm.worker) {
        algorithm.worker.terminate();
    }
}

/**
 * Checks whether the algorithm can step back.
 * @returns True if it can, false otherwise
 */
function canStepBack() {
    return changeManager.index > 0;
}

/**
 * Checks whether the algorithm can step forward.
 * @param algorithm Algorithm on which to operate
 * @returns True if it can, false otherwise
 */
function canStepForward(algorithm) {
    if (algorithm.fetchingSteps) return false;
    if (algorithm.completed && changeManager.index >= changeManager.changes.length) return false;
    return true;
}

/**
 * Moves back a step.
 * * @param algorithm Algorithm on which to operate
 */
function stepBack(algorithm) {
    if (!canStepBack()) return;
    let [newGraph, newChangeManager] = GraphInterface.undo(graph, changeManager);
    store.set(graphAtom, newGraph);
    store.set(algorithmChangeManagerAtom, newChangeManager);
}

/**
 * Moves forward one step. If you want to step until the end of the algorithm 
 * (Or 250 steps, whichever comes first).
 * @param algorithm Algorithm on which to operate
 */
function stepForward(algorithm) {
    // Immediately return if the algorithm cannot continue
    if (!canStepForward(algorithm)) return;

    // If we are at the end of the list of changes, we need to wake up the thread to generate a new step
    if (changeManager.index === changeManager.changes.length) {
        algorithm.fetchingSteps = true;

        resumeThread(algorithm); // Resume the thread
        setupTimeout(algorithm); // Set the timer

        // Once the step is complete:
        algorithm.onStepAdded = () => {
            algorithm.fetchingSteps = false;
        };
    } else {
        // Use redo if there are pre-loaded steps ahead of the index
        let [newGraph, newChangeManager] = GraphInterface.redo(graph, changeManager);
        store.set(graphAtom, newGraph);
        store.set(algorithmChangeManagerAtom, newChangeManager);
    }
}

/**
 * This stores in the shared array the length of the promptResult at index 1
 * and then puts each character of the promptResult in the shared array starting
 * at index 2.
 * @param algorithm Algorithm on which to operate
 * @param {Object} promptResult the result from prompting the user for input
 */
function enterPromptResult(algorithm, promptResult) {
    let len = Math.min(promptResult.length, 254)
    Atomics.store(algorithm.array, 1, len);
    for (let i = 0; i < len; i++) {
        Atomics.store(algorithm.array, i + 2, promptResult.charCodeAt(i));
    }
    resumeThread(algorithm);

    if (algorithm.onStepAdded) algorithm.onStepAdded();
}

/**
 * This method undoes all changes that the current Algorithm did
 */
function revert() {
    let [newGraph, newChangeManager] = GraphInterface.revert(graph, changeManager);

    store.set(graphAtom, newGraph);
    store.set(algorithmChangeManagerAtom, newChangeManager);
}

/**
 * Handles messages from thread.
 * @param algorithm Algorithm on which to operate
 * @param {Object} message Message from thread
 */
function onMessage(algorithm, message) {
    // Create new variables to set
    let [newGraph, newChangeManager] = [];
    let newQueue;
    
    // Use the graph, unless we are in a recording. In that case,
    // use the temporary graph
    let graphToUse = graph;
    if (changeManager.isRecording) {
        graphToUse = tempGraph;
    }

    // Same for the changeManager
    let changeManagerToUse = changeManager;
    if (changeManager.isRecording) {
        changeManagerToUse = tempChangeManager;
    }

    switch (message.action) {
        case "setDirected":
            newGraph = GraphInterface.setDirected(graphToUse, message.isDirected);
            store.set(graphAtom, newGraph);
            break;
        case "addNode":
            [newGraph, newChangeManager] = GraphInterface.addNode(graphToUse, changeManagerToUse, message.x, message.y);
            updateState(newGraph, newChangeManager);
            break;
        case "addEdge":
            [newGraph, newChangeManager] = GraphInterface.addEdge(graphToUse, changeManagerToUse, message.source, message.target);
            updateState(newGraph, newChangeManager);
            break;
        case "prompt":
            clearTimeout(algorithm.timeoutId); // Cancel the timer while the prompt is up
            newQueue = PromptInterface.queuePrompt(
                promptQueue,
                { type: 'input', label: message.content[1] || message.content[0] },
                (value) => {
                    setupTimeout(algorithm); // Start the timeout timer back up
                    enterPromptResult(algorithm, value); // Send the enetered value to the thread
                }
            );
            store.set(promptQueueAtom, newQueue);
            break;
        case "message":
            newChangeManager = GraphInterface.addMessage(changeManagerToUse, message.message);
            updateState(graphToUse, newChangeManager);
            break;
        case "print":
            console.log(message.message);
            break;
        case "deleteNode":
            [newGraph, newChangeManager] = GraphInterface.deleteNode(graphToUse, changeManagerToUse, message.nodeId);
            updateState(newGraph, newChangeManager);
            break;
        case "setNodePosition":
            [newGraph, newChangeManager] = GraphInterface.setNodePosition(graphToUse, changeManagerToUse, message.nodeId, message.x, message.y);
            updateState(newGraph, newChangeManager);
            break;
        case "deleteEdge":
            [newGraph, newChangeManager] = GraphInterface.deleteEdge(graphToUse, changeManagerToUse, message.source, message.target);
            updateState(newGraph, newChangeManager);
            break;
        case "setNodeAttribute":
            [newGraph, newChangeManager] = GraphInterface.setNodeAttribute(graphToUse, changeManagerToUse, message.nodeId, message.name, message.value);
            updateState(newGraph, newChangeManager);
            break;
        case "setNodeAttributeAll":
            [newGraph, newChangeManager] = GraphInterface.setNodeAttributeAll(graphToUse, changeManagerToUse, message.name, message.value);
            updateState(newGraph, newChangeManager);
            break;
        case "setEdgeAttribute":
            [newGraph, newChangeManager] = GraphInterface.setEdgeAttribute(graphToUse, changeManagerToUse, message.source, message.target, message.name, message.value);
            updateState(newGraph, newChangeManager);
            break;
        case "setEdgeAttributeAll":
            [newGraph, newChangeManager] = GraphInterface.setEdgeAttributeAll(graphToUse, changeManagerToUse, message.name, message.value);
            updateState(newGraph, newChangeManager);
            break;
        case "startRecording":
            newChangeManager = GraphInterface.startRecording(changeManagerToUse);

            // Make clones of the graph and changeManager into the
            // tempGraph and tempChangeManager variables. These can
            // be updated without redrawing the screen, since they
            // are not react states
            
            tempGraph = structuredClone(graph);
            tempChangeManager = structuredClone(newChangeManager);

            store.set(algorithmChangeManagerAtom, newChangeManager);
            break;
        case "endRecording":
            clearTimeout(algorithm.timeoutId);
            // End the recording, but only if it started. It is possible that the user was in debug mode, which
            // means that the recording was never actually started
            if (changeManagerToUse.isRecording) {
                newChangeManager = GraphInterface.endRecording(changeManagerToUse);
                store.set(algorithmChangeManagerAtom, newChangeManager);
                store.set(graphAtom, tempGraph);
            }
            if (algorithm.onStepAdded) algorithm.onStepAdded();
            break;
        case "step":
            clearTimeout(algorithm.timeoutId);
            if (algorithm.onStepAdded) algorithm.onStepAdded();
            // The following two lines were causing the program to
            // crash. I don't know their intended purpose, but they
            // set the graph and changeManager to undefined. This causes
            // a crash when the program next tries to access the graph
            // or change manager.
            //
            // store.set(graphAtom, newGraph);
            // store.set(algorithmChangeManagerAtom, newChangeManager);
            break;
        case "complete":
            clearTimeout(algorithm.timeoutId);
            if (algorithm.onStepAdded) algorithm.onStepAdded();
            algorithm.completed = true;
            break;
        case "error":
            newQueue = PromptInterface.queuePrompt(
                promptQueue,
                { type: "algorithmError", errorObject: message.error, algorithmCode: algorithm.code },
                () => {}
            );
            store.set(promptQueueAtom, newQueue);
            break;
        default:
            // If the message was not a type we define here, then we probably just made a mistake 
            // or typo when sending this message. Throw an error to let us know about it
            throw new Error("Unexpected message type: " + message.action);
    }
}

const AlgorithmInterface = {
    canStepBack,
    canStepForward,
    enterPromptResult,
    onMessage,
    setupTimeout,
    stepBack,
    stepForward,
    toggleDebugMode,
    revert
};
export default AlgorithmInterface;
