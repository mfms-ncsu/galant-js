import Edge from "../../states/Graph/GraphElement/Edge";
import Node from "../../states/Graph/GraphElement/Node";
import GraphInterface from "./GraphInterface";
/**
 * Currently, TreeInterface contains methods necessary to add
 * hidden nodes to trees. This file can contain any method or
 * interaction unique to tree type graphs. While most functions
 * can still be done through GraphInterface.js, there is some functionality
 * unique to trees that are best fit to only exist here.
 *
 * @author Andrew Parr
 */

/**
 * Verifies that a given graph is a tree. Checks to see if there is a malformed graph.
 * @param {Graph} graph Graph verify tree type of
 * @returns false if it is not a tree, true if it is. If there is a malformed tree, throws an error.
 */
function verifyTree(graph){
    // Checks the type of graph
    if ( graph.type !== "tree" ){
        return false;
    }

    // The graph is a tree, but may be misformatted
    for ( const [nodeId, node] of graph.nodes ) {
        console.log(getInDegree(graph, node));
        if ( getInDegree(graph, node) > 1 ){
            throw new Error( "Node " + node.id + " has too many parents.");
        }
    }

    // No errors, return true
    return true;
}

/**
 * Adds invisible nodes and edges to force a correct tree layout:
 * - all leaves are at the same depth; add a path of invisible nodes to each leaf until it is at the max depth
 * - an invisible root node is added if there are multiple roots
 * @param {Graph} graph Graph to modify
 */
function forceCorrectTreeLayout(graph) {
    // Deletes hidden nodes from the current graph
    deleteHiddenNodes(graph);

    // Verifies that the graph is a tree
    if ( ! verifyTree(graph) ){
        throw new Error("This graph is not a tree, but you are attempting to call a tree only method on it.");
    }

    // Finds the roots and leaves, then finds the longest depth
    const [roots, leaves] = getRootsAndLeaves(graph);
    const maxDepth = assignDepths(graph, roots);

    // Adds a hidden root and leaves to the graph to force layout consistency
    addHiddenRoot(graph, roots);
    addHiddenPaths(graph, leaves, maxDepth);

    // Error checking
    console.log("Final graph with hidden nodes: ", graph)
}

/**
 * Finds the root nodes and leaf nodes for a given graph
 * @param {Graph} graph The graph to examine
 * @returns An array containing the roots at index 0 and the leaves at index 1
 */
function getRootsAndLeaves(graph){
    // Initialize the roots and leaves storage
    const roots = [];
    const leaves = [];

    // Examine each node in the graph
    for ( const [nodeId, node] of graph.nodes ){

        // Initialize booleans for if it is a root and leaf
        let isRoot = true;
        let isLeaf = true;

        // Examine each edge coming into or out of the node
        for ( const [edgeId, edge] of node.edges ) {
            // If the edge goes out, it has children and is not a leaf
            if ( edge.source === node.id ){
                isLeaf = false;
            } else {
            // Otherwise, it is not a root
                isRoot = false;
            }
        }
        // Include the node in roots or leaves
        if ( isRoot ){
            roots.push(node);
            console.log("Root: " + node.id);
        }
        if ( isLeaf ){
            leaves.push(node);
            console.log("Leaf: " + node.id);
        }
    }

    // Return roots and leaves
    return [roots, leaves];
}

/**
 * Finds and stores the depth of each node in a given graph
 * @param {Graph} graph The graph to assign node depths to
 * @param {Array} leaves The starting points to find depths of
 * @returns the maximum depth found among all nodes
 */
function assignDepths(graph, roots){
    // If there are no roots, there is a cycle
    if ( roots.length == 0 ){
        throw new Error( "There is a cycle in your tree." );
    }

    // Initialize a variable to store the maximum depth
    let maxDepth = -1;

    // Compute the maximum depth of each subtree
    for ( const root of roots ){
        const depth = computeDepths(graph, root, 0);

        // If this tree has the largest depth, store it
        if ( depth > maxDepth ){
            maxDepth = depth;
        }
    }
    
    // Return the maximum depth
    console.log( "Max depth: " + maxDepth );
    return maxDepth;
}

/**
 * Assigns the correct depth to subtree_root and all of its descendants
 * @param subtreeRoot the root of a subtree in the forest
 * @param rootDepth the correct depth of subtree_root
 * @return the maximum depth of any descendant of subtree_root
 */
function computeDepths(graph, subtreeRoot, rootDepth){
    // Initialize necessary variables
    const children = getChildren(graph, subtreeRoot);
    let maxDepth = -1;
    subtreeRoot.depth = rootDepth;
    
    // If the node is a leaf return its depth
    if ( children.length == 0 ){
        return rootDepth;
    }

    // Compute the depths of all children of this root
    for( const child of children ){
        // Store maximum depth found
        const childDepth = computeDepths(graph, child, rootDepth + 1);
        maxDepth = childDepth > maxDepth ? childDepth : maxDepth;
    }

    // Return the maximum depth of children
    return maxDepth;
}

/**
 * Gets the children of a given node
 * Possibly needs to move to GraphInterface or TreeInterface
 * @param {Graph} graph The graph that the given node exists in
 * @param {Node} node The node to find children of
 * @returns The children of a given node
 */
