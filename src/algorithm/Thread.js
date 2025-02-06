/**
 * 
 * 
 * @author Henry Morris
 */

/**
 * The array has one purpose: telling the thread to run or wait with Atomics.wait().
 * If sharedArray[0] is 0, that means the Thread should wait. Once it is changed, the 
 * Thread wakes up from Atoimics.notify() from the Handler.
 */
let sharedArray;

let graph;

/**
 * This function uses Atomics to cause the algorithm to wait for user input before continuing
 */
function wait() {
    Atomics.store(sharedArray, 0, 0);
    Atomics.wait(sharedArray, 0, 0);
}

function addNode(x, y, nodeId) {
    postMessage({
        action: "addNode",
        nodeId: nodeId,
        x: x,
        y: y
    });
}

function setNodeAttribute(nodeId, name, value) {
    postMessage({
        action: "setNodeAttribute",
        nodeId: nodeId,
        name: name,
        value: value
    });
}

function setNodeAttributeAll(name, value) {
    postMessage({
        action: "setNodeAttributeAll",
        name: name,
        value: value
    });
}

function getNodeAttribute(nodeId, name) {
    let attr = postMessage({
        action: "getNodeAttribute",
        nodeId: nodeId,
        name: name
    });

    console.log(attr)
}

/**
 * Receives the shared array reference and a copy of the algorithm code from
 * the Algorithm which created this thread.
 * @param {Array} message Array containing a message type and message content
 */
self.onmessage = message => { /* eslint-disable-line no-restricted-globals */
    message = message.data;
    if (message[0] === "shared") {
        sharedArray = message[1];

    } else if (message[0] === "algorithm") {
        wait();

        try {
            eval(message[1]); /* eslint-disable-line no-eval */
            console.log("Algorithm completed");
            postMessage({type: "complete"});

        } catch (error) {
            // if there's an error, send a message with the error
            postMessage({type: "error", content: error});
            throw error
        }
    }
}
