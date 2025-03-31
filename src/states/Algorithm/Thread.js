import GraphInterface from 'interfaces/GraphInterface/GraphInterface';
import FileParser from 'interfaces/FileParser/FileParser';
import ChangeManager from 'states/ChangeManager/ChangeManager';
import LayeredGraphInterface from 'interfaces/GraphInterface/LayeredGraphInterface';
import { RampRightOutlined } from '@mui/icons-material';

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
 * An integer array that holds status flags for the thread. If flags[0]
 * is 1, then debug mode is active, and step() functions should be
 * ignored.
 */
let flags;

/** 
 * Flag that is set to true when the algorithm is in a step. When
 * false, the algorithm should wait after every change to the graph. When
 * true, the algorithm should only wait when the step is finished.
 */
let isInStep;

/**
 * The number of steps to take before waiting again.
 */
let stepsToTake;

/**
 * This thread's copy of the graph and its change manager.
 */
let graph;
let changeManager = new ChangeManager();

/**
 * This function uses Atomics to cause the algorithm to wait for user input before continuing
 */
function wait() {
    // If we are waiting, then the algorithm step is complete. It is
    // safe for the main thread to redraw the window
    postMessage({action: "redraw"});

    // Store a 0 in the sharedArray buffer
    Atomics.store(sharedArray, 0, 0);

    // Wait until the sharedArray buffer's first element is not 0.
    Atomics.wait(sharedArray, 0, 0);

    // Set stepsToTake to 1 (default behavior)
    stepsToTake = 1;
}

/**
 * Waits, but only if the algorithm is not in a step and stepsToTake is
 * 0.
 */
