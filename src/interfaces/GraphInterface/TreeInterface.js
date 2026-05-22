import Tree from "states/Graph/Tree";
import GraphInterface from "./GraphInterface";
import produce from "immer";
import ChangeManager from "states/ChangeManager/ChangeManager";
import ChangeObject from "states/ChangeManager/ChangeObject";
import Node from "states/Graph/GraphElement/Node";
import Edge from "states/Graph/GraphElement/Edge";
// import { is } from "immer/dist/internal.js";

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
      `Cannot get parent of node ${target} because no node with this id exists in the graph`
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
      `Node ${target} (weight ${GraphInterface.getNodeAttribute(graph, target, "weight")}) has multiple parents: ${incoming.join(", ")}`
    );
  }
  return incoming[0];
}


/**
 * Gets children of target node
 * @param {Graph} graph Graph on which to operate
 * @param {String} source Node whose children to return
 * @returns Array of children nodes
 */
function getChildren(graph, source) {
  isTree(graph);
  if ( ! graph.nodes.has(source) ) {
    throw new Error(
      `Cannot get children of node ${source} because no node with this id exists in the graph`
    );
  }
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
      `Cannot get left child of node ${nodeId}) because no node with this id exists in the graph`
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
 * (Re)orders the list of children of a node
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {string} parentID Id of the parent of the children to be reordered
 * @param {boolean} children A list of the children in the desired order
 * @returns [newGraph, newChangeManager] The mutated sequence number list and change manager.
 */

/** !!!
 * It should be much easier to create a new Map that maps node id's to sequence numbers.
 * So everything related to sequence numbers will be in GraphInterface
 * While we're at it, the function that creates the next id should create a completely new one
 * !!!
 */

function setChildren(graph, changeManager, parentId, children) {
  // Throw an error if the parent doesn't exist
  if ( ! graph.nodes.has(parentId) ) {
    throw new Error(
      `setChildren - no parent with id ${parentId} exists in the graph`
    );
  }

  // Throw an error if any child does not exist
  children.forEach( (childId) => {
    if ( ! graph.nodes.has(childId) ) {
      throw new Error(
        `setChildren - no child with id ${childId} exists in the graph, parent is ${parentId} (weight ${GraphInterface.getNodeAttribute(graph,parentId, "weight")})`
      )
    }
  })

  // Throw an error if any child does not have the right parent,
  // i.e., there is no edge from the parent to the child
  children.forEach( (childId) => {
    if ( GraphInterface.getEdge(graph, parentId, childId) === undefined ) {
      throw new Error(
        `setChildren - no edge from ${parentId} to ${childId} exists in the graph.`
      )
    }
  })

  console.log(`-> setChildren: parent ${parentId}, children ${children}`);

  // save the old sequence numbers in a map
  let oldSequenceNumbers = new Map()
  children.forEach((child) => {
    const childNode = graph.nodes.get(child)
    oldSequenceNumbers.set(childNode, childNode.sequenceNumber)
  })

  // create a list of pairs, where each pair is of the form [id, sequence#]
  // the sequencs #'s are monotonically increasing
  const sequenceNumberPairs = children.map((child) => [child, GraphInterface.generateSequenceNumber()])
  console.log("newPairs", sequenceNumberPairs)

  // change the sequence numbers of the affected nodes
  const newGraph = produce(graph, (draft) => {
    sequenceNumberPairs.forEach((pair) => {
      draft.nodes.get(pair[0]).sequenceNumber = pair[1]
    })
  });

  // create a change object for each changed sequence number
  // and collect these in a list as an object in the change manager
  let changes = []
  sequenceNumberPairs.forEach((pair) => {
    const nodeId = pair[0]
    const oldSequenceNumber = oldSequenceNumbers.get(pair[0])
    const newSequenceNumber = pair[1]
    console.log(`<+> seq#, id = ${nodeId} old = ${oldSequenceNumber}, new = ${newSequenceNumber}`)
    changes.push(new ChangeObject(
      "changeSequenceNumber",
      {
        id: nodeId,
        number: oldSequenceNumber
      },
      {
        id: nodeId,
        number: newSequenceNumber
      }
    ))
  })

  const newChangeManager = recordChange(changeManager, changes)
  console.log("<- setChildren, chidren:", getChildren(newGraph, parentId), "old:", oldSequenceNumbers, "new:", sequenceNumberPairs);

  // Return mutated graph and change manager to trigger re-render
  // Add the node id as the third return value
  return [newGraph, newChangeManager];
}

// /**
//  * Sets the left child of the node
//  * @param {Graph} graph Graph on which to operate
//  * @param {string} nodeId Node to check
//  * @param {string} leftChildId Left child node to set
//  * Assumes that the edge from nodeId to leftChildId is not already present
//  * and that both the nodeId and leftChildId exist in the graph
//  * @todo Add ChangeManager functionality -- see addBinaryNode for reference
//  */
// function makeLeftChild(graph, changeManager, parentId, leftChildId) {
//   isTree(graph);
//   [graph, changeManager] = setChild(graph, changeManager, parentId, leftChildId, true);
//   return [graph, changeManager];
// }

// /**
//  * Sets the right child of the node
//  * @param {Graph} graph Graph on which to operate
//  * @param {string} nodeId Node to check
//  * @param {string} rightChildId Right child node to set
//  * Assumes that the edge from nodeId to rightChildId is not already present
//  * and that both the nodeId and rightChildId exist in the graph
//  * @todo Add ChangeManager functionality -- see addBinaryNode for reference
//  */
// function makeRightChild(graph, changeManager,parentId, rightChildId) {
//   isTree(graph);
//   [graph, changeManager] = setChild(graph, changeManager, parentId, rightChildId, false);
//   return [graph, changeManager];
// }

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
 * 
 * @todo the nodeId and the attributes are never used - addLeft and addRight call this function with them undefined
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
  
    // Create a change object for the new node and the attributes defined above;
    // other attributes will be set in the calling function (e.g. addLeft or addRight)
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
  // Case 2: Node has a dummy left child: turn the dummy into the left child
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
  // makeLeftChild,
  // makeRightChild,
  addLeft,
  addRight,
  setChildren
};
export default TreeInterface; 
