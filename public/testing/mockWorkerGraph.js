/**
 * This is the shared worker that is shared between all of the different windows of the browser.
 * Currently this worker just recieves a message and broadcasts it to all the windows attached to it.
 * 
 * A potential refactor is to judge off the message attribute and only forward to the relevant port
 */

// Borrowed from
// https://stackoverflow.com/questions/64181873/how-to-share-data-with-sharedworker

//the list of connected windows by their port to the worker
const allPorts = [];

let lastMessage = {};

/**
 * When a webpage calls to create a worker this function is called
 */
onconnect = function(e) {
    var port = e.ports[0];

    port.addEventListener('message', function(e) {
        // Relay message back
        var message = e.data[0];
        port.postMessage(message);
    });

    port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.

    setTimeout(() => {
        port.postMessage({message: 'graph-init', name: 'New Graph1', graph: "n a 0 0\nn b 20 0\ne a b"});
    }, 500);
}
