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
 * A counter to record how many steps deep we are. This is necessary to
 * allow for recursive steps.
 */
let stepDepth = 0;

/**
 * This thread's copy of the graph and its change manager.
 */
let graph;
let changeManager = new ChangeManager();

/**
 * This function uses Atomics to cause the algorithm to wait for user input before continuing
 */
function wait() {

    // Store a 0 in the sharedArray buffer
    Atomics.store(sharedArray, 0, 0);

    // Wait until the sharedArray buffer's first element is not 0.
    Atomics.wait(sharedArray, 0, 0);
}

/**
 * Waits, but only if the algorithm is not in a step and stepsToTake is
 * 0.
 */
function waitIfNeeded() {
    
    // Wait if we are not in a step
    if (stepDepth == 0) {
        wait();
    }
}

/**
 * Tells the thread to wait after running a step.
 */
function step(code=null) {

    // If there is no code in this step, an error must have happened
    if (code === null || code === undefined) {
        throw new Error("Invalid code in step. Code cannot be null or undefined.");
    }

    // Tell the ChangeManager to start recording our changes, but only
    // if we are not in debug mode
    if (flags[0] == 0) {
        
        // Are we the lowest level of step? If so, start and end the
        // recording. If not, we shouldn't start a recording, because
        // only the lowest level should be recording.
        let lowestLayer = stepDepth == 0;

        // Start recording, so that a single change record is made
        if (lowestLayer) {
            postMessage({action: "startRecording"});
        }

        // Increment the stepDepth counter so that we know when to end
        // our step
        stepDepth++;

        // Execute the code in this step
        code();
        
        // End the recording of the steps
        if (lowestLayer) {
            postMessage({action: "endRecording"});
        }

        // Decrement the stepDepth counter and wait if the
        // step is finished
        
        stepDepth--;
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
    if (stepDepth == 0) { postMessage({ action: "step" }) }

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
    if (stepDepth == 0) { postMessage({ action: "step" }) }

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

/*
 * USER INTERFACE AND GRAPH SETTINGS
 */
function display(message) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    postMessage({ action: "message", message: message });
    waitIfNeeded();
}

function print(message) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    postMessage({ action: "print", message: message });
}

function setDirected(isDirected) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    graph.isDirected = isDirected;
    postMessage({ action: "setDirected", isDirected: isDirected });
    waitIfNeeded();
}

/*
 * LIST GETTERS
 */

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

/*
 * SOURCE AND TARGET
 */

function source(edge) {
    return GraphInterface.getSource(graph, edge);
}

function target(edge) {
    return GraphInterface.getTarget(graph, edge);
}

function getEdgeBetween(source, target) {
    return GraphInterface.getEdgeIDBetween(graph, source, target);
}

function other(nodeId, edgeId) {
    return GraphInterface.getOppositeNode(graph, nodeId, edgeId);
}

/*
 * GRAPH EDITING
 */

function addNode(x, y) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    let newNode;
    [graph, changeManager, newNode] = GraphInterface.addNode(graph, changeManager, x, y);
    postMessage({ action: "addNode", x: x, y: y });
    waitIfNeeded();
    return newNode;
}

function setPosition(nodeId, x, y) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = GraphInterface.setNodePosition(graph, changeManager, nodeId, x, y);
    postMessage({ action: "setNodePosition", nodeId: nodeId, x: x, y: y });
    waitIfNeeded();
}

function addEdge(source, target) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, source, target);
    postMessage({ action: "addEdge", source: source, target: target });
    waitIfNeeded();
}

function incrementPosition(nodeId, x, y) {
    let currPos = GraphInterface.getNodePosition(graph, nodeId);
    currPos && setPosition(nodeId, currPos.x + x, currPos.y + y);
}

function deleteNode(nodeId) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = GraphInterface.deleteNode(graph, changeManager, nodeId);
    postMessage({ action: "deleteNode", nodeId: nodeId });
    waitIfNeeded();
}

function deleteEdge(edgeId) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    let split = edgeId.split(",");
    let source = split[0], target = split[1];
    [graph, changeManager] = GraphInterface.deleteEdge(graph, changeManager, source, target);
    postMessage({ action: "deleteEdge", source: source, target: target });
    waitIfNeeded();
}

/*
 * ADJACENCIES
 */

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

function visibleNeighbors(node) {
    return GraphInterface.getAdjacentNodes(graph, node).filter((node) => GraphInterface.getNodeAttribute(graph, node, "hidden") !== true);
}


/*
 * MARKS
 */

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

/*
 * HIGHLIGHTS
 */

function highlight(id) {
    setAttribute(id, "highlighted", true);
}

function unhighlight(id) {
    setAttribute(id, "highlighted", false);
}

function highlighted(id) {
    return getAttribute(id, "highlighted");
}

function clearNodeHighlights() {
    setAttributeAll("nodes", "highlighted", false);
}

function clearEdgeHighlights() {
    setAttributeAll("edges", "highlighted", false);
}

/*
 * COLORS
 */

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

/*
 * LABELS
 */

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

/*
 * WEIGHTS
 */

function setWeight(id, weight) {
    setAttribute(id, "weight", weight);
}

function clearWeight(id) {
    setAttribute(id, "weight", undefined);
}