function getChildren(graph, node){
    // Initialize necessary variables
    let children = [];

    // Find children from edges
    for( const [subjects, edge] of node.edges ){
        // If the edge leads to a child, store child node
        if ( edge.source === node.id ){
            children.push(graph.nodes.get(edge.target));
        }
    }

   // Returns an array of child nodes 
    return children;
}

/**
 * Gets the parent of a given node
 * Possibly needs to move to GraphInterface or TreeInterface
 * @param {Graph} graph The graph containing our node and parent
 * @param {Node} node The node to find a parent of
 * @returns The parent of the given node
 */
function getParent(graph, node){
    // Find an edge that comes from a parent, and return the parent node
    for( const [subjects, edge] of node.edges ){
        if ( edge.target === node.id ){
            return graph.nodes[edge.source];
        }
    }
}

/**
 * Adds hidden nodes to all leaf nodes not already at the maximum depths
 * @param {Graph} graph Graph that stores all nodes
 * @param {Map} nodeDepths The current depth of every node
 * @param {Array} leaves An array of every leaf on our graph
 * @param {Number} maxDepth Maximum depth of all trees
 */
function addHiddenPaths(graph, leaves, maxDepth){
    // Add hidden nodes to each leaf until they are the proper height
    for ( const leaf of leaves ){

        // Add hidden nodes until they reach the maximum depth
        let bottomNode = leaf;
        while( bottomNode.depth < maxDepth ){

            // Connect a new node and reassign the bottom most node
            const newNode = addHiddenNode(graph);
            addEdge(graph, bottomNode.id, newNode.id);
            newNode.depth = bottomNode.depth + 1;
            bottomNode = newNode;
        }
    }
}

/**
 * Adds a single hidden root to ensure proper ordering of subtrees.
 * @param {Graph} graph Graph to add a hidden root to.
 * @param {Array} roots The roots of the given graph.
 */
function addHiddenRoot(graph, roots){
    // Creates a hidden node to be the root
    const hiddenRoot = addHiddenNode(graph);

    // Connect the hidden root to each actual root of the forest
    for( const root of roots ){
        addEdge(graph, hiddenRoot.id, root.id);
    }
}

/**
 * Removes all the hidden nodes from the graph to ensure a clean slate exists
 * to reattach a hidden root and hidden leaves.
 * @param {Graph} graph the graph to remove hidden nodes from
 */
function deleteHiddenNodes(graph){
    // If a node is hidden, delete its edges and then itself
    for (const [id, node] of graph.nodes) {

        // Checks to see if the current node is hidden
        if ( node.attributes && (node.attributes.get("hidden") === "true" || node.attributes.get("hidden") === true) ) {

            // Delete each edge of the current hidden node
            for (const [id, edge] of node.edges ) {
                const source = edge.source;
                const target = edge.target;
                graph.nodes.get(source).edges.delete(`${source},${target}`);
                graph.nodes.get(target).edges.delete(`${source},${target}`);
            }
        
            // Delete the hidden node
            graph.nodes.delete(node.id);
        }
    }

    // Error checking
    console.log("Graph with no hidden nodes: ", graph);
}

/**
 * Adds a new hidden node to the given graph. This node has a generated ID and
 * the hidden attribute set to 'true'
 * @param {Graph} graph Graph to which to add a hidden node to
 */
function addHiddenNode(graph) {

    // Generate an ID
    const nodeId = generateId(graph.nodes);

    // Create the node
    let node = new Node(nodeId, 0, 0);
    graph.nodes.set(nodeId, node);

    // Set the attributes
    node.attributes.set("hidden", true);
    
    // Return the node to caller
    return node;

    // Get the smallest unused node id for automatic assigning
    // TODO possibly replace this with random string or a hash, we don't want IDs being eaten
    function generateId(nodes) {
        let id = 0;
        while (nodes.has(String(id))) id++;
        return String(id);
    }
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
    if ( !graph.nodes.has(source) && !graph.nodes.has(target) )
        throw new Error(`Cannot create edge because neither the source (${source}) nor the target (${target}) node exist in the graph`);
    if ( !graph.nodes.has(source) )
        throw new Error(`Cannot create edge because the source node (${source}) does not exist in the graph`);
    if ( !graph.nodes.has(target) )
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

/**
 * Gets the in degree of a given node on a given graph.
 * @param {Graph} graph Graph of the node to get in degree of. 
 * @param {Node} node The node to get the in degree of.
 * @returns The number of edges with the node as a target
 */
function getInDegree(graph, node){
    return GraphInterface.getIncomingEdges(graph, node.id).length; 
}

/**
 * Gets the out degree of a given node on a given graph.
 * @param {Graph} graph Graph of the node tp get out degree of.
 * @param {Node} node The node to get the out degree of.
 * @returns The number of edges with the node as a source
 */
function getOutDegree(graph, node){
    return GraphInterface.getOutgoingEdges(graph, node.id).length; 
}

const TreeInterface = {
    forceCorrectTreeLayout
};

export default TreeInterface;