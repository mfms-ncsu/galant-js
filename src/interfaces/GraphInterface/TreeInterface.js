import Tree from "states/Graph/Tree";
import GraphInterface from "./GraphInterface";
import produce from "immer";
import ChangeManager from "states/ChangeManager/ChangeManager";
import ChangeObject from "states/ChangeManager/ChangeObject";
import Node from "states/Graph/GraphElement/Node";
import Edge from "states/Graph/GraphElement/Edge";

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
 * Generates the next unique node id from the given list of nodes.
 * Copied over from GraphInterface. This function is copied so the function
 * remains usable without needing to export it from GraphInterface.
 * @param {Node[]} nodes Array of nodes to check
 * @returns New node id
 */
function generateId(nodes) {
  let id = 0;
  while (nodes.has(String(id))) id++;
  return String(id);
}

/**
 * Records a new change in the given change manager.
 * Copied over from GraphInterface. This function is copied so the function
 * remains usable without needing to export it from GraphInterface.
 * @param {ChangeManager} changeManager Change manager to which to add
 * @param {ChangeObject[]} change Changes to log
 * @returns Updated change manager
 */
function recordChange(changeManager, change) {
    
    // If the change manager is not recording, save the change to the
    // main list of changes
    if (!changeManager.isRecording) {
        return produce(changeManager, (draft) => {
            // Remove all changes after the current index
            draft.changes = draft.changes.slice(0, draft.index);

            // Push the new change
            draft.changes.push(change);

            // Increment the index
            draft.index++;
        });
    }
    
    // If the change manager is recording, save the change to the
    // temporary list of changes, and return
    return produce(changeManager, (draft) => {
        
        change.forEach( (changeObj) => {
            draft.recordedChanges.push(changeObj);
        });
    });
}

/**
 * Gets parent of target node
 * @param {Graph} graph Graph on which to operate
 * @param {String} target Node to check 
 * @returns Parent nodes
 */
function getParent(graph, target) {
  isTree(graph);

  if ( ! graph.nodes.has(target) ) {
    throw new Error(
      "Cannot get parent of node " +
        target +
        " because no node with this id exists in the graph"
    );
  }

  // Gets incoming nodes using GraphInterface implementation
  const incoming = GraphInterface.getIncomingNodes(graph, target);

  // For trees, there should be 0 or 1 incoming edge.
  if ( incoming.length === 0 ) {
    return undefined; // target is root
  }
  if ( incoming.length > 1 ) {
    throw new Error(
      "Node " + target + " has multiple parents: " + incoming.join(", ")
    );
  }
  return incoming[0];
}


/**
 * Gets children of target node
 * @param {Graph} graph Graph on which to operate
 * @param {String} target Node to check 
 * @returns Array of children nodes
 */
