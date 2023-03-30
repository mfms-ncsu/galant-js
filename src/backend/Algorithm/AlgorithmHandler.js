import StepHandler from "./StepHandler";
import Predicates from "backend/Graph/Predicates";
import ThreadHandler from "./Thread/ThreadHandler";
import {produce} from 'immer';

export default class AlgorithmHandler {

    /** @var {int} timeoutID - the ID of the timeout instance so that it can be canceled if we get a good message */
    #timeoutID;
    /** @var {int} timeoutPeriod - the number of miliseconds before a timeout happens. DONT CHANGE THIS */
    #timeoutPeriod = 5000;

    /**
     * 
     * @param {function} setAlgError function from the parent to set the error box
     */
    constructor(graph, algorithm, updateGraph, onMessage, onStatusChanged, setAlgError) {
        this.graph = graph;
        this.algorithm = algorithm;
        this.updateGraph = updateGraph;
        this.onMessage = onMessage;
        this.onStatusChanged = onStatusChanged;
        this.setAlgError = setAlgError

        this.#initAlgorithm();
    }
    
    #initAlgorithm() {
        this.threadHandler = new ThreadHandler(this.graph, this.algorithm, (message) => this.#onMessage(message));
        this.stepHandler = new StepHandler(this.updateGraph, () => this.threadHandler.resumeThread());
        this.threadHandler.startThread();
        
        this.onStatusChanged(this.stepHandler.getStatus());
    }

    #onMessage(message) {
        // TODO ONCE WE CHANGE TO JUST STOPPING ON STEPS, GET RID OF THE RULE IN THIS LIST
        // if we get a step or an error, stop the timeout.
        if (["rule", "step", "error"].includes(message.type.toString())) {
            clearTimeout(this.#timeoutID)
        }
        if (message.type == "rule") {
            this.stepHandler.ruleStep(message.content);
            this.#broadcastStatus();
        } else if (message.type == "error") {
            // display an error box. yes I know this code is hideous but its what we've got.
            if (this.setAlgError != null) {
                this.setAlgError(message.content, this.algorithm)
                this.threadHandler.killThread()
            }
        } else if (this.onMessage != null) { // console messages
            this.onMessage(message.content);
        }
    }

    #broadcastStatus() {
        if (this.onStatusChanged != null) {
            this.onStatusChanged(this.stepHandler.getStatus());
        }
    }

    setGraph(graph) {
        this.threadHandler.killThread();
        this.graph = graph;
        this.#initAlgorithm();
    }

    setAlgorithm(algorithm) {
        this.stepHandler.revertAll();
        this.threadHandler.killThread();
        this.algorithm = algorithm;
        this.#initAlgorithm();
    }

    stepForward() {
        let needToTimeout = this.stepHandler.stepForward();
        if (needToTimeout) {
            this.#timeoutID = setTimeout(() => {
                this.threadHandler.killThread();
                var errorToSend = new Error("Timeout has occurred.");
                errorToSend.lineNumber = -1;
                this.setAlgError(errorToSend, this.algorithm);
            }, this.#timeoutPeriod);
        }
        this.#broadcastStatus();
    }

    stepBack() {
        this.stepHandler.stepBack();
        this.#broadcastStatus();
    }


}