import GraphInterface from "./GraphInterface";
import produce from "immer";
import ChangeObject from "states/ChangeManager/ChangeObject";

/**
 * Helper function to handle what to do when a graph
 * is not a tree.
 * @param {Graph} graph Graph on which to operate
 */
function isTree(graph) {
  if ( ! (graph.type === "tree") ) {
    throw new Error("Function can only be performed on trees.");
  }
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
 * @returns Array of children nodes sorted by sequence number
 */
function getChildren(graph, source) {
  isTree(graph);
  if ( ! graph.nodes.has(source) ) {
    throw new Error(
      `Cannot get children of node ${source} because no node with this id exists in the graph`
    );
  }
  console.log(`-> getChildren, source = ${source}`)
  let children = GraphInterface.getOutgoingNodes(graph, source)
  children = children.sort((a, b) => graph.nodes.get(a).sequenceNumber - graph.nodes.get(b).sequenceNumber)
  console.log("<- getChildren, children =", children)
  return children;
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
  if ( ! graph.nodes.has(nodeId) ) {
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
  if ( ! graph.nodes.has(nodeId) ) {
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
 * @param {boolean} children A list of the children in the desired order;
 *                           the list need not include all children
 *                           - those not included will appear before the ones that are
 * @returns [newGraph, newChangeManager] The mutated sequence number list and change manager.
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
    oldSequenceNumbers.set(child, childNode.sequenceNumber)
  })

  // create a list of pairs, where each pair is of the form [id, sequence#]
  // the sequencs #'s are monotonically increasing
  const sequenceNumberPairs = children.map((child) => [child, GraphInterface.generateSequenceNumber()])
  console.log("newPairs", sequenceNumberPairs)
  console.log("oldSequenceNumbers before", oldSequenceNumbers)

  // change the sequence numbers of the affected nodes
  const newGraph = produce(graph, (draft) => {
    sequenceNumberPairs.forEach((pair) => {
      draft.nodes.get(pair[0]).sequenceNumber = pair[1]
    })
  });

  console.log("oldSequenceNumbers after", oldSequenceNumbers)
  // create a change object for each changed sequence number
  // and collect these in a list as an object in the change manager
  let changes = []
  sequenceNumberPairs.forEach((pair) => {
    console.log("oldSequenceNumbers in loop", oldSequenceNumbers)
    const nodeId = pair[0]
    console.log(`pair[0] = ${pair[0]}`)
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

/** Export an object containing the interface */
const TreeInterface = {
  getParent,
  getChildren,
  getRoots,
  getRoot,
  isLeaf,
  getLeft,
  getRight,
  setChildren
};
export default TreeInterface; 
