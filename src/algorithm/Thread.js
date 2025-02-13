import { Graph } from "graph/Graph";

/**
 * Execution environment for algorithms. This file provides all necessary functions
 * and controls the flow of the algorithm to stop itself after each step.
 * 
 * @author Henry Morris
 * @author Krisjian Smith
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
 * Flag that is set to true when the algorithm is in a step. When
 * false, the algorithm should wait after every change to the graph. When
 * true, the algorithm should only wait when the step is finished.
 */
let isInStep;

/**
 * Waits, but only if the algorithm is not in a step
 */
function waitIfNeeded() {
    if (!isInStep) {
        wait();
    }
}

/**
 * Tells the thread to wait after running a step.
 */
function step(code=null) {
    
    // If we are already in a step, something probably went wrong,
    // since it doesn't make sense to have a step within a step.
    if (isInStep) {
        throw new Error("Step started when already in a step. Recursive steps are not allowed.");
    }

    // If there is no code in this step, an error must have happened
    if (code == null || code == undefined) {
        throw new Error("Invalid code in step. Code cannot be null or undefined.");
    }
    
    // Tell the ChangeManager to start recording our changes
    postMessage({action: "startRecording"});
    isInStep = true;

    // Execute the code in this step
    code();
    
    // End the recording of the steps
    postMessage({action: "endRecording"});
    isInStep = false;

    // Wait until we should start the next step
    wait();

}

/**************************************************************/
/************* Start of algorithm methods *********************/
/**************************************************************/

/**
 * Gets the ids of all nodes in an array
 * @returns Ids of all nodes
 */
function getNodes() {
    return graph.getNodeArray();
}

/**
 * Returns the number of nodes in the graph
 * @return the number of node in the graph
 */
function getNumberOfNodes() {
    return graph.getNumberOfNodes();
}

/**
 * Gets the ids of all edges in an array
 * @returns Ids of all edges (Source,Target format)
 */
function getEdges() {
    return graph.getEdgeIds();
}

/**
 * Returns the number of edges in the graph
 * @return the number of edges in the graph
 */
function getNumberOfEdges() {
    return graph.getNumberOfEdges();
}

/**
 * Returns the id of the source of the given edge
 * @return the id of the source of the given edge
 */
function source(edge) {
    return graph.getSource(edge);
}

/**
 * Returns the id of the target of the given edge
 * @return the id of the target of the given edge
 */
function target(edge) {
    return graph.getTarget(edge);
}

/**
 * Returns an edge between the two nodes, if one exists. Returns
 * undefined if none exists. If the graph is directed, then only
 * edges in the given direction will be returned
 * @return the edge between source and target, as described above
 */
function getEdgeBetween(source, target) {
    return graph.getEdgeBetween(source, target);
}

/**
 * Returns a list of edge between the two nodes, if one exists. Returns
 * an empty if none exists. If the graph is directed, then only
 * edges in the given direction will be returned
 * @return the edge between source and target, as described above
 */
function getEdgeBetween(source, target) {
    return graph.getEdgeBetween(source, target);
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
    if (!isInStep) { postMessage({ action: "step" }) }
    postMessage({ action: "message", message: message });
    waitIfNeeded();
}

/**
 * Prints a new message to the console.
 * @param {String} message Message to print
 */
function print(message) {
    if (!isInStep) { postMessage({ action: "step" }) }
    postMessage({ action: "print", message: message });
}

/**
 * Prompts the user for input.
 * @param {string} message The prompt message
 * @param {string} error The error message to display if input is invalid
 * @returns {string} The user input
 */
function prompt(message, error="") {
    if (message === null || message === "") {
        message = "Prompt";
    }
    postMessage({action: "prompt", content: [message, error]})
    wait();
    let len = Atomics.load(sharedArray, 1);
    let promptResult = "";
    for (let i = 0; i < len; i++) {
        promptResult += String.fromCharCode(Atomics.load(sharedArray, i + 2));
    }
    return promptResult;
}

/**
 * Recieving the prompt and options
 * @param {string} message The prompt message
 * @param {string} error The error message to display if input is invalid
 * @param {NodeObject[]} list The list of options
 * @returns {string} promptResult 
 */
function promptFrom(message, list, error) {
    if (list.length === 0) {
        throw new Error("Cannot prompt when no valid options exist.");
    }
    if (error === null) {
        error = "Must enter a value from " + list;
    }
    let promptResult = prompt(message);
    while(!list.includes(promptResult)) {
        console.log("NOT FOUND - REPROMPTING");
        promptResult = prompt(message, error);
    }
    return promptResult;
}

/**
 * Returns message for checking boolean value
 * @param {string} message The prompt message
 * @returns {string} message of checking boolean value  
 */
function promptBoolean(message) {
    return promptFrom(message, ["true", "false"], "Must enter a boolean value (true/false)") === "true";
}

/**
 * Returns message for checking integer value
 * @param {string} message The prompt message
 * @returns {string} promptResult of checking integer value  
 */
