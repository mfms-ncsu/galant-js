
export default class ThreadHandlerDemo {
    constructor(predicates, algorithm, onMessage) {
        this.predicates = predicates;
        this.postMessage = onMessage;
    }

    startThread() {
        this.postMessage({type: "console", content: "Started thread"});
    }

    resumeThread() {
        // Example algorithm for testing. Marks every node, sends an error at the end.
        for (let node of this.predicates.get().getNodes()) {
            if (this.predicates.get()["nodes"][node].marked !== true) {
                this.postMessage({type: "console", content: "Marked node " + node});
                let rule = this.predicates.update((graph) => {
                    graph["nodes"][node].marked = true;
                });
                this.postMessage({type: "rule", content: rule});
                return;
            }
        }
        let rule = this.predicates.update((graph) => {
            graph.display("All nodes are marked");
        });
        this.postMessage({type: "rule", content: rule});
        this.postMessage({type: "error", content: "Example error"});
    }

    killThread() {
        this.postMessage({type: "console", content: "Killed thread"});
    }
}