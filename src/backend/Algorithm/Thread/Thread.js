/* eslint-disable no-unused-vars */
import Predicates from "backend/Graph/Predicates.js";
import Graph from "backend/Graph/Graph.js";

// The array has one purpose: telling the thread to run or wait with Atomics.wait().
// If sharedArray[0] is 0, that means the Thread should wait. Once it is changed, the Thread wakes up from Atoimics.notify() from the Handler.
let sharedArray;
//Instance of the graph that the thread will be working with
let predicates;

/**
 * This is the listener for the Thread. It should recieve a SharedArray first, then an algorithm to run. 
 * 
 * @param {array} message - Has two main parts: subject and body. The first index is a string with the 
 *                          subject of the message. That is, what should be expected in the body. It can be:
 *                              - "shared": message[1] is the shared array that the Thread will `wait` on later.
 *                              - "algorithm/graph": message[1] is the graph object, message[2] is the algorithm
 * 
 * @author Noah
 * @author Andrew
 */
self.onmessage = message => { /* eslint-disable-line no-restricted-globals */
    message = message.data
    if (message[0] === 'shared') {
        sharedArray = message[1];
    }
    else if (message[0] === 'graph/algorithm') {
        let jsonGraph = message[1];
        let graph = new Graph(jsonGraph.nodes, jsonGraph.edges, jsonGraph.directed, jsonGraph.message);
        predicates = new Predicates(graph);
        print("Algorithm initialized");
        wait();

        try {
            eval(message[2]); /* eslint-disable-line no-eval */
            print("Algorithm completed");
            postMessage({type: "complete"});
        } catch (error) {
            // if there's an error, send a message with the error
            postMessage({type: "error", content: error});
            throw error
        }

    }
}

function getNodes() {
    return predicates.get().getNodes();
}

function mark(node) {
    // mark the node (getting an updated copy of the graph), then wait for a resume command
    let rule = predicates.update((graph) => {
        graph.mark(node);
    });
    postMessage({type: "rule", content: rule});
    wait();
}

function print(message) {
    postMessage({type: "console", content: message});
}

function display(message) {
    let rule = predicates.update((graph) => {
        graph.display(message);
    });
    postMessage({type: "rule", content: rule});
    wait();
}

function wait() {
    Atomics.store(sharedArray, 0, 0);
    Atomics.wait(sharedArray, 0, 0);
}
