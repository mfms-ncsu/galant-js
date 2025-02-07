import { Graph } from "graph/Graph";

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

/**
 * This thread's copy of the graph
 */
let graph = new Graph();

/**
 * This function uses Atomics to cause the algorithm to wait for user input before continuing
 */
function wait() {
    Atomics.store(sharedArray, 0, 0);
    Atomics.wait(sharedArray, 0, 0);
}

/**
 * Tells the thread to wait after running a step.
 */
function step(code=null) {
    (code !== null) && code();
    postMessage({type: "step"});
    wait();
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
 * Displays a new message to the user.
 * @param {String} message Message to display
 */
function display(message) {
    postMessage({ action: "message", message: message });
}

/**
 * Prints a new message to the console.
 * @param {String} message Message to print
 */
function print(message) {
    console.log(message);
}

/**
 * Gets the ids of all nodes in an array
 * @returns Ids of all nodes
 */
function getNodes() {
    return graph.getNodeArray();
}

/**
 * Gets the ids of all edges in an array
 * @returns Ids of all edges (Source,Target format)
 */
function getEdges() {
    return graph.getEdges();
}

/**
 * Gets the opposite node on the given edge.
 * @param {String} nodeId Node id
 * @param {String} edgeId Edge id (Source,Target format)
 * @returns Opposite node
 */
function other(nodeId, edgeId) {
    return graph.getOppositeNode(nodeId, edgeId);
}

/**
 * Deletes the given nodes.
 * @param {String} nodeId Node to delete
 */
function deleteNode(nodeId) {
    graph.algorithmChangeManager.deleteNode(nodeId);
    postMessage({ action: "deleteNode", nodeId: nodeId });
    step();
}

/**
 * Deletes the given edge.
 * @param {String} edgeId Edge to delete (Source,Target format)
 */
function deleteEdge(edgeId) {
    let split = edgeId.split(",");
    let source = split[0], target = split[1];
    graph.algorithmChangeManager.deleteEdge(source, target);
    postMessage({ action: "deleteEdge", source: source, target: target });
    step();
}

/**
 * Sets a new attribute value for a given graph element.
 * @param {String} id Id of the graph element to modify
 * @param {String} name Name of the attribute
 * @param {Object} value Value of the attribute
 */
function setAttribute(id, name, value) {
    if (id == null) {
        console.error("id is null! name: " + name + ", value: " + value);
    }
    if (id.includes(",")) {
        // Handle edge attribute
        let split = id.split(",");
        let source = split[0], target = split[1];
        postMessage({ action: "setEdgeAttribute", source: source, target: target, name: name, value: value });
    
    } else {
        // Handle node attribute
        postMessage({ action: "setNodeAttribute", nodeId: id, name: name, value: value });
    }
    step();
}

/**
 * Gets the value of an attribute for a given graph element.
 * @param {String} id Id of the graph element
 * @param {*} name Name of the attribute
 */
function getAttribute(id, name) {
    if (id.includes(",")) {
        // Handle edge attribute
        let split = id.split(",");
        let source = split[0], target = split[1];
        graph.getEdgeAttribute(source, target, name);

    } else {
        // Handle node attribute
        graph.getNodeAttribute(id, name);
    }
}

function color(id, color) {
    setAttribute(id, "color", color);
}

function uncolor(id) {
    setAttribute(id, "color", undefined);
}

function setEdgeWidth(id, width) {
    setAttribute(id, "edgeWidth", width);
}

function setShape(id, shape) {
    setAttribute(id, "shape", shape);
}

function weight(id) {
    getAttribute(id, "weight");
}

function setWeight(id, weight) {
    setAttribute(id, "weight", weight);
}

/**
 * Adds a node at the given x, y position.
 *
 * @param {Integer} x the x position to add the new node at
 * @param {Integer} y the y position to add the new node at
 * @return {String} the ID of the new node
 */
function addNode(x, y) {
    let id = graph.algorithmChangeManager.addNode(x, y);
    postMessage({ action: "addNode", x: x, y: y });
    step();
    return id;
}

/**
 * Removes the "marked" attribute from every node
 */
function clearNodeMarks() {
    
    // FIXME: This function for some reason sets every node to be orange. No idea why.
    // graph.algorithmChangeManager.setEveryNodeAttribute("marked", "false");
    // postMessage({ action: "setEveryNodeAttribute", name: "marked", value: "false"});
    step();
}

/**
 * Sets the weight of every node to undefined
 */
function clearNodeWeights() {
    graph.algorithmChangeManager.setEveryNodeAttribute("weight", undefined);
    postMessage({ action: "setEveryNodeAttribute", name: "weight", value: undefined});
    step();
}

/**
 * Set the "color" attribute of each node to undefined
 */
function clearEdgeColors() {
    graph.algorithmChangeManager.setEveryNodeAttribute("color", undefined);
    postMessage({ action: "setEveryNodeAttribute", name: "color", value: undefined});
    step();
}

/**
 * Returns true if the given edge has a defined weight
 *
 * @param {String} edge a string representation of the edge. The string must be in
 *                      form "src,dest", where src is the id of the source ndoe and
 *                      dest is the id of the destination node.
 * @return {Boolean} true if the edge has a defined weight (including 0), or false if
 *                   the weight is undefined
 */
function hasWeight(edge) {
    let arr = edge.split(",");
    return graph.getEdgeAttribute(arr[0], arr[1], "weight") == undefined;
}

/**
 * This function should prompt the user to enter the id of a node, and should
 * return whatever the user enters. Currently, it just returns the first node in
 * the getNodeArray() array for testing.
 */
function promptNode(message, errMessage) {
    return graph.getNodeArray()[0];
}

/**
 * Returns a list of all the outgoing edges of a specified node
 * @param {String} id the id of the node to return the outgoing nodes of
 * @return {String[]} An array representing all the outgoing edges of the graph
 */
function outgoing(node) {
    return graph.edgeArrToStringArr(graph.getOutgoingEdges(node)); 
}






/**
 * Receives the shared array reference, graph string to parse, and a copy of the 
 * algorithm code from the Algorithm which created this thread.
 * @param {Array} message Array containing a message type and message content
 */
self.onmessage = message => { /* eslint-disable-line no-restricted-globals */
    message = message.data;
    if (message[0] === "shared") {
        sharedArray = message[1];

    } else if (message[0] === "graph/algorithm") {
        // Load the graph
        graph.fileParser.loadGraph(message[1]);

        // Wait for the user to resume the algorithm
        wait();

        // Evaluate the algorithm
        try {
            eval(message[2]); /* eslint-disable-line no-eval */
            console.log("Algorithm completed");
            postMessage({type: "complete"});

        } catch (error) {
            // if there's an error, send a message with the error
            postMessage({type: "error", content: error});
            throw error
        }
    }
}
