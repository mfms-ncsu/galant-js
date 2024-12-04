/* eslint-disable no-unused-vars */
/**
 * This module provides functionality for executing algorithms and interacting with the graph in a separate thread.
 * @author Christina Albores
 */
import Predicates from "utils/Predicates.js";
import Graph from "utils/Graph.js";
import ChangeObject from "pages/GraphView/utils/ChangeObject";

// The array has one purpose: telling the thread to run or wait with Atomics.wait().
// If sharedArray[0] is 0, that means the Thread should wait. Once it is changed, the Thread wakes up from Atoimics.notify() from the Handler.
let sharedArray;
//Instance of the graph that the thread will be working with
let predicates;
//Lets the user automatically stop algorithm execution when a change to the graph happens when enabled
//When set to false the user will have to manually stop the algorithm execution.
let autoStepEnabled = true;

const Algorithm = {};



Algorithm.configure = function(configObject) {
    postMessage({type: "config", config: configObject});
}

// Waiting, stepping and automatically stepping
/**
 * This function uses Atomics to cause the algorithm to wait for user input before continuing
 */
function wait() {
    Atomics.store(sharedArray, 0, 0);
    Atomics.wait(sharedArray, 0, 0);
}

/**
 * This function has the ability to take in a chunk of users code that has been
 * made into a funcyion. This will disable the autostep functionality so that the
 * code will run all the way through without waiting/stepping. Once done it will
 * generate a message with all the users steps and wait.
 * 
 * If no function is passed in then it posts a message of a step occuring and then waits.
 * 
 * @param {*} code optional parameter of a function from a users algorithm
 */
function step(code=null) {
    let prevAutoStep = autoStepEnabled;

    disableAutoStep();
    if (code != null) {
        code();
    }

    postMessage({type: "step"});
    wait();

    autoStepEnabled = prevAutoStep;
}

/**
 * This method is at the end of every api method that changes the graph
 * and if the user has not disabled autostep then it will automatically
 * step once the method is called.
 */
function autoStep() {
    if (autoStepEnabled) {
        step();
    }
}

/*******************************  *************************************************
 * API Methods for user to use *  * See programmer documentation for method usage *
 *******************************  *************************************************/


/**
 * Enables automatic stepping in the algorithm.
 */
function enableAutoStep() {
    autoStepEnabled = true;
}

/**
 * Disables automatic stepping in the algorithm.
 */
function disableAutoStep() {
    autoStepEnabled = false;
}

// Send messages to the console

/**
 * Prints a message to the console.
 * 
 * @param {string} message The message to print
 */
function print(message) {
    postMessage({type: "console", content: message});
}

/**
 * Throws an error message.
 * 
 * @param {string} message The error message
 */
function error(message) {
    throw new Error(message);
}

// Prompt the user for input

/**
 * Prompts the user for input.
 * 
 * @param {string} message The prompt message
 * @param {string} error The error message to display if input is invalid
 * @returns {string} The user input
 */
