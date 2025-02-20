import { Graph } from "graph/Graph";

/**
 * Execution environment for algorithms. This file provides all necessary functions
 * and controls the flow of the algorithm to stop itself after each step.
 * 
 * @author Henry Morris
 * @author Krisjian Smith
 */

/**
 * Used to inform the thread when to run and storing prompt results to be accessed in
 * the thread.
 * If sharedArray[0] is 0, that means the Thread should wait. Once it is changed, the 
 * Thread wakes up from Atoimics.notify() from the Handler.
 */
let sharedArray;

/** 
 * Flag that is set to true when the algorithm is in a step. When
 * false, the algorithm should wait after every change to the graph. When
 * true, the algorithm should only wait when the step is finished.
 */
let isInStep;

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
/**************** Start of helper methods *********************/
/**************************************************************/

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

    // Post the message and wait for the thread to resume
    postMessage({action: "prompt", content: [message, error]});
    wait();

    // Get the result from the shared array
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
    if (list.length === 0) throw new Error("Cannot prompt when no valid options exist.");
    if (error === null) error = "Error: Must enter a value from " + list;

    let promptResult = prompt(message);
    while(!list.includes(promptResult)) {
        promptResult = prompt(message, error);
    }
    return promptResult;
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

/**************************************************************/
/****************** End of helper methods *********************/
/**************************************************************/



/**************************************************************/
/************* Start of algorithm methods *********************/
/**************************************************************/

function display(message) {
    if (!isInStep) { postMessage({ action: "step" }) }
    postMessage({ action: "message", message: message });
    waitIfNeeded();
}

function print(message) {
    if (!isInStep) { postMessage({ action: "step" }) }
    postMessage({ action: "print", message: message });
}

function promptBoolean(message) {
    return promptFrom(message, ["true", "false"], "Error: Must enter a boolean value (true/false)") === "true";
}

function promptInteger(message) {
    let promptResult = parseInt(prompt(message));
    while (isNaN(promptResult)) {
        promptResult = parseInt(prompt(message, "Error: Must enter an integer"));
    }
    return promptResult;
}

function promptNumber(message) {
    let promptResult = parseFloat(prompt(message));
    while (isNaN(promptResult)) {
        promptResult = parseFloat(prompt(message, "Error: Must enter a number"));
    }
    return promptResult;
}

function promptNode(message, error) {
    let nodes = getNodes();
    if (nodes.length === 0) {
        throw new Error("Cannot prompt for a node when no valid nodes exist.");
    }
    return promptFrom(message, nodes, error);
}

function promptEdge(message) {
    let edges = getEdges();
    if (edges.length === 0) {
        throw new Error("Cannot prompt for an edge when no valid edges exist.");
    }
    return promptFrom(message, edges, "Error: Must enter a valid Edge ID in source,target format. The valid edges are: " + edges.join(" "));
}

function addNode(x, y) {
    if (!isInStep) { postMessage({ action: "step" }) }
    let id = graph.algorithmChangeManager.addNode(x, y);
    postMessage({ action: "addNode", x: x, y: y });
    waitIfNeeded();
    return id;
}

function addEdge(source, target) {
    if (!isInStep) { postMessage({ action: "step" }) }
    graph.algorithmChangeManager.addEdge(source, target);
    postMessage({ action: "addEdge", source: source, target: target });
    waitIfNeeded();
}

function setPosition(nodeId, x, y) {
    if (!isInStep) { postMessage({ action: "step" }) }
    graph.algorithmChangeManager.setNodePosition(nodeId, x, y);
    postMessage({ action: "setNodePosition", nodeId: nodeId, x: x, y: y });
    waitIfNeeded();
}

function incrementPosition(nodeId, x, y) {
    let currPos = graph.getNodePosition(nodeId);
    currPos && setPosition(nodeId, currPos.x + x, currPos.y + y);
}

function deleteNode(nodeId) {
    if (!isInStep) { postMessage({ action: "step" }) }
    graph.algorithmChangeManager.deleteNode(nodeId);
    postMessage({ action: "deleteNode", nodeId: nodeId });
    waitIfNeeded();
}

function deleteEdge(edgeId) {
    if (!isInStep) { postMessage({ action: "step" }) }
    let split = edgeId.split(",");
    let source = split[0], target = split[1];
    graph.algorithmChangeManager.deleteEdge(source, target);
    postMessage({ action: "deleteEdge", source: source, target: target });
    waitIfNeeded();
}

function getNodes() {
    return graph.getNodeArray();
}

function getNumberOfNodes() {
    return graph.getNumberOfNodes();
}

function getEdges() {
    return graph.getEdgeIds();
}

function getNumberOfEdges() {
    return graph.getNumberOfEdges();
}

function source(edge) {
    return graph.getSource(edge);
}

function target(edge) {
    return graph.getTarget(edge);
}

function other(nodeId, edgeId) {
    return graph.getOppositeNode(nodeId, edgeId);
}

function incident(nodeId) {
    return graph.getIncidentEdges(nodeId);
}

function incoming(nodeId) {
    return graph.getIncomingEdges(nodeId);
}

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
    return graph.getIncidentEdges(nodeId).length;
}

function inDegree(nodeId) {
    return graph.getIncomingEdges(nodeId).length;
}