function getChildren(graph, source) {
  isTree(graph);

  return GraphInterface.getOutgoingNodes(graph, source);
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

  for ( const nodeId of graph.nodes.keys() ) {
    if ( getParent(graph, nodeId) === undefined ) {
      roots.push(nodeId);
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

  // Return the (single) node with no parent
  for ( const nodeId of graph.nodes.keys() ) {
    if ( getParent(graph, nodeId) === undefined ) {
      return nodeId;
    }
  }

  return undefined;
}

/**
 * Sorts the nodes of a tree by weight in ascending order.
 * MAY NEED TO BE MODIFIED TO USE A DRAFT/IMMER ARCHETYPE
 * @param {Graph} graph Graph to sort
 */
// function sortByWeight(graph) {
//   isTree(graph);

//   // Turns the nodes map into an array, sorts it, then turns it back into a map
//   graph.nodes = new Map(
//     [...graph.nodes.entries()].sort((a, b) => a[1].attributes.get("weight") - b[1].attributes.get("weight")
//   ));
// }

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
  if ( getChildren(graph, nodeId).length === 0 ) {
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
  if ( ! graph.nodes.has(nodeId) ) {
    throw new Error(
      "Cannot get left child of node " +
        nodeId +
        " because no node with this id exists in the graph"
    );
  }

  // Gets children and checks if a left child exists
  let children = getChildren(graph, nodeId);
  if ( children.length === 0 ) {
    return undefined;
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
    return undefined;
  }

  return children[1];
}

/**
 * adds a node with the given id and attributes as either a left child or a right child
 * this is called in a context where the parent node is already known and the edges are added outside this function
 * see @addLeft and @addRight for usage
 * the primary purpose is to ensure that a left child is added to the front of the nodes map and a right child is added to the end
 * so that the nodes will be displayed in the correct order
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {string} nodeId Id of the node to add, or undefined to generate a new id
 * @param {Object} attributes Attributes to set on the node
 * @param {boolean} leftChild If true, identifies the node as a left child, otherwise as a right child
 * @returns [newGraph, newChangeManager, nodeId] The mutated graph, change manager, and the id of the new node
 */

function setChild(graph, changeManager, parentId, childId, isLeft) {
  console.log(`-> setChild: parent ${parentId}, child ${childId}, isLeft ${isLeft}`);
  const currentNodeList = graph.nodeList;
  let changeObjects = [];
  const newGraph = produce(graph, (draft) => {
    // create edge from parent to child
    let edge = new Edge(parentId, childId);
    // Add the edge to both the source and target's adjacency lists
    draft.nodes.get(parentId).edges.set(`${parentId},${childId}`, edge);
    draft.nodes.get(childId).edges.set(`${parentId},${childId}`, edge);
    // record the change
    changeObjects.push(
      new ChangeObject("addEdge", null, {
        source: parentId,
        target: childId,
        attributes: {}
      })
    );

    // remove childId from nodeList
    draft.nodeList.splice(draft.nodeList.indexOf(childId), 1);  

    // if it's a left child, put it at the front of the node list
    if ( isLeft ) {
      draft.nodeList.unshift(childId);
    }
    // otherwise (right child) put it at the end of the node list
    else {
      draft.nodeList.push(childId);
    }
  });
  
  // Let the change manager know that the node list has changed
  changeObjects.push(new ChangeObject("changeNodeList", currentNodeList, newGraph.nodeList));
  const newChangeManager = recordChange(changeManager, changeObjects);
  
  console.log("<- setChild, chidren:", getChildren(newGraph, parentId), "nodeList:", newGraph.nodeList);
  // Return mutated graph and change manager to trigger re-render
  // Add the node id as the third return value
  return [newGraph, newChangeManager];
}

/**
 * Sets the left child of the node
 * @param {Graph} graph Graph on which to operate
 * @param {string} nodeId Node to check
 * @param {string} leftChildId Left child node to set
 * Assumes that the edge from nodeId to leftChildId is not already present
 * and that both the nodeId and leftChildId exist in the graph
 * @todo Add ChangeManager functionality -- see addBinaryNode for reference
 */
function setLeft(graph, changeManager, parentId, leftChildId) {
  isTree(graph);

  // Throw an error if the node doesn't exist
  if ( ! graph.nodes.has(parentId) ) {
    throw new Error(
      "Cannot set left child of node " +
        parentId +
        " because no node with this id exists in the graph"
    );
  }

  // Throw an error if the left child doesn't exist
  if ( ! graph.nodes.has(leftChildId) ) {
    throw new Error(
      "Cannot set " + leftChildId +
        " as left child because no node with this id exists in the graph"
    );
  }
  [graph, changeManager] = setChild(graph, changeManager, parentId, leftChildId, true);

  return [graph, changeManager];
}

/**
 * Sets the right child of the node
 * @param {Graph} graph Graph on which to operate
 * @param {string} nodeId Node to check
 * @param {string} rightChildId Right child node to set
 * Assumes that the edge from nodeId to rightChildId is not already present
 * and that both the nodeId and rightChildId exist in the graph
 * @todo Add ChangeManager functionality -- see addBinaryNode for reference
 */
function setRight(graph, changeManager,parentId, rightChildId) {
  isTree(graph);

  // Throw an error if the node doesn't exist
  if ( ! graph.nodes.has(parentId) ) {
    throw new Error(
      "Cannot set right child of node " +
        parentId +
        " because no node with this id exists in the graph"
    );
  }

  // Throw an error if the right child doesn't exist
  if ( ! graph.nodes.has(rightChildId) ) {
    throw new Error(
      "Cannot set " + rightChildId +
        " as right childbecause no node with this id exists in the graph"
    );
  }

  [graph, changeManager] = setChild(graph, changeManager, parentId, rightChildId, false);

  return [graph, changeManager];
}

/**
 * adds a node with the given id and attributes as either a left child or a right child
 * this is called in a context where the parent node is already known and the edges are added outside this function
 * see @addLeft and @addRight for usage
 * the primary purpose is to ensure that a left child is added to the front of the nodes map and a right child is added to the end
 * so that the nodes will be displayed in the correct order
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {string} nodeId Id of the node to add, or undefined to generate a new id
 * @param {Object} attributes Attributes to set on the node
 * @param {boolean} leftChild If true, identifies the node as a left child, otherwise as a right child
 * @returns [newGraph, newChangeManager, nodeId] The mutated graph, change manager, and the id of the new node
 */
function addBinaryNode(graph, changeManager, nodeId, attributes, leftChild) {
  isTree(graph);

    // If the nodeId argument is passed, use that, otherwise generate an id
    nodeId = nodeId || generateId(graph.nodes);
  
    const newGraph = produce(graph, (draft) => {
      // Create the node
      let node = new Node(nodeId, undefined, undefined);

      // if it's a left child, add it to the front of the nodes map
      if ( leftChild ) {
        draft.nodes = new Map([[nodeId, node], ...draft.nodes.entries()]);
      }
      // otherwise (right child) simply add it: it will appear at the rear
      else {
        draft.nodes.set(nodeId, node);
      }
      // Set the attributes
      for (let name in attributes) {
        node.attributes.set(name, attributes[name]);
      }
    });
  
    // Add the change object to the changeManager
    const newChangeManager = recordChange(changeManager, [
      new ChangeObject("addNode", null, {
        id: nodeId,
        position: {
          x: undefined,
          y: undefined,
        },
        attributes: attributes
      })
    ]);
  
    // Return mutated graph and change manager to trigger re-render
    // Add the node id as the third return value
    return [newGraph, newChangeManager, nodeId];
}

/**
 * Creates left child
 * @param {Graph} graph Graph on which to operate
 * @param {Graph} {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {string} node Source node
 * @param {float} childWeight Weight of the child node
 */
function addLeft(graph, changeManager, node, childWeight) {
  isTree(graph);
  let leftChild, dummy;

  // Throw an error if the node doesn't exist
  if ( ! graph.nodes.has(node) ) {
    throw new Error(
      "Cannot create left child of node " +
        node +
        " because no node with this id exists in the graph"
    );
  }

  // Case 1: Node has no children
  if ( isLeaf(graph, node) ) {
    [graph, changeManager, leftChild] = addBinaryNode(graph, changeManager, undefined, undefined, true);
    [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, leftChild, "weight", childWeight);
    [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node, leftChild);

    [graph, changeManager, dummy] = addBinaryNode(graph, changeManager, undefined, undefined);
    [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, dummy, "dummy", true);
    [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node, dummy);

    return [graph, changeManager, leftChild];
  }
  // Case 2: Node has a dummy left child
  else {
    let children = getChildren(graph, node);

    if ( GraphInterface.getNodeAttribute(graph, children[0], "dummy") ) {
      [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, children[0], "dummy", false);
      [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, children[0], "weight", childWeight);

      return [graph, changeManager, children[0]]
    }
  }

  // Throws error if node already has a left child
  throw new Error(
    "Cannot create left child of node " +
      node +
      " because left child already exists"
  );
}

/**
 * Creates right child
 * @param {Graph} graph Graph on which to operate
 * @param {Graph} {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {string} node Source node
 * @param {float} childWeight Weight of the child node
 */
function addRight(graph, changeManager, node, childWeight) {
  isTree(graph);
  let rightChild, dummy;

  // Throw an error if the node doesn't exist
  if ( ! graph.nodes.has(node) ) {
    throw new Error(
      "Cannot create right child of node " +
        node +
        " because no node with this id exists in the graph"
    );
  }

  // Case 1: Node has no children
  if ( isLeaf(graph, node) ) {
    [graph, changeManager, dummy] = addBinaryNode(graph, changeManager, undefined, undefined);
    [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, dummy, "dummy", true);
    [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node, dummy);

    [graph, changeManager, rightChild] = addBinaryNode(graph, changeManager, undefined, undefined, false);
    [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, rightChild, "weight", childWeight);
    [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node, rightChild);

    return [graph, changeManager, rightChild];
  }
  // Case 2: Node has a dummy right child
  else {
    let children = getChildren(graph, node);

    if ( GraphInterface.getNodeAttribute(graph, children[1], "dummy") ) {
      [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, children[1], "dummy", false);
      [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, children[1], "weight", childWeight);

      return [graph, changeManager, children[1]]
    }
  }

  // Throws error if node already has a right child
  throw new Error(
    "Cannot create right child of node " +
      node +
      " because right child already exists"
  );
}

/** Export an object containing the interface */
const TreeInterface = {
  getParent,
  getChildren,
  getRoots,
  getRoot,
  isLeaf,
  getLeft,
  getRight,
  setLeft,
  setRight,
  addLeft,
  addRight
};
export default TreeInterface; 
