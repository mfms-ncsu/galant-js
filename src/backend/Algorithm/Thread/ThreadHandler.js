

export default class ThreadHandler {
    constructor(predicates, algorithm, onMessage) {
        console.log("thread init");
        this.predicates = predicates;
        
        this.onMessage = onMessage;
    }

    startThread() {
        this.onMessage({type: "console", content: "Started thread"});
    }

    resumeThread() {
        // Iterate through the nodes and color them red.
        for (let node of this.predicates.get().getNodes()) {
            if (this.predicates.get().node[node].color != "red") {
                this.onMessage({type: "console", content: "Colored node " + node + " red"});
                let rule = this.predicates.update((graph) => {
                    graph.setNodeColor(node, "red");
                });
                this.onMessage({type: "rule", content: rule});
                return;
            }
        }
    }

    killThread() {
        this.onMessage({type: "console", content: "Killed thread"});
    }
}