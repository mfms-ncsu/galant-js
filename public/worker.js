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
  // the incoming port
  var port = e.ports[0];
  // the port serves as the reference to that window, so we add it to our window list
  allPorts.push(port);

  port.addEventListener('message', function(e) {
    // get the message sent to the worker
    var message = e.data[0];
    // send the message to ALL connected worker ports!

    if(message["message"] === "graph-init") {
      lastMessage = message;
    }

    if(message["message"] === "alive") {
      port.postMessage(lastMessage);
    } else {
      allPorts.forEach(port => {
        port.postMessage(message);
      })
    }
  });

  port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
}
