// The api is all the functions that the user can use to animate their graph.
// import getNodes from './API.js';
//const { parentPort } = require("worker_threads");

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
// self.onmessage = message => { /* eslint-disable-line no-restricted-globals */
//     console.log(message)
//     self.postMessage("shared") /* eslint-disable-line no-restricted-globals */
// }
self.onmessage = message => { /* eslint-disable-line no-restricted-globals */
    message = message.data
    if (message[0] === 'shared') {
        sharedArray = message[1];
        console.log("recieved 'shared'");
    }
    else if (message[0] === 'graph/algorithm') {
        graph = message[1];
        eval(message[2]);
    }
}

// self.addEventListener('message', e => { /* eslint-disable-line no-restricted-globals */
//     console.log(e.data)
//   });


// function getNodes(){
//     _getNodes(graph);
// }

// function colorNode(node, color) {
//     // color the node (getting an updated copy of the graph), then wait for a resume command
//     graph = _colorNode(graph, node, color)
//     Worker.postMessage("<put a rule here>")
//     wait();
// }

function testSomething(message) {
    Worker.postMessage("This worked " + message);
    wait();
}

function wait() {
    Atomics.store(sharedArray, 0, 0);
    Atomics.wait(sharedArray, 0, 0);
}
