import Edge from "../../states/Graph/GraphElement/Edge";
import GraphInterface from "../GraphInterface/GraphInterface"
import LayeredGraph from "../../states/Graph/LayeredGraph";
import Node from "../../states/Graph/GraphElement/Node";
import StandardGraph from "../../states/Graph/StandardGraph";
import Tree from "../../states/Graph/Tree";
import Graph from "states/Graph/Graph";
//import { create, get } from "cypress/types/lodash";

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
function isTree(name) {
    //Checks for a .tree extension
    const values = name.split(".");
    const extension = values[values.length - 1];
    return extension.includes("tree");
}

/**
 * Finds the root nodes and leaf nodes for a given graph
 * @param {Graph} graph The graph to examine
 * @returns An array containing the roots at index 0 and the leaves at index 1
 */
function getRootsAndLeaves(graph){
    //Initialize the roots and leaves storage
    const roots = [];
    const leaves = [];

    //Examine each node in the graph
    for ( const [id, node] of graph.nodes ){

        //Initialize booleans for if it is a root and leaf
        let isRoot = true;
        let isLeaf = true;

        //Examine each edge coming into or out of the node
        for ( const [id, edge] of node.edges) {
            //If the edge goes out, it has children and is not a leaf
            if( edge.source == node.id ){
                isLeaf = false;
            }else{
            //Otherwise, it is not a root
                isRoot = false;
            }
        }
        //Include the node in roots or leaves
        if( isRoot ){
            roots.push(node);
            console.log("Root: " + node.id)
        }
        if( isLeaf ){
            leaves.push(node)
            console.log("Leaf: " + node.id)
        }
    }

    //Return roots and leaves
    return [roots, leaves]
}

/**
 * Finds and stores the depth of each node in a given graph
 * @param {Graph} graph The graph to assign node depths to
 * @param {Array} leaves The starting points to find depths of
 * @returns the maximum depth found among all nodes
 */
function assignDepths(graph, roots){
    //Initialize a variable to store the maximum depth
    let maxDepth = -1;

    //Compute the maximum depth of each subtree
    for ( const root of roots ){
        const depth = computeDepths(graph, root, 0);

        //If this tree has the largest depth, store it
        if( depth > maxDepth ){
            maxDepth = depth;
        }
    }
    
    //Return the maximum depth
    console.log("Max depth: " + maxDepth);
    return maxDepth;
}

/**
 * Assigns the correct depth to subtree_root and all of its descendants
 * @param subtree_root the root of a subtree in the forest
 * @param k the correct depth of subtree_root
 * @return the maximum depth of any descendant of subtree_root
 */
function computeDepths(graph, subtree_root, k){
    //Error checking for cycle
    if(subtree_root.depth){
        throw new Error("Node " + subtree_root.id + " has too many parents.");
    }
    
    //Initialize necessary variables
    const children = getChildren(graph, subtree_root);
    let maxDepth = -1;
    subtree_root.depth = k;
    
    //If this node has no children, it is a leaf, return k
    if( children.length == 0 ){
        return k;
    }

    //Compute the depths of all children of this root
    for( const child of children){
        //Store maximum depth found
        const childDepth = computeDepths(graph, child, k + 1);
        maxDepth = childDepth > maxDepth ? childDepth : maxDepth;
    }

    //Return the maximum depth of children
    return maxDepth;
}

/**
 * Gets the children of a given node
 * Possibly needs to move to GraphInterface or TreeInterface
 * @param {Graph} graph 
 * @param {Node} node 
 * @returns The children of a given node
 */
function getChildren(graph, node){
    //Initialize necessary variables
    let children = [];

    //Find children from edges
    for( const [subjects, edge] of node.edges ){
        //If the edge leads to a child, store child node
        if( edge.source == node.id ){
            children.push(graph.nodes.get(edge.target));
        }
    }

   //Returns an array of child nodes 
    return children;
}

/**
 * Gets the parent of a given node
 * Possibly needs to move to GraphInterface or TreeInterface
 * @param {Graph} graph The graph containing our node and parent
 * @param {Node} node The node to find a parent of
 */
function getParent(graph, node){

    //Find an edge that comes from a parent, and return the parent node
    for( const [subjects, edge] of node.edges ){
        if( edge.target == node.id ){
            return graph.nodes[edge.source];
        }
    }
}

/**
 * Adds hidden nodes to all leaf nodes not already at the maximum depths
 * @param {Graph} graph Graph that stores all nodes
 * @param {Map} nodeDepths The current depth of every node
 * @param {Array} leaves An array of every leaf on our graph
 * @param {Number} maxDepth 
 */
function addHiddenPaths(graph, leaves, maxDepth){
    //Add hidden nodes to each leaf until they are the proper height
    for ( const leaf of leaves ){

        //Add hidden nodes until they reach the maximum depth
        let bottomNode = leaf;
        while( bottomNode.depth < maxDepth ){

            //Connect a new node and reassign the bottom most node
            const newNode = addNode(graph, 0, 0, undefined, {color:"red"});
            addEdge(graph, bottomNode.id, newNode.id);
            newNode.depth = bottomNode.depth + 1;
            bottomNode = newNode;
        }
    }
}

/**
 * Adds a single hidden root to ensure proper ordering of subtrees.
 * @param {Graph} graph 
 * @param {Array} roots 
 */
