// The api is all the functions that the user can use to animate their graph.
const api = require('./API.js');
const { parentPort } = require("worker_threads");
const fs = require("fs")

// The array has one purpose: telling the thread to run or wait with Atomics.wait().
// If sharedArray[0] is 0, that means the Thread should wait. Once it is changed, the Thread wakes up from Atoimics.notify() from the Handler.
let sharedArray;

/**
 * This is the listener for the Thread. It should recieve a SharedArray first, then an algorithm to run. 
 * 
 * @param {array} message - Has two main parts: subject and body. The first index is a string with the 
 *                          subject of the message. That is, what should be expected in the body. It can be:
 *                              - "shared": message[1] is the shared array that the Thread will `wait` on later.
 *                              - "run this thang": message[1] is the graph object, message[2] is the algorithm
 * 
 * @author Noah
 * @author Andrew
 */
parentPort.on("message", message => {
    fs.writeFileSync("tmp.txt", "" + message)
    
    if (message[0] === 'shared') {
        fs.writeFileSync("tmp.txt", "laskdjflkdsajflkdsa")
        sharedArray = new Int32Array(message[1]);
        fs.writeFileSync("tmp.txt", "got shared Array, about to wait. sharedArray:" + sharedArray)
        Atomics.wait(sharedArray, 0, 0)
        console.log("was awoken, sharedArray", sharedArray)
    }
    else if (message[0] == 'run this thang') {
        eval(message[2]);
    }
    
})

