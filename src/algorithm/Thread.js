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
 * Sets a new attribute for the given class of graph element.
 * @param {String} type Either nodes or edges
 * @param {String} name Attribute name
 * @param {Object} value Attribute value
 */
function setAttributeAll(type, name, value) {
    if (type === "nodes") {
        postMessage({ action: "setNodeAttributeAll", name: name, value: value });

    } else {
        postMessage({ action: "setEdgeAttributeAll", name: name, value: value });
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

function clearEdgeColors() {
    setAttributeAll("edges", "color", undefined);
}

function setEdgeWidth(id, width) {
    setAttribute(id, "edgeWidth", width);
}

function mark(nodeId) {
    setAttribute(nodeId, "marked", true);
}

function unmark(nodeId) {
    setAttribute(nodeId, "marked", false);
}

function marked(nodeId) {
    getAttribute(nodeId, "marked");
}

function clearNodeMarks() {
    setAttributeAll("nodes", "marked", false);
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

function clearNodeWeights() {
    setAttributeAll("nodes", "weight", undefined);
}

function hasWeight(id) {
    return getAttribute(id, "weight") === undefined;
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