function addHiddenRoot(graph, roots){
    //Creates a hidden node to be the root
    const hiddenRoot = addNode(graph, 0, 0, undefined, {color:"red"});

    //Connect the hidden root to each actual root of the forest
    for( const root of roots ){
        addEdge(graph, hiddenRoot.id, root.id);
    }
}

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
        const tokens = line.split(" ");

        if (tokens[0] === 't') {
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
 * @todo Allow for Infinity, NaN, and other special numeric values
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

    // Initialize the proper graph type
    let graph = null;
    if ( isLayeredGraph(name, file) ) {
        graph = new LayeredGraph(name) }
    else if ( isTree(name) ) {
        graph = new Tree(name);
    } else {
        graph = new StandardGraph(name);
    }
    // Parse each line, ignoring comments and blank lines
    // This part is the same for all graph types
    lines.forEach(line => { parseLine(graph, line) });

    if ( graph.type === "layered" ) {
        createLayers(graph);
    } else if ( graph.type === "tree" ) {
        forceCorrectTreeLayout(graph);
    }

    if ( graph.type !== "tree") {
        // Generate a scale for the graph based on the node positions
        graph.scalar = GraphInterface.getScalar(graph);
    }

    return graph;
}

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

    // Iterate through each layer, sort its nodes by x position and update the node's layer and index properties accordingly
    for (const [layer, nodes] of layers) {
        const sortedNodes = nodes.sort((a, b) => a.position.x - b.position.x);
        for ( const [idx, node] of sortedNodes.entries() ) {
            node.layer = layer - minLayer;
            node.index = idx;
        }
    }
}

/**
 * Adds invisible nodes and edges to force a correct tree layout:
 * - all leaves are at the same depth; add a path of invisible nodes to each leaf until it is at the max depth
 * - an invisible root node is added if there are multiple roots
 * @param {Graph} graph Graph to modify
 */
function forceCorrectTreeLayout(graph) {
    const [roots, leaves] = getRootsAndLeaves(graph);
    const maxDepth = assignDepths(graph, roots);
    addHiddenPaths(graph, leaves, maxDepth);
    addHiddenRoot(graph, roots);
}

/**
 * Helper functions for parsing lines
 */

/**
 * @return a list of attribute based on the line string and starting index
 * Each atribute is a key:value pair separated by a colon
 * @param {Array} tokens A list of tokens from the line 
 * @param {Number} startingIndex Index at which to start parsing attributes
 */
function parseAttributes(tokens, startingIndex) {
    //Initializes the attribute map
    const attributes = {};

    //Assigns the weight if it exists
    if (isNumeric(tokens[startingIndex])) {
        attributes["weight"] = parseFloat(tokens[3]);
        startingIndex++;
    }

    //Adds each remaining attribute to the attribute map
    for ( let tokenIndex = startingIndex; tokenIndex < tokens.length; tokenIndex++ ) {
        // Find and set the attribute
        let pair = tokens[tokenIndex].trim().split(":");
        if (pair.length === 2) {
            attributes[pair[0]] = pair[1];
        }
    }

    //Returns the attribute map
    return attributes
}

/**
 * Parses the line to determine whether it is an edge or node line.
 * @param {Graph} graph Graph to modify
 * @param {String} line Line string
 * @todo Fix whitespaceRegex. Can split on " " but doesn't account for tab
 */
function parseLine(graph, line) {
    // Trim the line string to remove leading/trailing whitespace and split along spacez
    line = line.trim();
    if ( line.length === 0 ) return; // Ignore blank lines
    // Javascript must have a standard regex for whitespace
    const whitespaceRegex = /[ \t]+/;
    const tokens = line.split(whitespaceRegex);

    // Check the first token and send the tokens to be parsed as a node or edge as appropriate
    switch ( tokens[0] ) {
        case "c":
            // Add comments to the graph's comments list
            parseComment(graph, line);
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
        default:
            // If the line starts with an unrecognized character, throw an error
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
 * @param {Array} tokens Values to parse
 * @todo instead of a list of tokens, start with the line string and parse attributes separately,
 *    checking for errors along the way
 */
function parseNode(graph, tokens) {
    // Get the necessary tokens to create a node
    let id = tokens[1];
    let x = parseFloat(tokens[2]), y = parseFloat(tokens[3]);
    
    //Get attributes from remaining tokens
    const attributes = parseAttributes(tokens, 4);

/**
 *   ******* OLD CODE ******* - move to parseAttributes()
    // Loop over the rest of the tokens
    for (let i = (attributes["weight"] === undefined) ? 4 : 5; i < tokens.length; i++) {
        // Set the attribute
        let pair = tokens[i].trim().split(":");
        if (pair.length === 2) {
            attributes[pair[0]] = pair[1];
        }
    }
*/
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

    return node;

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
 * @param {Array} tokens Values to parse
 */
function parseEdge(graph, tokens) {
    // Get the necessary tokens to create an edge
    let source = tokens[1], target = tokens[2];
    
    //Get attributes from remaining tokens
    const attributes = parseAttributes(tokens, 3);
    
/**
 *   ******* OLD CODE ******* - move to parseAttributes()
    // Loop over the rest of the tokens
    for (let i = (attributes["weight"] === undefined) ? 3 : 4; i < tokens.length; i++) {
        // Set the attribute
        let pair = tokens[i].trim().split(":");
        if (pair.length === 2) {
            attributes[pair[0]] = pair[1];
        }
    }
*/
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