function waitIfNeeded() {
    // If we are not in a step (implying we just finished a step),
    // then decrement the stepsToTake counter
    if (!isInStep) {
        stepsToTake--;
    }
    
    // Wait if we are finished taking all our steps
    if (stepsToTake == 0) {
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

    // Tell the ChangeManager to start recording our changes, but only
    // if we are not in debug mode
    if (flags[0] == 0) {
        postMessage({action: "startRecording"});
        isInStep = true;

        // Execute the code in this step
        code();
        
        // End the recording of the steps
        postMessage({action: "endRecording"});
        isInStep = false;

        // Wait until we should start the next step
        waitIfNeeded();
    }
    else {
        
        // If we are in debug mode, then just execute the code as if
        // there is no step
        code();
    }
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
        [graph, changeManager] = GraphInterface.setEdgeAttribute(graph, changeManager, source, target, name, value);
        postMessage({ action: "setEdgeAttribute", source: source, target: target, name: name, value: value });
    
    } else {
        // Handle node attribute
        [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, id, name, value);
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
        [graph, changeManager] = GraphInterface.setNodeAttributeAll(graph, changeManager, name, value);
        postMessage({ action: "setNodeAttributeAll", name: name, value: value });

    } else {
        [graph, changeManager] = GraphInterface.setEdgeAttributeAll(graph, changeManager, name, value);
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
        return GraphInterface.getEdgeAttribute(graph, source, target, name);

    } else {
        // Handle node attribute
        return GraphInterface.getNodeAttribute(graph, id, name);
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
    let promptResult = prompt(message);
    while (isNaN(parseInt(promptResult)) || !/^-?[0-9]+$/.test(promptResult)) {
        promptResult = prompt(message, "Error: Must enter an integer");
    }
    return parseInt(promptResult);
}

function promptNumber(message) {
    let promptResult = prompt(message);
    while (isNaN(parseFloat(promptResult)) || !/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(promptResult)) {
        promptResult = prompt(message, "Error: Must enter a number");
    }
    return parseFloat(promptResult);
}

function promptNode(message, error) {
    let nodes = getNodes();

    if (nodes.length === 0) {
        throw new Error("Cannot prompt for a node when no valid nodes exist.");
    }
    return promptFrom(message, nodes, error);
}

function promptNodeFrom(message, nodes) {
    // If this is a set, make it an array
    if (nodes instanceof Set) {
        nodes = [...nodes.values()];
    }

    if (nodes.length === 0) {
        throw new Error("Cannot prompt for a node when no valid nodes exist.");
    }
    return promptFrom(message, nodes, "Must add node from: " + nodes.join(" "));
}

function promptEdgeFrom(message, edges) {
    // If this is a set, make it an array
    if (edges instanceof Set) {
        edges = [...edges.values()];
    }

    if (edges.length === 0) {
        throw new Error("Cannot prompt for a edge when no valid edges exist.");
    }
    return promptFrom(message, edges, "Must add edge from: " + edges.join(" "));
}

function promptEdge(message) {
    let edges = getEdges();
    if (edges.length === 0) {
        throw new Error("Cannot prompt for an edge when no valid edges exist.");
    }

    // If the graph is directed, put the reversed edges into edges
    let reversedEdges = new Map();
    if (!graph.isDirected) {
        edges.forEach(edge => {
            // Split the edge into source and target
            let split = edge.split(",");

            // If the reversed edge isn't edges, add it to reversedEdges as the key to the original edge value
            if (!edges.includes(`${split[1]},${split[0]}`)) reversedEdges.set(`${split[1]},${split[0]}`, edge);
        });

        // Add the reversed edges
        edges = edges.concat([...reversedEdges.keys()]);
    }
    
    let promptResult = promptFrom(message, edges, "Error: Must enter a valid Edge ID in source,target format. The valid edges are: " + edges.join(" "));
    return reversedEdges.get(promptResult) || promptResult; // Check if the edge is reversed or not
}

function setDirected(isDirected) {
    if (!isInStep) { postMessage({ action: "step" }) }
    graph.isDirected = isDirected;
    postMessage({ action: "setDirected", isDirected: isDirected });
    waitIfNeeded();
}

function addNode(x, y) {
    if (!isInStep) { postMessage({ action: "step" }) }
    let newNode;
    [graph, changeManager, newNode] = GraphInterface.addNode(graph, changeManager, x, y);
    postMessage({ action: "addNode", x: x, y: y });
    waitIfNeeded();
    return newNode;
}

function addEdge(source, target) {
    if (!isInStep) { postMessage({ action: "step" }) }
    [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, source, target);
    postMessage({ action: "addEdge", source: source, target: target });
    waitIfNeeded();
}

function setPosition(nodeId, x, y) {
    if (!isInStep) { postMessage({ action: "step" }) }
    [graph, changeManager] = GraphInterface.setNodePosition(graph, changeManager, nodeId, x, y);
    postMessage({ action: "setNodePosition", nodeId: nodeId, x: x, y: y });
    waitIfNeeded();
}

function incrementPosition(nodeId, x, y) {
    let currPos = GraphInterface.getNodePosition(graph, nodeId);
    currPos && setPosition(nodeId, currPos.x + x, currPos.y + y);
}

function deleteNode(nodeId) {
    if (!isInStep) { postMessage({ action: "step" }) }
    [graph, changeManager] = GraphInterface.deleteNode(graph, changeManager, nodeId);
    postMessage({ action: "deleteNode", nodeId: nodeId });
    waitIfNeeded();
}

function deleteEdge(edgeId) {
    if (!isInStep) { postMessage({ action: "step" }) }
    let split = edgeId.split(",");
    let source = split[0], target = split[1];
    [graph, changeManager] = GraphInterface.deleteEdge(graph, changeManager, source, target);
    postMessage({ action: "deleteEdge", source: source, target: target });
    waitIfNeeded();
}

function getNodes() {
    return GraphInterface.getNodeIds(graph);
}

function getNumberOfNodes() {
    return GraphInterface.getNumberOfNodes(graph);
}

function getEdges() {
    return GraphInterface.getEdgeIds(graph);
}

function getNumberOfEdges() {
    return GraphInterface.getNumberOfEdges(graph);
}

function source(edge) {
    return GraphInterface.getSource(graph, edge);
}

function target(edge) {
    return GraphInterface.getTarget(graph, edge);
}

function other(nodeId, edgeId) {
    return GraphInterface.getOppositeNode(graph, nodeId, edgeId);
}

function incident(nodeId) {
    return GraphInterface.getIncidentEdges(graph, nodeId);
}

function incoming(nodeId) {
    return GraphInterface.getIncomingEdges(graph, nodeId);
}

function outgoing(nodeId) {
    return GraphInterface.getOutgoingEdges(graph, nodeId);
}

function adjacentNodes(nodeId) {
    return GraphInterface.getAdjacentNodes(graph, nodeId);
}

function incomingNodes(nodeId) {
    return GraphInterface.getIncomingNodes(graph, nodeId);
}

function outgoingNodes(nodeId) {
    return GraphInterface.getOutgoingNodes(graph, nodeId);
}

function degree(nodeId) {
    return GraphInterface.getIncidentEdges(graph, nodeId).length;
}

function inDegree(nodeId) {
    return GraphInterface.getIncomingEdges(graph, nodeId).length;
}

function outDegree(nodeId) {
    return GraphInterface.getOutgoingEdges(graph, nodeId).length;
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

/** Layered graph functions 
 * @author Heath Dyer
*/

function isCrossed(e, f) {
    return LayeredGraphInterface.isCrossed(graph, e, f);
}

function crossings(e) {
    return LayeredGraphInterface.crossings(graph, e);
} 

function totalCrossings() {
    return LayeredGraphInterface.totalCrossings(graph);
} 

function bottleneckCrossings() {
    return LayeredGraphInterface.bottleneckCrossings(graph);
} 

function nonVerticality(e) {
    return LayeredGraphInterface.nonVerticality(graph, e);
} 

function totalNonVerticality() {
    return LayeredGraphInterface.totalNonVerticality(graph);
} 

function bottleneckVerticality() {
    return LayeredGraphInterface.bottleneckVerticality(graph);
} 

function setLayerProperty(layer, attribute, value) {
    return LayeredGraphInterface.setLayerProperty(graph, layer, attribute, value);
} 

function setChannelProperty(layer, attribute, value) {
    return LayeredGraphInterface.setChannelProperty(graph, layer, attribute, value);
} 

function setWeightsUp(layer, type) {
    return LayeredGraphInterface.setWeightsUp(graph, layer, type);
} 

function setWeightsDown(layer, type) {
    return LayeredGraphInterface.setWeightsDown(graph, layer, type);
} 

function setWeightsBoth(layer, type) {
    return LayeredGraphInterface.setWeightsBoth(graph, layer, type);
} 

function sortByWeight(layer) {
    return LayeredGraphInterface.sortByWeight(graph, layer);
} 

function swap(x, y) {
    return LayeredGraphInterface.swap(graph, x, y);
} 

function nodesOnLayer(layer) {
    return LayeredGraphInterface.nodesOnLayer(graph, layer);
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
        flags = message[2];

    } else if (message[0] === "graph/algorithm") {
        // Load the graph with isDirected flag
        graph = FileParser.loadGraph("", message[1]);
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
