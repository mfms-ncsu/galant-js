import Tree from "states/Graph/Tree";
import GraphInterface from "./GraphInterface";
import ChangeManager from "states/ChangeManager/ChangeManager";
import ChangeObject from "states/ChangeManager/ChangeObject";

/**
 * Helper function to handle what to do when a graph
 * is not a tree.
 * @param {Graph} graph Graph on which to operate
 */
function isTree(graph) {
  if ( !(graph.type === "tree") ) {
    throw new Error("Function can only be performed on trees.");
  }
}

/**
 * Gets parents of target node
 * @param {Graph} graph Graph on which to operate
 * @param {String} target Node to check 
 * @returns Array of parent nodes
 */
function getParents(graph, target) {
  isTree(graph);

  // Throw an error if the node doesn't exist
  if ( !graph.nodes.has(target) ) {
    throw new Error(
      "Cannot get parents of node " +
        target +
        " because no node with this id exists in the graph"
    );
  }

  let parents = [];

  // Adds node to array if edge target is the target
  graph.nodes.get(target).edges.forEach((edge) => {
    if ( edge.target === target ) {
      parents.push(edge.source);
    }
  });

  return parents;
}

/**
 * Gets children of target node
 * @param {Graph} graph Graph on which to operate
 * @param {String} target Node to check 
 * @returns Array of children nodes
 */
function getChildren(graph, source) {
  isTree(graph);

  let children = [];

  // Adds node if source of edge is the source node provided
  if ( graph.nodes.has(source) ) {
    graph.nodes.get(source).edges.forEach((edge) => {
      if ( edge.source === source ) {
        children.push(edge.target);
      }
    });

    return children;
  } else {
    // If the node doesn't exist, throw an error
    throw new Error(
      "Cannot get the children of node " +
        source +
        " because no such node exists in the graph"
    );
  }
}

/**
 * Get to roots of the tree (for forests)
 * @param {Graph} graph Graph on which to operate
 * @author Bryan Fang
 * @returns Array of roots
 */
function getRoots(graph) {
  isTree(graph);

  let roots = [];

  for (const currentNode of graph.nodes) {
    if ( getParents(graph, currentNode).length === 0 ) {
      roots.push(currentNode);
    }
  }

  return roots;
}

/**
 * Get to root of the tree
 * @param {Graph} graph Graph on which to operate
 * @returns Root node
 */
function getRoot(graph) {
  isTree(graph);

  for (const currentNode of graph.nodes) {
    if ( getParents(graph, currentNode).length === 0 ) {
      return currentNode;
    }
  }
}

/**
 * Sorts the nodes of a tree by weight in ascending order.
 * MAY NEED TO BE MODIFIED TO USE A DRAFT/IMMER ARCHETYPE
 * @param {Graph} graph Graph to sort
 */
function sortByWeight(graph) {
  isTree(graph);

  // Turns the nodes map into an array, sorts it, then turns it back into a map
  graph.nodes = new Map(
    [...graph.nodes.entries()].sort((a, b) => a[1].attributes.get("weight") - b[1].attributes.get("weight")
  ));
}

/**
 * Checks if the node is a leaf
 * @param {Graph} graph Graph on which to operate
 * @param {string} nodeId Node to check
 * @returns true if node is leaf else false
 */
function isLeaf(graph, nodeId) {
  isTree(graph);

  // Throw an error if the node doesn't exist
  if ( !graph.nodes.has(nodeId) ) {
    throw new Error(
      "Cannot check node " +
        nodeId +
        " because no node with this id exists in the graph"
    );
  }

  // Checks if node has any children
  if ( getChildren(graph, graph.noded.get(nodeId)).length === 0 ) {
    return true;
  }

  return false;
}

/**
 * Gets the left child of the node
 * @param {Graph} graph Graph on which to operate
 * @param {string} nodeId Node to check
 * @returns Left node
 */
function getLeft(graph, nodeId) {
  isTree(graph);

  // Throw an error if the node doesn't exist
  if ( !graph.nodes.has(nodeId) ) {
    throw new Error(
      "Cannot get left child of node " +
        nodeId +
        " because no node with this id exists in the graph"
    );
  }

  // Gets children and checks if a left child exists
  let children = getChildren(graph, nodeId);
  if ( children.length === 0 ) {
    throw new Error(
      "Left child does not exist"
    );
  }

  return children[0];
}

/**
 * Gets the right child of the node
 * @param {Graph} graph Graph on which to operate
 * @param {string} nodeId Node to check
 * @returns right node
 */
function getRight(graph, nodeId) {
  isTree(graph);

  // Throw an error if the node doesn't exist
  if ( !graph.nodes.has(nodeId) ) {
    throw new Error(
      "Cannot get right child of node " +
        nodeId +
        " because no node with this id exists in the graph"
    );
  }

  // Gets children and checks if a right child exists
  let children = getChildren(graph, nodeId);
  if ( children.length < 1 ) {
    throw new Error(
      "Right child does not exist"
    );
  }

  return children[1];
}

/** Export an object containing the interface */
const TreeInterface = {
  getParents,
  getChildren,
  getRoots,
  getRoot,
  isLeaf,
  getLeft,
  getRight
};
export default TreeInterface; 
