import Edge from "../../states/Graph/GraphElement/Edge";
import GraphInterface from "../GraphInterface/GraphInterface"
import LayeredGraph from "../../states/Graph/LayeredGraph";
import Node from "../../states/Graph/GraphElement/Node";
import StandardGraph from "../../states/Graph/StandardGraph";
import Tree from "../../states/Graph/Tree";

/**
 * The comments below suggest a refactoring of the code to make it significantly easier to follow
 * Parts of the code that are fine as is are kept.
 */

/**
 ***********
 * HELPERS *
 ***********
 */

/**
 * Helper method for determining whether a file is a tree or not.
 * A file is a tree if it ends in the .tree extension
 * @param {String} name The name of the graph file
 * @returns True if the file is in the Tree format, false if not.
 */
function isTree(name, file) {
    let isTree = false;
    const lines = file.split("\n");

    // Checks for a .tree extension
    const values = name.split(".");
    const extension = values[values.length - 1];
    if( extension.includes("tree") ) {
        isTree = true;
    }

    // Check for a header or tag line beginning with 'r' or 'b'
    lines.forEach((line) => {
        line = line.trim();
        const tokens = line.split(" ");
        if (tokens[0] === 'r' || tokens[0] === 'b') {
            isTree = true;
        };
    });

    return isTree;
}

 /**
 * Helper method for determing the graph file format.
 * A graph is a layered graph if the extension is .sgf,
 *  or there is a header line starting with a 't'
 * Otherwise it is either a standard graph or a tree
 * @param {String} name Name of the graph file
 * @param {String} file The text of the graph file
 * @returns True if the graph is in SGF format.
 */
function isLayeredGraph(name, file) {
    let isLayeredGraph = false;
    const lines = file.split("\n");
    
    // Check for the .sgf extension
    if ( name.endsWith('.sgf') ) {
        isLayeredGraph = true;
    }

    // Check for a header or tag line beginning with 't'
    lines.forEach((line) => {
        line = line.trim();
        const tokens = line.split(" ");

        if (tokens[0] === 't') {
            isLayeredGraph = true;
        };
    });

    return isLayeredGraph;
}

/**
 * Checks if a string can be parsed into a number.
 * @author see: https:// stackoverflow.com/a/175787
 * @param {String} str String to check
 * @returns True if the string is numeric, false otherwise
 * @todo Allow for Infinity, NaN, and other special numeric values
 */
function isNumeric(str) {
    if ( typeof str !== "string" ) return false;
    return ! Number.isNaN(Number(str)) && ! Number.isNaN(parseFloat(str));
}

/**
 *************
 * MAIN FLOW *
 *************
 */

/**
 * Loads the given file text into the graph.
 * @param {String} file File text
 */
function loadGraph(name, file) {
    console.log("-> loadGraph:", name, file);
    lineNumber = 0

    // Split the file on the new line character and parse each line
    const lines = file.split("\n");

    // Initialize the proper graph type
    GraphInterface.resetSequenceNumbers()
    let graph = null;
    if ( isLayeredGraph(name, file) ) {
        graph = new LayeredGraph(name) }
    else if ( isTree(name, file) ) {
        graph = new Tree(name);
    } else {
        graph = new StandardGraph(name);
    }
    graph.nodes = new Map();
    graph.weightsInside = false
    // Parse each line, ignoring comments and blank lines
    // This part is the same for all graph types
    lines.forEach(line => { 
        lineNumber++
        parseLine(graph, line)
    });

    if ( graph.type === "layered" ) {
        createLayers(graph);
    }

    if ( graph.type !== "tree") {
        // Generate a scale for the graph based on the node positions
        graph.scalar = GraphInterface.getScalar(graph);
    }
    
    return graph;
}

/**
 * Creates the layers for a layered graph
 * @param {Graph} graph The layered graph to make layers for
 */