function prompt(message, error="") {
    if (message === null || message === "") {
        message = "Prompt";
    }
    postMessage({type: "prompt", content: [message, error]})
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
 * 
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
 * 
 * @param {string} message The prompt message
 * @returns {string} message of checking boolean value  
 */
function promptBoolean(message) {
    return promptFrom(message, ["true", "false"], "Must enter a boolean value (true/false)") === "true";
}

/**
 * Returns message for checking integer value
 * 
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
 * 
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
 * 
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
 * 
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
 * Hides the specified node in the graph.
 * 
 * @param {string} node The ID of the node to hide
 */
function hideNode(nodeId) {
    let graph = predicates.state;
    let incidentEdges = graph.incident(nodeId);
    let changeObjects = [];

    //First hide the node and create the change object for that
    let oldNodeState = structuredClone(graph.nodes.find(node => node.id === nodeId));
    graph.hideNode(nodeId)
    let newState = graph.nodes.find(node => node.id === nodeId);
    changeObjects.push(new ChangeObject(
        'update',
        'node',
        oldNodeState.id,
        oldNodeState,
        newState
    ));

    //Next iterate over each incident edge and hide it
    incidentEdges.forEach(edgeId => {
        let oldEdgeState = structuredClone(graph.getEdgeObject(edgeId));
        graph.hideEdge(edgeId);
        let newEdgeState = graph.getEdgeObject(edgeId)
        changeObjects.push(new ChangeObject(
            'update',
            'edge',
            oldEdgeState.id,
            oldEdgeState,
            newEdgeState
        ))
    });
    postMessage({type: "change", content: changeObjects});
    autoStep();
}

/**
 * Shows the specified node in the graph.
 * 
 * @param {string} node The ID of the node to show
 */
function showNode(node) {
    // hide the node (getting an updated copy of the graph), then wait for a resume command
    let rule = predicates.update((graph) => {
        graph.showNode(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Hides the specified edge in the graph.
 * 
 * @param {string} edge The ID of the edge to hide
 */
function hideEdge(edge) {
    // hide the node (getting an updated copy of the graph), then wait for a resume command
    let rule = predicates.update((graph) => {
        graph.hideEdge(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Shows the specified edge in the graph.
 * 
 * @param {string} edge The ID of the edge to show
 */
function showEdge(edge) {
    // hide the node (getting an updated copy of the graph), then wait for a resume command
    let rule = predicates.update((graph) => {
        graph.showEdge(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Hides the weight of the specified node in the graph.
 * 
 * @param {string} node The ID of the node whose weight to hide
 */
function hideNodeWeight(node) {
    let rule = predicates.update((graph) => {
        graph.hideNodeWeight(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Shows the weight of the specified node in the graph.
 * 
 * @param {string} node The ID of the node whose weight to show
 */
function showNodeWeight(node) {
    let rule = predicates.update((graph) => {
        graph.showNodeWeight(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Hides the label of the specified node in the graph.
 * 
 * @param {string} node The ID of the node whose label to hide
 */
function hideNodeLabel(node) {
    let rule = predicates.update((graph) => {
        graph.hideNodeLabel(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Shows the label of the specified node in the graph.
 * 
 * @param {string} node The ID of the node whose label to show
 */
function showNodeLabel(node) {
    let rule = predicates.update((graph) => {
        graph.showNodeLabel(node);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Hides the label of the specified edge in the graph.
 * 
 * @param {string} edge The ID of the edge whose label to hide
 */
function hideEdgeLabel(edge) {
    let rule = predicates.update((graph) => {
        graph.hideEdgeLabel(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}


/**
 * Shows the label of the specified edge in the graph.
 * 
 * @param {string} edge The ID of the edge whose label to show
 */
function showEdgeLabel(edge) {
    let rule = predicates.update((graph) => {
        graph.showEdgeLabel(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Hides the weight of the specified edge in the graph.
 * 
 * @param {string} edge The ID of the edge whose weight to hide
 */
function hideEdgeWeight(edge) {
    let rule = predicates.update((graph) => {
        graph.hideEdgeWeight(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Shows the weight of the specified edge in the graph.
 * 
 * @param {string} edge The ID of the edge whose weight to show
 */
function showEdgeWeight(edge) {
    let rule = predicates.update((graph) => {
        graph.showEdgeWeight(edge);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Hides the weight of all nodes in the graph.
 */
function hideAllNodeWeights() {
    let rule = predicates.update((graph) => {
        graph.hideAllNodeWeights();
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Shows the weight of all nodes in the graph.
 */
function showAllNodeWeights() {
    let rule = predicates.update((graph) => {
        graph.showAllNodeWeights();
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Hides the weight of all edges in the graph.
 */
function hideAllEdgeWeights() {
    let rule = predicates.update((graph) => {
        graph.hideAllEdgeWeights();
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

/**
 * Shows the weight of all edges in the graph.
 */
function showAllEdgeWeights() {
    let rule = predicates.update((graph) => {
        graph.showAllEdgeWeights();
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}


/**
 * Shows the weight of all edges in the graph.
 */
function incrementPosition(nodeId, increment) {
    let rule = predicates.update((graph) => {
        graph.incrementPosition(nodeId, increment);
    });
    postMessage({type: "rule", content: rule});
    autoStep();
}

// Automatic getter/setter generation functions

/**
 * Generates a getter function for the specified method of the graph.
 * 
 * @param {string} fnName The name of the method to generate a getter for
 * @returns {Function} The generated getter function
 */
function generateGetter(fnName) {
    return (...args) => {
        let graph = predicates.get();
        
        return graph[fnName].apply(graph, args);
    }
}

const functionMetadata = {
    setNodeColor: { type: 'node', args: 1 },
    setEdgeWidth: { type: 'edge', args: 1 },
    setSize: { type: 'node', args: 1 },
    setWeight: { type: 'both', args: 1 },
    setShape: { type: 'node', args: 1 },
    setBackgroundOpacity: { type: 'node', args: 1 },
    setBorderWidth: { type: 'node', args: 1 },
    label: { type: 'both', args: 2 }, // Accepts node or edge ID and a label
    unlabel: { type: 'both', args: 1 }, // Accepts node or edge ID
    color: { type: 'both', args: 2 }, // Accepts node or edge ID and a color
    uncolor: { type: 'both', args: 1 }, // Accepts node or edge ID
    clearNodeWeights: { type: 'node', args: 0, appliesToAll: true },
    clearEdgeWidth: { type: 'edge', args: 0 },
    clearSize: { type: 'node', args: 1 },
    clearShape: { type: 'node', args: 1 },
    clearBackgroundOpacity: { type: 'node', args: 1 },
    clearBorderWidth: { type: 'node', args: 1 },
    mark: { type: 'both', args: 1 },
    unmark: { type: 'both', args: 1 },
    highlight: { type: 'both', args: 1 },
    unhighlight: { type: 'both', args: 1 },
    clearNodeMarks: { type: 'node', args: 0, appliesToAll: true },
    clearNodeHighlights: { type: 'node', args: 0, appliesToAll: true },
    clearNodeColors: { type: 'node', args: 0, appliesToAll: true },
    clearNodeShapes: { type: 'node', args: 0, appliesToAll: true},
    clearNodeBorderWidth: { type: 'node', args: 0, appliesToAll: true},
    clearNodeBackgroundOpacity: { type: 'node', args: 0, appliesToAll: true },
    setPosition: {type: 'node', args: 2},
    incrementPosition: {type: 'node', args: 2},
    hideNode: {type: 'node', args: 1},
    hideNodeWeight: {type: 'node', args: 1},
    clearNodeLabels: {type: 'node', args: 0, appliesToAll: true},
    clearEdgeColors: {type: 'edge', args: 0, appliesToAll: true}
    // Add more functions as needed
};

/**
 * Generates a setter function for the specified method of the graph.
 * 
 * @param {string} fnName The name of the method to generate a setter for
 * @returns {Function} The generated setter function
 */

function generateSetter(fnName) {
    return (...args) => {
        let graph = predicates.state;
        let method = graph[fnName]
        if (typeof method !== "function") {
            console.error(`setter fnName: ${fnName} is not a valid function`);
            return; // Exit if method is not valid
        }
        const meta = functionMetadata[fnName];
        let changeObjects = []
        let targetType;
        let targetId;
        let oldState;
        let newState;
        if(meta) {
            if(meta.appliesToAll) {
                if(meta.type === "node") {
                    targetType = 'node';
                    oldState = {nodes: graph.nodes.map(node => structuredClone(node))};
                    method.apply(graph, args);
                    graph.nodes.forEach(graphNode => {
                        const oldNodeState = oldState.nodes.find(oldStateNode => oldStateNode.id === graphNode.id);
                        changeObjects.push(new ChangeObject(
                            'update',
                            'node',
                            graphNode.id,
                            oldNodeState,
                            graphNode
                        ));
                    })
                } else {
                    targetType = 'edge';
                    oldState = {edges: graph.edges.map(edge => structuredClone(edge))};
                    method.apply(graph, args);
                    graph.edges.forEach(edge => {
                        const oldEdgeState = oldState.edges.find(oldStateEdge => oldStateEdge.id === edge.id);
                        changeObjects.push(new ChangeObject(
                            'update',
                            'edge',
                            edge.id,
                            oldEdgeState,
                            edge
                        ));
                    })
                }
                postMessage({type: "change", content: changeObjects});
            } else {
                if(meta.type === "node") {
                    targetType = 'node';
                    targetId = args[0];
                    oldState = structuredClone(graph.nodes.find(node => node.id === targetId));
                    method.apply(graph, args);
                    newState = graph.nodes.find(node => node.id === targetId);
                } else if(meta.type === 'edge') {
                    targetType = 'edge';
                    targetId = args[0];
                    oldState = structuredClone(graph.edges.find(edge => edge.id === targetId));
                    method.apply(graph, args);
                    newState = graph.edges.find(edge => edge.id === targetId);
                } else if(meta.type === 'both') {
                    // Sometimes a node or edge object is passed here, need to check and set id accordingly
                    targetId = args[0].id === undefined ? args[0] : args[0].id;
                    if(targetId.includes(" ")) {
                        targetType = 'edge';
                        oldState = structuredClone(graph.edges.find(edge => edge.id === targetId));
                        method.apply(graph, args);
                        newState = graph.edges.find(edge => edge.id === targetId);    
                    } else { 
                        targetType = 'node';
                        oldState = structuredClone(graph.nodes.find(node => node.id === targetId));
                        method.apply(graph, args);
                        newState = graph.nodes.find(node => node.id === targetId);  
                    }  
                } else {
                    console.error('Invalid target type for mark function');
                    return;
                }
                changeObjects.push(new ChangeObject(
                    "update", 
                    targetType, 
                    targetId, 
                    oldState, 
                    newState
                ));
                postMessage({type: "change", content: changeObjects});
            }              
        }
        autoStep();
    }
}

// List getters
const getNodes = generateGetter("getNodes");
const getEdges = generateGetter("getEdges");
const getNumberOfNodes = generateGetter("getNumberOfNodes");
const getNumberOfEdges = generateGetter("getNumberOfEdges");

// Source/target
const source = generateGetter("source");
const target = generateGetter("target");
const getEdgesBetween = generateGetter("getEdgesBetween");
const getEdgeBetween = generateGetter("getEdgeBetween");
const other = generateGetter("other");

// Adjacencies
const incident = generateGetter("incident");
const incoming = generateGetter("incoming");
const outgoing = generateGetter("outgoing");
const adjacentNodes = generateGetter("adjacentNodes");
const incomingNodes = generateGetter("incomingNodes");
const outgoingNodes = generateGetter("outgoingNodes");

// Marks
const mark = generateSetter("mark");
const unmark = generateSetter("unmark");
const marked = generateGetter("marked");
const clearNodeMarks = generateSetter("clearNodeMarks");

// Highlights
const highlight = generateSetter("highlight");
const unhighlight = generateSetter("unhighlight");
const highlighted = generateGetter("highlighted");
const clearNodeHighlights = generateSetter("clearNodeHighlights");
const clearEdgeHighlights = generateSetter("clearEdgeHighlights");

// Colors
const color = generateSetter("color");
const uncolor = generateSetter("uncolor");
const getColor = generateGetter("getColor");
const hasColor = generateGetter("hasColor");
const clearNodeColors = generateSetter("clearNodeColors");
const clearEdgeColors = generateSetter("clearEdgeColors");

// Labels
const label = generateSetter("label");
const unlabel = generateSetter("unlabel");
const getLabel = generateGetter("getLabel");
const hasLabel = generateGetter("hasLabel");
const clearNodeLabels = generateSetter("clearNodeLabels");
const clearEdgeLabels = generateSetter("clearEdgeLabels");

// Weights
const setWeight = generateSetter("setWeight");
const clearWeight = generateSetter("clearWeight");
const weight = generateGetter("weight");
const hasWeight = generateGetter("hasWeight");
const clearNodeWeights = generateSetter("clearNodeWeights");
const clearEdgeWeights = generateSetter("clearEdgeWeights");

// Shapes
const shape = generateGetter("shape");
const setShape = generateSetter("setShape");
const clearShape = generateSetter("clearShape");
const hasShape = generateGetter("hasShape");
const clearNodeShapes = generateSetter("clearNodeShapes");

// Size
const size = generateGetter("size");
const setSize = generateSetter("setSize");
const clearSize = generateSetter("clearSize");
const hasSize = generateGetter("hasSize");
const clearNodeSizes = generateSetter("clearNodeSizes");

// Border Width
const borderWidth = generateGetter("borderWidth");
const setBorderWidth = generateSetter("setBorderWidth");
const clearBorderWidth = generateSetter("clearBorderWidth");
const hasBorderWidth = generateGetter("hasBorderWidth");
const clearNodeBorderWidth = generateSetter("clearNodeBorderWidth");

// Border Opacity
const backgroundOpacity = generateGetter("backgroundOpacity");
const setBackgroundOpacity = generateSetter("setBackgroundOpacity");
const clearBackgroundOpacity = generateSetter("clearBackgroundOpacity");
const hasBackgroundOpacity = generateGetter("hasBackgroundOpacity");
const clearNodeBackgroundOpacity = generateSetter("clearNodeBackgroundOpacity");

// Edge Width
const edgeWidth = generateGetter("edgeWidth");
const setEdgeWidth = generateSetter("setEdgeWidth");
const clearEdgeWidth = generateSetter("clearEdgeWidth");
const hasEdgeWidth = generateGetter("hasEdgeWidth");
const clearNodeEdgeWidth = generateSetter("clearNodeEdgeWidth");

// Position
const setPosition = generateSetter("setPosition")

// Display
const display = generateSetter("display");

/** Just a little easter egg :) */
function fireworks() {
    postMessage({type: "fireworks", content: "boom. explosion sound effects."})
}


function onMessage(message) {/* eslint-disable-line no-restricted-globals */
    message = message.data
    if (message[0] === 'shared') {
        sharedArray = message[1];
    }
    else if (message[0] === 'graph/algorithm') {
        let jsonGraph = message[1];
        let graph = new Graph(jsonGraph.nodes, jsonGraph.edges, jsonGraph.directed, jsonGraph.message, jsonGraph.name, jsonGraph.scalar);
        Object.setPrototypeOf(graph, Graph.prototype);
        predicates = new Predicates(graph);
        print("Algorithm initialized");
        wait();

        try {
            eval(message[2]); /* eslint-disable-line no-eval */
            print("Algorithm completed");
            postMessage({type: "complete"});
        } catch (error) {
            let matches = error.stack.match(/eval:([0-9]+):[0-9]+\n/);
            if (matches != null) {
                // error.lineNumber = parseInt(matches[1]);
            }
            // if there's an error, send a message with the error
            postMessage({type: "error", content: error});
            throw error
        }
    }
};

/**
 * This is the listener for the Thread. It should recieve a SharedArray first, then an algorithm to run. 
 * 
 * @param {array} message - Has two main parts: subject and body. The first index is a string with the 
 *                          subject of the message. That is, what should be expected in the body. It can be:
 *                              - "shared": message[1] is the shared array that the Thread will `wait` on later.
 *                              - "algorithm/graph": message[1] is the graph object, message[2] is the algorithm
 * 
 * @author Noah
 * @author Andrew
 */
self.onmessage = message => { /* eslint-disable-line no-restricted-globals */
    message = message.data
    if (message[0] === 'shared') {
        sharedArray = message[1];
    }
    else if (message[0] === 'graph/algorithm') {
        let jsonGraph = message[1];
        console.log(jsonGraph.nodes);
        console.log(jsonGraph.edges);
        let graph = new Graph(jsonGraph.nodes, jsonGraph.edges, jsonGraph.directed, jsonGraph.message, jsonGraph.name, jsonGraph.scalar);
        predicates = new Predicates(graph);
        print("Algorithm initialized");
        wait();

        try {
            eval(message[2]); /* eslint-disable-line no-eval */
            print("Algorithm completed");
            postMessage({type: "complete"});
        } catch (error) {
            let matches = error.stack.match(/eval:([0-9]+):[0-9]+\n/);
            if (matches != null) {
                // error.lineNumber = parseInt(matches[1]);
            }
            // if there's an error, send a message with the error
            postMessage({type: "error", content: error});
            throw error
        }
    }
}


export default onMessage;