function promptInteger(message) {
    let promptResult = parseInt(prompt(message));
    while (isNaN(promptResult)) {
        promptResult = parseInt(prompt(message, "Must enter an integer"));
    }
    return promptResult;
}

/**
 * Returns message for checking float number value
 * @param {string} message The prompt message
 * @returns {string} promptResult of checking float number value  
 */
function promptNumber(message) {
    let promptResult = parseFloat(prompt(message));
    while (isNaN(promptResult)) {
        promptResult = parseFloat(prompt(message, "Must enter a number"));
    }
    return promptResult;
}

/**
 * Prompts the user to select a node from the graph.
 * @param {string} message The prompt message
 * @returns {string} The ID of the selected node
 * @throws {Error} If there are no valid nodes in the graph
 */
function promptNode(message) {
    let nodes = getNodes();
    if (nodes.length === 0) {
        throw new Error("Cannot prompt for a node when no valid nodes exist.");
    }
    return promptFrom(message, nodes, "Must enter a valid Node ID. The valid nodes are " + nodes);
}

/**
 * Prompts the user to select an edge from the graph.
 * @param {string} message The prompt message
 * @returns {string} The ID of the selected edge
 * @throws {Error} If there are no valid edges in the graph
 */
function promptEdge(message) {
    let edges = getEdges();
    if (edges.length === 0) {
        throw new Error("Cannot prompt for an edge when no valid edges exist.");
    }
    return promptFrom(message, edges, "Must enter a valid Edge ID. The valid edges are " + edges);
}

/**
 * Gets the ids of all nodes in an array
 * @returns Ids of all nodes
 */
function getNodes() {
    return graph.getNodeArray();
}

/**
 * Returns the number of nodes in the graph
 * @return the number of node in the graph
 */
function getNumberOfNodes() {
    return graph.getNodeArray().length;
}

/**
 * Gets the ids of all edges in an array
 * @returns Ids of all edges (Source,Target format)
 */
function getEdges() {
    return graph.getEdgeIds();
}

/**
 * Returns the number of edges in the graph
 * @return the number of edges in the graph
 */