function weight(id) {
    return getAttribute(id, "weight");
}

function hideWeight(id) {
    setAttribute(id, "weightHidden", true);
}

function showWeight(id) {
    setAttribute(id, "weightHidden", false);
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

/*
 * HIDE/SHOW NODE PROPERTIES
 */

function isHidden(id) {
    return getAttribute(id, "hidden") == true;
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

function hideAllNodeWeights() {
    setAttributeAll("nodes", "weightHidden", true);
}

function showNodeWeight(node) {
    setAttribute(node, "weightHidden", false);
}

function showAllNodeWeights() {
    setAttributeAll("nodes", "weightHidden", false);
}

function hideNodeLabel(node) {
    setAttribute(node, "labelHidden", true);
}

function hideAllNodeLabels() {
    setAttributeAll("nodes", "labelHidden", true);
}

function showNodeLabel(node) {
    setAttribute(node, "labelHidden", false);
}

function showAllNodeLabels() {
    setAttributeAll("nodes", "labelHidden", false);
}

/*
 * HIDE/SHOW EDGE PROPERTIES
 */

function hideEdge(edge) {
    setAttribute(edge, "hidden", true); 
}

function showEdge(edge) {
    setAttribute(edge, "hidden", false);
}

function hideEdgeWeight(edge) {
    setAttribute(edge, "weightHidden", true);
}

function hideAllEdgeWeights() {
    setAttributeAll("edges", "weightHidden", true);
}

function showEdgeWeight(edge) {
    setAttribute(edge, "weightHidden", false);
}

function showAllEdgeWeights() {
    setAttributeAll("edges", "weightHidden", false);
}

function hideEdgeLabel(edge) {
    setAttribute(edge, "labelHidden", true);
}

function hideAllEdgeLabels() {
    setAttributeAll("edges", "labelHidden", true);
}

function showEdgeLabel(edge) {
    setAttribute(edge, "labelHidden", false);
}

function showAllEdgeLabels() {
    setAttributeAll("edges", "labelHidden", false);
}


/*
 * NODE SHAPE
 */

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

/*
 * NODE NORDER WIDTH
 */

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

/*
 * NODE SHADING
 */

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

/*
 * NODE SIZE
 */

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

/*
 * EDGE WIDTH
 */

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

/*
 * PROMPT FUNCTION
 */

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

/*
 * LAYERED GRAPH ALGORITHMS
 */

/**
 * Layered graph functions 
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
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.setLayerProperty(graph, changeManager, layer, attribute, value);
    postMessage({ 
        action: "setLayerProperty",
        layer: layer,
        attribute: attribute,
        value: value,
    });
    waitIfNeeded();
} 

function setChannelProperty(channel, attribute, value) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.setChannelProperty(graph, changeManager, channel, attribute, value);
    postMessage({ 
        action: "setChannelProperty",
        channel: channel,
        attribute: attribute,
        value: value,
    });
    waitIfNeeded();
} 

function setWeightsUp(layer, type) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.setWeightsUp(graph, changeManager, layer, type);
    postMessage({ 
        action: "setWeightsUp",
        layer: layer,
        type: type,
    });
    waitIfNeeded();
} 

function setWeightsDown(layer, type) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.setWeightsDown(graph, changeManager, layer, type);
    postMessage({ 
        action: "setWeightsDown",
        layer: layer,
        type: type,
    });
    waitIfNeeded();
} 

function setWeightsBoth(layer, type) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.setWeightsBoth(graph, changeManager, layer, type);
    postMessage({ 
        action: "setWeightsBoth",
        layer: layer,
        type: type,
    });
    waitIfNeeded();
} 

function sortByWeight(layer) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.sortByWeight(graph, changeManager, layer);
    postMessage({ 
        action: "sortByWeight",
        layer: layer,
    });
    waitIfNeeded();
} 

function swap(x, y) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.swap(graph, changeManager, x, y);
    postMessage({ 
        action: "swap",
        x: x,
        y: y
    });
    waitIfNeeded();
} 

function nodesOnLayer(layer) {
    return LayeredGraphInterface.nodesOnLayer(graph, layer);
} 

function evenlySpacedLayout() {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.evenlySpacedLayout(graph, changeManager);
    postMessage({ action: "evenlySpacedLayout",  });
    waitIfNeeded();
}

function showPositions(layer) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.showPositions(graph, changeManager, layer);
    postMessage({ action: "showPositions",  layer: layer,});
    waitIfNeeded();
}

function showIndexes(layer) {
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.showIndexes(graph, changeManager, layer);
    postMessage({ action: "showIndexes",  layer: layer,});
    waitIfNeeded();
}

function numberOfLayers() {
    return LayeredGraphInterface.numberOfLayers(graph);
} 

function copyNodePositions() {
    return LayeredGraphInterface.copyNodePositions(graph);
}

function applyNodePositions(savedPositions){
    if (stepDepth == 0) { postMessage({ action: "step" }) }
    [graph, changeManager] = LayeredGraphInterface.applyNodePositions(graph, changeManager, savedPositions);
    postMessage({ action: "applyNodePositions",  savedPositions: savedPositions,});
    waitIfNeeded();
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

        // Make sure that the stepDepth variable is initialized
        stepDepth = 0;

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
