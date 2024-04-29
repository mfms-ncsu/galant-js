/**
 * Algorithm Class
 * 
 * Represents an algorithm timeline based on an initial graph and algorithm code.
 * Handles the execution of the algorithm, managing steps and interactions.
 * 
 * @author Julian Madrigal
 * @author Vitesh Kambara
 * @author Christina Albores
 */

// Import necessary modules
import { AlgorithmStepSnapshot } from "./AlgorithmStepSnapshot";
import { StepBuilder } from "./StepBuilder";
import { AlgorithmConfiguration } from "./AlgorithmConfiguration";
import { enablePatches, applyPatches } from "immer";

enablePatches();

/**
 * @typedef {import('utils/Graph').default} Graph
 */



/**
 * Algorithm class that creates an algorithm timeline based on an initial graph and algorithm code.
 * @author Julian Madrigal
 */
export default class Algorithm {

    /** @property {int} timeoutID - the ID of the timeout instance so that it can be canceled if we get a good message */
    #timeoutID;
    /** @property {int} timeoutPeriod - the number of miliseconds before a timeout happens. DONT CHANGE THIS */
    #timeoutPeriod = 5000;

    /**
     * Constructor for Algorithm
     * @param {string} name The name of the algorithm
     * @param {string} algorithmCode The code of the algorithm
     * @param {Graph} baseGraph The initial graph state
     * @param {Object} services Services required for the algorithm
     * @param {Array} stateVar State variable
     */
    constructor(name, algorithmCode, baseGraph, services, stateVar, testFlag = null) {
        /**
         * @type {AlgorithmStepSnapshot[]}
         */
        this.steps = [];

        const [status, setStatus] = stateVar;
        this.status = status;
        this.setStatus = setStatus;
        this.currentIndex = 0;
        this.fetchingSteps = false;

        this.name = name;
        const initialStep = new AlgorithmStepSnapshot(baseGraph)
        this.steps.push(initialStep); // All algorithms should start with step 0 being the unmodified graph
        this.algorithmCode = algorithmCode;
        this.services = services;
        this.stepBuilder = new StepBuilder(initialStep);
        this.configuration = new AlgorithmConfiguration();

    var threadHandlerImport = "./Thread/ThreadHandler";
    if (testFlag) {
        threadHandlerImport += 'Demo';
    }

    import(`${threadHandlerImport}`).then(module => {
        console.log(module);
        const ThreadHandler = module.default;
        const initialStep = new AlgorithmStepSnapshot(baseGraph);
        this.stepBuilder = new StepBuilder(initialStep);
        this.threadHandler = new ThreadHandler(baseGraph, algorithmCode, (message) => this.#onMessage(message));

        this.threadHandler.startThread();
    }).catch(error => console.log(error));
    }


    /**
     * This simply triggers setStatus which will trigger a re-render of components that use algorithm.
     * This is important because much of our logic uses useEffect(..., [algorithm])
     */
    #updateStatus() {
        this.setStatus({});
    }


    /**
     * Handler for incoming messages from the thread
     * 
     * @param {Object} message The incoming message
     */
    #onMessage(message) {
        // if we get a step or an error, stop the timeout.
        if (["step", "error", "complete", "prompt"].includes(message.type.toString())) {
            clearTimeout(this.#timeoutID);
        }
        
        if (message.type === "rule") {
            this.stepBuilder.addRule(message.content);
        } else if (message.type === "step") {
            const step = this.stepBuilder.build();
            this.steps.push(step);
            this.stepBuilder = new StepBuilder(step);
            if (this.onStepAdded) this.onStepAdded();
        } else if (message.type === "error") {
            this.services.PromptService.addPrompt({type: 'algorithmError', errorObject: message.content, algorithmCode: this.algorithmCode}, () => {});
        } else if (message.type === "prompt") {
            this.services.PromptService.addPrompt(
                {type: 'input',label: message.content[0]},
                (value) => {
                    this.threadHandler.enterPromptResult(value);
                    this.#setupTimeout();
                }
            );
        } else if (message.type === "config") {
            console.log(message.config);
            this.configuration.applyOptions(message.config);
        } else if (message.type === "complete") {
            this.threadHandler.killThread()
            this.completed = true;
            this.fetchingSteps = false;
            this.#updateStatus();
        } else if (message.type === "console") {
            console.log("[Algorithm]: ", message.content);
        }
        else if (this.onMessage != null) { // console messages
            this.onMessage(message.content);
        }
    }

    /**
     * Sets up a timeout for the thread
     */
    #setupTimeout() {
        this.#timeoutID = setTimeout(() => {
            this.threadHandler.killThread();
            if (this.onMessage != null) { // console message
                this.onMessage("Timeout has occurred.");
            }
            var errorToSend = new Error("Timeout has occurred.");
            errorToSend.lineNumber = -1;
            this.services.PromptService.addPrompt({type: 'algorithmError', errorObject: errorToSend, algorithmCode: this.algorithmCode}, () => {});
        }, this.#timeoutPeriod);
    }

    
    /**
     * Checks if the algorithm can step forward
     * If algo complete, and at final step.
     * 
     * @returns {boolean} Whether the algorithm can step forward
     */
    canStepForward() {
        if (this.fetchingSteps) return false;
        if (this.completed && this.currentIndex >= this.steps.length - 1) return false;
        return true;
    }

    /**
     * Checks if the algorithm can step backward
     * 
     * @returns {boolean} Whether the algorithm can step backward
     */
    canStepBack() {
        if (this.currentIndex <= 0) return false;
        return true;
    }

    /**
     * Steps forward in the algorithm execution
     * 
     * @param {Function} callback Callback function to execute after stepping forward
     */
    stepForward(callback) {
        if (!this.canStepForward()) return;
        if (this.currentIndex == this.steps.length - 1) {
            this.fetchingSteps = true;
            this.threadHandler.resumeThread();
            this.#setupTimeout();
            this.#updateStatus();

            this.onStepAdded = () => {
                this.currentIndex++;
                this.fetchingSteps = false;
                this.#updateStatus();
                if (callback) callback();
            }
        } else {
            this.currentIndex++;
            this.#updateStatus();
        }
    }

    /**
     * Steps forward all the way to the last step created by the algorithm, needs to be called recursively
     * to keep requesting new steps until the end is reached and skipping to that last step
     * @param {Function} callback Callback function to allow this function to be implemented recursively as it is in skipToEnd() below
     * @returns 
     */
    skipToEndStep(callback) {
        if (!this.canStepForward()) return;
        if (this.currentIndex == this.steps.length - 1) {
            this.fetchingSteps = true;
            this.threadHandler.resumeThread();
            this.#setupTimeout();
            this.#updateStatus();

            this.onStepAdded = () => {
                this.currentIndex++;
                this.fetchingSteps = false;
                this.#updateStatus();
                if (callback) callback();
            }
        } else {
            this.currentIndex = this.steps.length - 1;
            this.#updateStatus();
            if (callback) callback();
        }
    }

    /**
     * Steps backward in the algorithm execution
     */
    stepBack() {
        if (!this.canStepBack()) return;
        this.currentIndex--;
        this.#updateStatus();
    }

    /**
     * Skip all the way to the last step in an algorithm 
     * or to 250th step forward in case algorithm is never-ending
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

}