function createLayers(graph) {
    // Build a map of layers (layer (int) -> list of nodes)
    const layers = new Map();
    graph.nodes.forEach((node) => {
        if ( ! layers.has(node.layer) ) {
            layers.set(node.layer, []);
        }
        layers.get(node.layer).push(node);
    });

    // Calculate the smallest layer value to use as our offset (this will be layer 0)
    const minLayer = Math.min(...Array.from(layers.keys()));

    // Iterate through each layer, sort its nodes by x position and update the node's index property accordingly
    for (const [layer, nodes] of layers) {
        const sortedNodes = nodes.sort((a, b) => a.position.x - b.position.x);
        for ( const [idx, node] of sortedNodes.entries() ) {
            node.layer = layer - minLayer;
            node.index = idx;
        }
    }
}

let lineNumber = 0

/**
 * @return a list of attribute based on the line string and starting index
 * Each atribute is a key:value pair separated by a colon
 * @param {Array} tokens A list of tokens from the line 
 * @param {Number} startingIndex Index at which to start parsing attributes
 */
function parseAttributes(tokens, startingIndex) {
    // Initializes the attribute map
    const attributes = {};

    // Assigns a weight to the node or edge if the first token is a number
    if ( isNumeric( tokens[startingIndex] ) ) {
        attributes["weight"] = parseFloat(tokens[startingIndex]);
        startingIndex += 1;
    }

    // @todo Check each attribute value to see if it's a boolean or a number
    //       and act accordingly
    //       Otherwise all attributes after the weight are treated as strings!
    
    // Adds each remaining attribute to the attribute map
    for ( let tokenIndex = startingIndex; tokenIndex < tokens.length; tokenIndex++ ) {
        // Find and set the attribute
        let pair = tokens[tokenIndex].trim().split(":");
        if (pair.length === 2) {
            attributes[pair[0]] = pair[1];
        } else {
            throw new Error(`${lineNumber}: malformed attribute string '${tokens[tokenIndex]}'`)
        }
    }

    // Returns the attribute map
    return attributes
}

/**
 * Parses the line to determine whether it is an edge or node line.
 * @param {Graph} graph Graph to modify
 * @param {String} line Line string
 */
function parseLine(graph, line) {
    // Trim the line string to remove leading/trailing whitespace and split along spaces
    const trimmedLine = line.trim();
    if ( trimmedLine.length === 0 ) return; // Ignore blank lines
    // Javascript must have a standard regex for whitespace
    const whitespaceRegex = /[ \t]+/;
    const tokens = trimmedLine.split(whitespaceRegex);

    // Check the first token and send the tokens to be parsed as a node or edge as appropriate
    switch ( tokens[0] ) {
        case "c":
            // Add comments to the graph's comments list
            parseComment(graph, trimmedLine);
            return;
        case "n":
            parseNode(graph, tokens);
            return;
        case "e":
            parseEdge(graph, tokens);
            return;
        case "t":
            return;
        case "g":
            return;
        case "r":
            return;
        case "b":
            graph.treeType = "binary";
            return;
        default:
            // If the line starts with an unrecognized character, throw an error
            throw new Error(`${lineNumber}: expected line to begin with one of [n,e,c,g,t,r,b], got '${tokens[0]}'`);
    }
}

/**
 * @author Heath Dyer (hadyer)
 * @param {*} graph Graph to update
 * @param {*} line 
 */
function parseComment(graph, line) {
    graph.comments.add(line);
}

/**
 * Parses a node line and creates a new node object.
 * @param {Graph} graph Graph to modify
 * @param {Array} tokens Values to parse
 * @todo instead of a list of tokens, start with the line string and parse attributes separately,
 *    checking for errors along the way
 * @todo this no longer catches missing coordinates
 */
function parseNode(graph, tokens) {
    // Get the necessary tokens to create a node
    const id = tokens[1];
    if ( ! isNumeric(tokens[2]) ) {
        throw new Error(`${lineNumber}: missing or malformed x coordinate '${tokens[2]}' for node ${id}`)
    }
    const x = parseFloat(tokens[2]);
    if ( ! isNumeric(tokens[3] ) ) {
        throw new Error(`${lineNumber}: missing or malformed y coordinate '${tokens[3]}' for node ${id}`)
    }
    const y = parseFloat(tokens[3]);
    
    // Get attributes from remaining tokens
    const attributes = parseAttributes(tokens, 4);

    // Since the file contains node ids and attributes, pass them in as the last arguments
    addNode(graph, x, y, id, attributes);
}

