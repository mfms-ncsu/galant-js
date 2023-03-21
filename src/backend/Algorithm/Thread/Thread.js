// The api is all the functions that the user can use to animate their graph.
const api = require('./API.js');
const { parentPort } = require("worker_threads");

// The array has one purpose: telling the thread to run or wait with Atomics.wait().
// If sharedArray[0] is 0, that means the Thread should wait. Once it is changed, the Thread wakes up from Atoimics.notify() from the Handler.
let sharedArray;
//Instance of the graph that the thread will be working with
let graph;

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
parentPort.on("message", message => {
    if (message[0] == 'shared') {
        sharedArray = message[1];
    }
    else if (message[0] == 'graph/algorithm') {
        graph = message[1];
        eval(message[2]);
    }
})


function getNodes(){
    api.getNodes(graph);
}

function colorNode(node, color) {
    // color the node (getting an updated copy of the graph), then wait for a resume command
    graph = api.colorNode(graph, node, color)
    parentPort.postMessage("<put a rule here>")
    wait();
}

function testSomething(message) {
    parentPort.postMessage("This worked " + message);
    wait();
}

function wait() {
    Atomics.store(sharedArray, 0, 0);
    Atomics.wait(sharedArray, 0, 0);
}
