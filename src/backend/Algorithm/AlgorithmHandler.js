class AlgorithmHandler {

    constructor(onMessage, onStatusChanged) {
        this.onMessage = onMessage;
        this.onStatusChanged = onStatusChanged;

        this.graph = null;
        this.updateGraph = null;
        this.algorithm = null;

        this.stepHandler = null;
        this.threadHandler = null;
    }

    #resetAlgorithm() {
        if (this.stepHandler != null) {
            this.stepHandler.revertAll();
        }
        if (this.threadHandler != null) {   
            this.threadHandler.killThread();
        }
    }
    
    #initAlgorithm() {
        if (this.graph != null && this.updateGraph != null && this.algorithm != null) {
            let graphCopy = JSON.parse(JSON.stringify(graph));
            this.threadHandler = new ThreadHandler(graphCopy, algorithm);
            this.stepHandler = new StepHandler(this.updateGraph, this.threadHandler.resumeThread);
            this.threadHandler.onMessage = (message) => {
                if (message.type == "rule") {
                    this.stepHandler.ruleStep(message.rule);
                    this.#broadcastStatus();
                }
                if (this.onMessage != null) {
                    this.onMessage(message);
                }
            }
        }

    }

    #broadcastStatus() {
        if (this.onStatusChanged != null) {
            this.onStatusChanged(this.stepHandler.getStatus());
        }
    }

    setGraph(graph, updateGraph) {
        this.#resetAlgorithm();
        this.graph = graph;
        this.updateGraph = updateGraph;
        this.#initAlgorithm();
    }

    setAlgorithm(algorithm) {
        this.#resetAlgorithm();
        this.algorithm = algorithm;
        this.#initAlgorithm();
    }

    stepForward() {
        this.stepHandler.stepForward();
        this.#broadcastStatus();
    }

    stepBack() {
        this.stepHandler.stepBack();
        this.#broadcastStatus();
    }

    
}