function outDegree(nodeId) {
    return graph.getOutgoingEdges(nodeId).length;
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

function highlight(id) {
    setAttribute(id, "highlighted", true);
}

function unhighlight(id) {
    setAttribute(id, "highlighted", false);
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
    setAttributeAll("nodes", "color", undefined);
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

function setWeight(id, weight) {
    setAttribute(id, "weight", weight);
}

function clearWeight(id) {
    setAttribute(id, "weight", undefined);
}

function weight(id) {
    return getAttribute(id, "weight");
}

function hasWeight(id) {
    let weight = getAttribute(id, "weight")
    return weight !== undefined;
}

function clearNodeWeights() {
    setAttributeAll("nodes", "weight", undefined);
}

function clearEdgeWeights() {
    setAttributeAll("edges", "weight", undefined);
}

function shape(id) {
    return getAttribute(id, "shape");
}

function setShape(id, shape) {
    setAttribute(id, "shape", shape);
}

function clearShape(id) {
    setAttribute(id, "shape", undefined);
}

function hasShape(id) {
    return getAttribute(id, "shape") !== undefined;
}

function clearNodeShapes() {
    setAttributeAll("nodes", "shape", undefined);
}

function borderWidth(id){
    return getAttribute(id, "borderWidth");
}

function setBorderWidth(id, borderWidth) {
    setAttribute(id, "borderWidth", borderWidth);
}

function clearBorderWidth(id) {
    setAttribute(id, "borderWidth", undefined);
}

function hasBorderWidth(id) {
    return getAttribute(id, "borderWidth") !== undefined;
}

function clearNodeBorderWidths() {
    setAttributeAll("nodes", "borderWidth", undefined);
}

function backgroundOpacity(id) {
    return getAttribute(id, "backgroundOpacity");
}

function setBackgroundOpacity(id, backgroundOpacity) {
    setAttribute(id, "backgroundOpacity", backgroundOpacity);
}

function clearBackgroundOpacity(id) {
    setAttribute(id, "backgroundOpacity", undefined);
}

function hasBackgroundOpacity(id) {
    return getAttribute(id, "backgroundOpacity") !== undefined;
}

function clearNodeBackgroundOpacities() {
    setAttributeAll("nodes", "backgroundOpacity", undefined);
}

function size(id) {
    return getAttribute(id, "size");
}

function setSize(id, size) {
    setAttribute(id, "size", size)
}

function clearSize(id) {
    setAttribute(id, "size", undefined)
}

function hasSize(id) {
    return getAttribute(id, "size") !== undefined;
}

function clearNodeSizes() {
    setAttributeAll("nodes", "size", undefined)
}

function edgeWidth(id) {
    return getAttribute(id, "width")
}

function setEdgeWidth(id, width) {
    setAttribute(id, "width", width)
}

function clearEdgeWidth(id) {
    setAttribute(id, "width", undefined)
}

function hasEdgeWidth(id) {
    return getAttribute(id, "width") !== undefined
}

function clearEdgeWidths() {
    setAttributeAll("edges", "width", undefined)
}

function hideAllEdgeWeights() {
    setAttributeAll("edges", "weightHidden", true);
}

function hideAllNodeWeights() {
    setAttributeAll("nodes", "weightHidden", true);
}

function showAllEdgeWeights() {
    setAttributeAll("edges", "weightHidden", false);
}

function showAllNodeWeights() {
    setAttributeAll("nodes", "weightHidden", false);
}

function hideAllEdgeLabels() {
    setAttributeAll("edges", "labelHidden", true);
}

function hideAllNodeLabels() {
    setAttributeAll("nodes", "labelHidden", true);
}

function showAllEdgeLabels() {
    setAttributeAll("edges", "labelHidden", false);
}

function showAllNodeLabels() {
    setAttributeAll("nodes", "labelHidden", false);
}

function hideNode(node) {
    setAttribute(node, "hidden", true); 
}

function showNode(node) {
    setAttribute(node, "hidden", false);
}

function hideNodeWeight(node) {
    setAttribute(node, "weightHidden", true);
}

function hideEdgeWeight(edge) {
    setAttribute(edge, "weightHidden", true);
}

function showNodeWeight(node) {
    setAttribute(node, "weightHidden", false);
}

function showEdgeWeight(edge) {
    setAttribute(edge, "weightHidden", false);
}

function hideNodeLabel(node) {
    setAttribute(node, "labelHidden", true);
}

function hideEdgeLabel(edge) {
    setAttribute(edge, "labelHidden", true);
}

function showNodeLabel(node) {
    setAttribute(node, "labelHidden", false);
}

function showEdgeLabel(edge) {
    setAttribute(edge, "labelHidden", false);
}

/**************************************************************/
/*************** End of algorithm methods *********************/
/**************************************************************/





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
        // Load the graph with isDirected flag
        graph.fileParser.loadGraph(message[1]);
        graph.isDirected = message[2];

        // Make sure that the isInStep variable is initialized
        isInStep = false;

        // Wait for the user to resume the algorithm
        wait();

        // Evaluate the algorithm
        try {
            // Start running the algorithm
            eval(message[3]); /* eslint-disable-line no-eval */
            // End recording of the last step
            console.log("Algorithm completed");
            postMessage({action: "complete"});

        } catch (error) {
            // if there's an error, send a message with the error
            postMessage({action: "error", error: error});
            throw error
        }
    }
}
