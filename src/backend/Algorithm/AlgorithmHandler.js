import StepHandler from "./StepHandler";
import { Fireworks } from 'fireworks-js'
var ThreadHandler = null

export default class AlgorithmHandler {

    /** @var {int} timeoutID - the ID of the timeout instance so that it can be canceled if we get a good message */
    #timeoutID;
    /** @var {int} timeoutPeriod - the number of miliseconds before a timeout happens. DONT CHANGE THIS */
    #timeoutPeriod = 5000;

    /**
     * @param {function} setAlgError function from the parent to set the error box
     */
    constructor(graph, algorithm, updateGraph, onMessage, onStatusChanged, setAlgError, setAlgPrompt, testFlag = null) {
        this.graph = graph;
        this.algorithm = algorithm;
        this.updateGraph = updateGraph;
        this.onMessage = onMessage;
        this.onStatusChanged = onStatusChanged;
        this.setAlgError = setAlgError
        this.setAlgPrompt = setAlgPrompt
        
        var threadHandlerImport = "./Thread/ThreadHandler"
        if (testFlag) {
            threadHandlerImport += 'Demo';
        }
        import(`${threadHandlerImport}`).then(module => {
            ThreadHandler = module.default;
            this.#initAlgorithm();
        }).catch(error => console.log(error));
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
        if (["step", "error", "complete", "prompt", "fireworks"].includes(message.type.toString())) {
            clearTimeout(this.#timeoutID)
        }
        if (message.type === "rule") {
            this.stepHandler.addRule(message.content);
        } else if (message.type === "step") {
            this.stepHandler.completeStep();
            this.#broadcastStatus();
        } else if (message.type === "error") {
            // display an error box. yes I know this code is hideous but its what we've got.
            if (this.onMessage != null) { // console messages
                this.onMessage(message.content);
            }
            if (this.setAlgError != null) {
                this.setAlgError(message.content, this.algorithm)
                this.threadHandler.killThread()
            }
        } else if (message.type === "prompt") {
            if (this.setAlgPrompt != null) {
                this.setAlgPrompt(message.content[0], message.content[1])
            }
        } else if (message.type === "complete") {
            this.threadHandler.killThread()
        } else if (message.type === "fireworks") {
            console.log("launching")
            // :) fireworks run until you click the screen, then they stop
            const fireworks_div = document.createElement('div');
            fireworks_div.id = "fireworks_div";
            fireworks_div.style.cssText = "position:fixed;width:100%;height:100%;top:0px;left:0px;z-index:100000;"
            fireworks_div.setAttribute("onclick", "let selfToRemove=document.getElementById('fireworks_div');selfToRemove.parentNode.removeChild(selfToRemove)")
            document.getElementById('root').appendChild(fireworks_div);
            const container = document.querySelector('#fireworks_div');
            const fireworks = new Fireworks(container, { })
            fireworks.start()
            this.onMessage(message.content)
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

    setupTimeout() {
        this.#timeoutID = setTimeout(() => {
            this.threadHandler.killThread();
            if (this.onMessage != null) { // console message
                this.onMessage("Timeout has occurred.");
            }
            var errorToSend = new Error("Timeout has occurred.");
            errorToSend.lineNumber = -1;
            this.setAlgError(errorToSend, this.algorithm);
        }, this.#timeoutPeriod);
    }

    stepForward() {
        let needToTimeout = this.stepHandler.stepForward();
        if (needToTimeout) {
            this.setupTimeout();
        }
        this.#broadcastStatus();
    }

    stepBack() {
        this.stepHandler.stepBack();
        this.#broadcastStatus();
    }

    enterPromptResult(promptResult) {
        this.threadHandler.enterPromptResult(promptResult);
        this.setupTimeout();
    }
}
