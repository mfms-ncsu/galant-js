
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
            if (this.predicates.get().node[node].marked != true) {
                this.onMessage({type: "console", content: "Marked node " + node});
                let rule = this.predicates.update((graph) => {
                    graph.node[node].marked = true;
                });
                this.onMessage({type: "rule", content: rule});
                return;
            }
        }
        let rule = this.predicates.update((graph) => {
            graph.message = "All nodes are marked.";
        });
        this.onMessage({type: "rule", content: rule});
    }

    killThread() {
        this.onMessage({type: "console", content: "Killed thread"});
    }
}