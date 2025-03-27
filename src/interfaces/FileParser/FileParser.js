import Edge from "../../states/Graph/GraphElement/Edge";
import GraphInterface from "../GraphInterface/GraphInterface"
import LayeredGraph from "../../states/Graph/LayeredGraph";
import Node from "../../states/Graph/GraphElement/Node";
import StandardGraph from "../../states/Graph/StandardGraph";

/**
 * FileParser is an interface for loading a graph representation from a file.
 * 
 * @author Henry Morris
 * @author Jacob Usher
 */

/**
 ***********
 * HELPERS *
 ***********
 */

 /**
 * Helper method for determing the graph file format.
 * A graph is in SGF if the extension is .sgf, or there is a header line starting with a 't'
 * Otherwise it is assumed to be in GPH
 * @param {String} name Name of the graph file
 * @param {String} file The text of the graph file
 * @returns True if the graph is in SGF format.
 */
function isLayeredGraph(name, file) {
    let isLayeredGraph = false;
    const lines = file.split("\n");
    
    //Check for the .sgf extension
    if ( name.endsWith('.sgf') ) {
        isLayeredGraph = true;
    }

    //Check for a header or tag line beginning with 't'
    lines.forEach((line) => {
        line = line.trim();
        const values = line.split(" ");

        if (values[0] === 't') {
            isLayeredGraph = true;
        };
    });

    return isLayeredGraph;
}

/**
 * Checks if a string can be parsed into a number.
 * @author see: https://stackoverflow.com/a/175787
 * @param {String} str String to check
 * @returns True if the string is numeric, false otherwise
 */
function isNumeric(str) {
    if (typeof str !== "string") return false;
    return !Number.isNaN(Number(str)) && !Number.isNaN(parseFloat(str));
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
    // Split the file on the new line character and parse each line
    const lines = file.split("\n");

    //Initialize the proper graph type
    const graph = isLayeredGraph(name, file)
        ? new LayeredGraph(name)
        : new StandardGraph(name);
    
    // Parse each line
    lines.forEach(line => { parseLine(graph, line) });

    // Generate a scale for the graph based on the node positions
    graph.scalar = GraphInterface.getScalar(graph);

    // Return the new graph
    return graph;
}

/**
 * Parses the line to determine whether it is an edge or node line.
 * @param {Graph} graph Graph to modify
 * @param {String} line Line string
 */
function parseLine(graph, line) {
    // Trim the line string to remove leading/trailing whitespace and split along spacez
    line = line.trim();
    const values = line.split(" ");

    // Regex to match comments
    const commentRegex = /^([gct].*)?$/;

    // Regexes to match simple node and edge lines
    const nodeRegex = /^n \S+ -?\d+.?\d* -?\d+.?\d*( -?\d+)?( [^ \n\t:]+:[^ \n\t:]+)*$/;
    const edgeRegex = /^e \S+ \S+( -?\d+)?( [^ \n\t:]+:[^ \n\t:]+)*$/;

    // Check which regex matches and send the values to be parsed as either a node or edge
    switch (true) {
        case commentRegex.test(line):
            // Ignore comments
            parseComment(graph, line);
            return;
        case nodeRegex.test(line):
            parseNode(graph, values);
            return;
        case edgeRegex.test(line):
            parseEdge(graph, values);
            return;
        default:
            // If the line was not a node or an edge, throw an exception
            throw new Error("input line from file: \"" + line + "\" is not a valid node or edge.");
    }
}

/**
 * @author Heath Dyer (hadyer)
 * TODO: add better comment & header handling system
 * @param {*} graph Graph to update
 * @param {*} line 
 */
function parseComment(graph, line) {
    graph.comments.add(line);
}

/**
 * Parses a node line and creates a new node object.
 * @param {Graph} graph Graph to modify
 * @param {Array} values Values to parse
 */
function parseNode(graph, values) {
    // Get the necessary values to create a node
    let id = values[1];
    let x = parseFloat(values[2]), y = parseFloat(values[3]);
    let attributes = {};
    
    // Get the weight, but only if it is a numeric value
    if (isNumeric(values[4])) {
        attributes["weight"] = parseFloat(values[4]);
    }

    // Loop over the rest of the values
    for (let i = (attributes["weight"] === undefined) ? 4 : 5; i < values.length; i++) {
        // Set the attribute
        let pair = values[i].trim().split(":");
        if (pair.length === 2) {
            attributes[pair[0]] = pair[1];
        }
    }

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
        throw new Error("Cannot add node with duplicate ID");
    }

    // If the nodeId argument is passed, use that, otherwise generate an id
    nodeId = nodeId || generateId(graph.nodes);

    //TODO take a look at this
    // Create the node
    let node = graph.type === 'layered' 
        ? new Node(nodeId, y, x, x, y)
        : new Node(nodeId, x, y);

    graph.nodes.set(nodeId, node);

    // Set the attributes
    for (let name in attributes) {
        node.attributes.set(name, attributes[name]);
    }

    // Get the smallest unused node id for automatic assigning
    function generateId(nodes) {
        let id = 0;
        while (nodes.has(String(id))) id++;
        return String(id);
    }
}

/**
 * Parses an edge line and creates a new edge object.
 * @param {Graph} graph Graph to modify
 * @param {Array} values Values to parse
 */
function parseEdge(graph, values) {
    // Get the necessary values to create an edge
    let source = values[1], target = values[2];
    let attributes = {};
    
    // Get the weight, but only if it is a numeric value
    if (isNumeric(values[3])) {
        attributes["weight"] = parseFloat(values[3]);
    }

    // Loop over the rest of the values
    for (let i = (attributes["weight"] === undefined) ? 3 : 4; i < values.length; i++) {
        // Set the attribute
        let pair = values[i].trim().split(":");
        if (pair.length === 2) {
            attributes[pair[0]] = pair[1];
        }
    }

    // Add the edge
    addEdge(graph, source, target, attributes);
}

/**
 * Adds a new edge to the given graph.
 * @param {Graph} graph Graph to which to add
 * @param {String} source Source node
 * @param {String} target Target node
 * @param {Object} attributes Edge attributes
 */
function addEdge(graph, source, target, attributes) {
    // Error checking
    if (!graph.nodes.has(source) && !graph.nodes.has(target))
        throw new Error(`Cannot create edge because neither the source (${source}) nor the target (${target}) node exist in the graph`);
    if (!graph.nodes.has(source))
        throw new Error(`Cannot create edge because the source node (${source}) does not exist in the graph`);
    if (!graph.nodes.has(target))
        throw new Error(`Cannot create edge because the target node (${target}) does not exist in the graph`);

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