function getNumberOfEdges() {
    return graph.getEdgeIds().length;
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
 * Gets the ids of all incident edges to the given node.
 * @param {String} nodeId Node id
 * @returns Array of incident edges
 */
function incident(nodeId) {
    return graph.getIncidentEdges(nodeId);
}

/**
 * Gets the ids of all incoming edges from source.
 * @param {String} nodeId Source node
 * @returns Array of incoming edges
 */
function incoming(nodeId) {
    return graph.getIncomingEdges(nodeId);
}

/**
 * Returns a list of all the outgoing edges of a specified node
 * @param {String} nodeId the id of the node to return the outgoing nodes of
 * @return {String[]} An array representing all the outgoing edges of the graph
 */
function outgoing(nodeId) {
    return graph.getOutgoingEdges(nodeId);
}

function adjacentNodes(nodeId) {
    return graph.getAdjacentNodes(nodeId);
}

function incomingNodes(nodeId) {
    return graph.getIncomingNodes(nodeId);
}

function outgoingNodes(nodeId) {
    return graph.getOutgoingNodes(nodeId);
}

function degree(nodeId) {
    return graph.getAdjacentEdges(nodeId).length;
}

function inDegree(nodeId) {
    return graph.getIncomingEdges(nodeId).length;
}

function outDegree(nodeId) {
    return graph.getOutgoingEdges(nodeId).length;
}

/**
 * Adds a node at the given x, y position.
 * @param {Integer} x the x position to add the new node at
 * @param {Integer} y the y position to add the new node at
 * @return {String} the ID of the new node
 */
function addNode(x, y) {
    if (!isInStep) { postMessage({ action: "step" }) }

    let id = graph.algorithmChangeManager.addNode(x, y);
    postMessage({ action: "addNode", x: x, y: y });
    waitIfNeeded();
    return id;
}

/**
 * Deletes the given nodes.
 * @param {String} nodeId Node to delete
 */
function deleteNode(nodeId) {
    if (!isInStep) { postMessage({ action: "step" }) }

    graph.algorithmChangeManager.deleteNode(nodeId);
    postMessage({ action: "deleteNode", nodeId: nodeId });
    waitIfNeeded();
}

function setPosition(nodeId, x, y) {
    if (!isInStep) { postMessage({ action: "step" }) }

    graph.algorithmChangeManager.setNodePosition(nodeId, x, y);
    postMessage({ action: "setNodePosition", nodeId: nodeId, x: x, y: y });
    waitIfNeeded();
}

/**
 * Deletes the given edge.
 * @param {String} edgeId Edge to delete (Source,Target format)
 */
function deleteEdge(edgeId) {
    if (!isInStep) { postMessage({ action: "step" }) }

    let split = edgeId.split(",");
    let source = split[0], target = split[1];
    graph.algorithmChangeManager.deleteEdge(source, target);
    postMessage({ action: "deleteEdge", source: source, target: target });
    waitIfNeeded();
}

/**
 * Sets a new attribute value for a given graph element.
 * @param {String} id Id of the graph element to modify
 * @param {String} name Name of the attribute
 * @param {Object} value Value of the attribute
 */
function setAttribute(id, name, value) {
    if (!isInStep) { postMessage({ action: "step" }) }

    if (id == null) {
        console.error("id is null! name: " + name + ", value: " + value);
    }
    if (id.includes(",")) {
        // Handle edge attribute
        let split = id.split(",");
        let source = split[0], target = split[1];
        graph.algorithmChangeManager.setEdgeAttribute(source, target, name, value);
        postMessage({ action: "setEdgeAttribute", source: source, target: target, name: name, value: value });
    
    } else {
        // Handle node attribute
        graph.algorithmChangeManager.setNodeAttribute(id, name, value);
        postMessage({ action: "setNodeAttribute", nodeId: id, name: name, value: value });
    }
    waitIfNeeded();
}

/**
 * Sets a new attribute for the given class of graph element.
 * @param {String} type Either nodes or edges
 * @param {String} name Attribute name
 * @param {Object} value Attribute value
 */
function setAttributeAll(type, name, value) {
    if (!isInStep) { postMessage({ action: "step" }) }

    if (type === "nodes") {
        graph.algorithmChangeManager.setNodeAttributeAll(name, value);
        postMessage({ action: "setNodeAttributeAll", name: name, value: value });

    } else {
        graph.algorithmChangeManager.setEdgeAttributeAll(name, value);
        postMessage({ action: "setEdgeAttributeAll", name: name, value: value });
    }
    waitIfNeeded();
}

/**
 * Gets the value of an attribute for a given graph element.
 * @param {String} id Id of the graph element
 * @param {String} name Name of the attribute
 */
function getAttribute(id, name) {
    if (id.includes(",")) {
        // Handle edge attribute
        let split = id.split(",");
        let source = split[0], target = split[1];
        return graph.getEdgeAttribute(source, target, name);

    } else {
        // Handle node attribute
        return graph.getNodeAttribute(id, name);
    }
}

function setEdgeWidth(id, width) {
    setAttribute(id, "edgeWidth", width);
}

function highlight(id) {
    setAttribute(id, "highlighted", true);
}

function highlighted(id) {
    return getAttribute(id, "highlighted");
}

function clearEdgeHighlights() {
    setAttributeAll("edges", "highlighted", false);
}

function clearNodeHighlights() {
    setAttributeAll("nodes", "highlighted", false);
}

function color(id, color) {
    setAttribute(id, "color", color);
}

function uncolor(id) {
    setAttribute(id, "color", undefined);
}

function getColor(id) {
    return getAttribute(id, "color");
}

function hasColor(id) {
    return getAttribute(id, "color") !== undefined;
}

function clearNodeColors() {
    setAttributeAll("node", "color", undefined);
}

function clearEdgeColors() {
    setAttributeAll("edges", "color", undefined);
}

function label(id, label) {
    setAttribute(id, "label", label);
}

function unlabel(id) {
    setAttribute(id, "label", "");
}

function getLabel(id) {
    return getAttribute(id, "label");
}

function hasLabel(id) {
    let label = getAttribute(id, "label");
    return label !== undefined && label !== "";
}

function clearNodeLabels() {
    setAttributeAll("nodes", "label", "");
}

function clearEdgeLabels() {
    setAttributeAll("edges", "label", "");
}

function mark(nodeId) {
    setAttribute(nodeId, "marked", true);
}

function unmark(nodeId) {
    setAttribute(nodeId, "marked", false);
}

function marked(nodeId) {
    return getAttribute(nodeId, "marked");
}

function clearNodeMarks() {
    setAttributeAll("nodes", "marked", false);
}

function setShape(id, shape) {
    setAttribute(id, "shape", shape);
}

function weight(id) {
    return getAttribute(id, "weight");
}

function setWeight(id, weight) {
    setAttribute(id, "weight", weight);
}

function clearNodeWeights() {
    setAttributeAll("node", "weight", 0);
}

function hasWeight(edge) {
    let arr = edge.split(",");
    return graph.getEdgeAttribute(arr[0], arr[1], "weight") === undefined;
}

function hideAllEdgeWeights() {
    // TODO
    // Is this necessary? Instead, could use clearNodeWeights
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

        // Make sure that the isInStep variable is initialized
        isInStep = false;

        // Wait for the user to resume the algorithm
        wait();

        // Evaluate the algorithm
        try {
            
            eval(message[2]); /* eslint-disable-line no-eval */
            // End recording of the last step
            console.log("Algorithm completed");
            postMessage({action: "complete"});

        } catch (error) {
            // if there's an error, send a message with the error
            postMessage({action: "error", content: error});
            throw error
        }
    }
}