/**
 * Adds a new node to the given graph.
 * @param {Graph} graph Graph to which to add
 * @param {Number} x X position
 * @param {Number} y Y position
 * @param {String} nodeId Node id
 * @param {Object} attributes Node attributes
 */
function addNode(graph, x, y, nodeId, attributes) {
    // Throw an error if the id is a duplicate
    if (nodeId && graph.nodes.has(nodeId)) {
        throw new Error(`${lineNumber}: cannot add node with duplicate ID ${nodeId}`);
    }

    // If the nodeId argument is passed, use that, otherwise generate an id
    nodeId = nodeId || GraphInterface.generateId(graph);

    // Create the node
    // Two special cases:
    // 1. Layered graphs store layer and index instead of x and y, which are y and x, respectively
    // 2. Nodes in trees have undefined poisions
    let node;
    const newSequenceNumber = GraphInterface.generateSequenceNumber()
    if ( graph.type === 'layered' ) {
        node = new Node(nodeId, newSequenceNumber, y, x, x, y)
    }
    else if ( graph.type === 'tree' ) {
        node = new Node(nodeId, newSequenceNumber, undefined, undefined);
    }
    else {
        node = new Node(nodeId, newSequenceNumber, x, y);
    }
    graph.nodes.set(nodeId, node);

    // Set the attributes
    for (let name in attributes) {
        node.attributes.set(name, attributes[name]);
    }

    return node;
}

/**
 * Parses an edge line and creates a new edge object.
 * @param {Graph} graph Graph to modify
 * @param {Array} tokens Values to parse
 */
function parseEdge(graph, tokens) {
    // Get the necessary tokens to create an edge
    let source = tokens[1], target = tokens[2];
    
    // Get attributes from remaining tokens
    const attributes = parseAttributes(tokens, 3);
    
    // Add the edge
    addEdge(graph, source, target, attributes);
}

/**
 * Adds a new edge to the given graph.
 * @param {Graph} graph Graph to which to add
 * @param {String} source Source node
 * @param {String} target Target node
 * @param {Object} attributes Edge attributes
 * @todo catch errors earlier, when parsing the edge
 */
function addEdge(graph, source, target, attributes) {
    // Error checking
    if ( ! graph.nodes.has(source) && ! graph.nodes.has(target) )
        throw new Error(`${lineNumber}: cannot create edge because neither the source (${source}) nor the target (${target}) node exist in the graph`);
    if ( ! graph.nodes.has(source))
        throw new Error(`${lineNumber}: cannot create edge because the source node (${source}) does not exist in the graph`);
    if ( ! graph.nodes.has(target) )
        throw new Error(`${lineNumber}: cannot create edge because the target node (${target}) does not exist in the graph`);
    const sourceNode = graph.nodes.get(source)
    if ( sourceNode.edges.get(`${source},${target}`) !== undefined ) {
        throw new Error(`${lineNumber}: edge from ${source} to ${target} already exists`)
    }

    // additional error handling for layered graphs
    if ( graph.type === 'layered' ) {
        const sourceLayer = graph.nodes.get(source).layer
        const targetLayer = graph.nodes.get(target).layer

        if ( sourceLayer === targetLayer ) {
            throw new Error(`${lineNumber}: edge ${source},${target} connects nodes on same layer`)
        }
        if ( targetLayer !== sourceLayer + 1 ) {
            throw new Error(`${lineNumber}: edge ${source},${target} connects nodes on non-adjacent layers`)
        }
    }

    // Create the edge object
    let edge = new Edge(source, target);

    // Set the attributes
    for (let name in attributes) {
        edge.attributes.set(name, attributes[name]);
    }

    // Add the edge to both the source and target's adjacency lists
    graph.nodes.get(source).edges.set(`${source},${target}`, edge);
    graph.nodes.get(target).edges.set(`${source},${target}`, edge);
}

/** Export an object containing the interface */
const FileParser = {
    loadGraph
};
export default FileParser;