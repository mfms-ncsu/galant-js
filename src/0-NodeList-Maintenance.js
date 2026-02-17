/**
 * This file gives an overview of one strategy for maintaining a node list so that indexes are unaffected by addNode and deleteNode
 * The philosopy behind this approach is that the nodeList is maintained by the graph,
 * along with an indexMap that maps ids to indexes in the list.
 * The nodes map is also maintained by the graph.
 * Some invariants:
 * - a node stays in the nodes map even if deleted; this ensures that each node has a unique id
 * - a the index of a node in the nodeList stays the same unless changed by setChildren, described below
 * - when a node is deleted, its position in the nodeList is set to null;
 *   this ensures that indexes of other nodes are unaffected
 */

/**
 * Here are the changes to relevant part of the code with the parts to modify bracketed
 * by comments that begin with !!!
 */

/**
 * Functions to be added 
 */

/**
 * in GraphInterface.js
 * @returns true iff the node exists in the graph, i.e., has not been deleted
 * all functions with a nodeId argument need to check that the node exists
 */
function nodeExists(nodeId) {
    return nodeList[indexMap.get(nodeId)] !== null;
}

/**
 * the following should replace getSource
 * all info about edge ids should be centralized
 * similar function for getTargetId()
 */

/**
 * Returns the id of the source of the given edge.
 * @param {Graph} graph Graph on which to operate
 * @param {Edge} edge Edge on which to operate
 * @return the id of the target of the given edge
 * @throws if the edge does not exist
 */
function getSource(graph, edgeId) {
  verifyGraph(graph);
  const nodeIds = edge.split(",");
  if ( nodesIds.length !== 2
     || ! graph.edgeExists(edgeId)
     || ! graph.nodes.get(nodes[0]).edges.has(edge) ) {
    throw new Error("Given edge is not valid: " + edge);
  }
  return nodes[0];
}

/**
 * also in GraphInterface.js
 * @returns true iff and only if the edge with the given source and target exists
 * needed whenever a list of incident edges or a list of all edges is traversed
 */
function edgeExists(edgeId) {
    return nodeExists(getSourceId(edgeId)) && nodeExists(getTargetId(edgeId));
}

/**
 * @returns the id of the given edge
 * there may be several opportunities where this is useful
 */
function getEdgeId(edge) {
  return `${edge.source},${edge.target}`;
}

/**
 * in TreeInterface.js
 * sets the order of children of a node so that they will be displayed in correct left to right order
 * assumes that all relevant nodes and edges exist
 * @param parent the parent of the nodes
 * @param children a list of children in the desired order
 * This function creates a change record in which both previous and current have
 * an index map giving the indexes of the children in the nodeList before and after
 * moving the children into the desired order.
 */
function setChildren(parent, children) {
    // create a map previousIndexes that maps each child to its current index

    // create a sorted list of the current indexes of the children

    // put each child in turn into the nodeList at the next index in the list
    // and update its entry in the (global) indexMap

    // create a map of newIndexes from the current indexMap

    // create a change record as described above 
}

/**
 * bst.js
 */

// get rid of addLeftInsideWeight and addRightInsideWeight
// eventually the "inside weight" functions should be replaced with
// a graph attribute set at the beginning of algorithm execution via a declaration, e.g.,
//   insideWeights()
// which sets all existing nodes to have weights inside and sets the graph attribute

  // in addNodeBST(x, k)
  // If a leaf, then add new node and a dummy here
  if ( isLeaf(x) ) {
    step(()=>{
        // !!!
        const dummy = createDummy();
        const newNode = addNode();
        setWeight(newNode, k);
        setAttribute(newNode, "weightInNode", true);
        hideWeight(newNode);
        addEdge(x, dummy);
        addEdge(x, newNode);
        if ( k < weight(x) ) {
            setChildren(x, [newNode, dummy])
        } else {
            setChildren(x, [dummy, newNode])
        }
        display(`Successfully added node ${k}`)
        // !!!
    });
  }

  // in terminalNodeDeletion(x)
  // x is not the root, so create edge from parent to theRealChild
  // making sure that theRealChild is in the correct position
  // then delete x
  const xIsRightChild = isRightChild(x);
  deleteNode(x);
  console.log(`Deleted edge from parent with weight ${weight(parent)} to x)}`);
  // !!!
  addEdge(parent, theRealChild)
  if ( xIsRightChild ) {
    setChildren(parent, [getLeft(parent), theRealChild]);
  } else {
    setChildren(parent, [theRealChild, getRight(parent)]);
  }
  // !!!

  /**
   * in GraphInterface.js
   */

  function changeNodeList(nodeList, newIndexMap) {
    const indexArray = [... newIndexMap.keys()];
    indexArray.forEach((key) => {nodeList[newIndexMap.get(key)] = key;})
  }

// !!! replace all occurrences of graph.nodes.has(x) with nodeExists(x)

function getIncidentEdges(graph, nodeId) {
  verifyGraph(graph);
  // !!!
  if ( nodeExists(nodeId) ) {
    let incidentEdges = [];
    const edgeIds = [...graph.nodes.get(nodeId).edges.keys()];
    edgeIds.forEach((edgeId) => {
      if ( edgeExists(edgeId) ) {
        incidentEdges.push(edgeId);
      }
    })
    return incidentEdges;
  }
  // !!!
}

function getIncomingEdges(graph, target) { 
  // ...

  const incidentEdges = [];

  // !!!
  graph.nodes.get(target).edges.forEach((edge, edgeId) => {
    // Only push if the given node is the target
    if ( edgeExists(edgeId) && edge.target === target ) {
      incidentEdges.push(key);
    }
  });
  // !!!
  // and similar for outgoing edges
}

// getNodes and related functions should return id's, not node objects
// the algorithms assume this so its not clear how it works since getNodes returns values
// (might be the same as keys)

// Also, some algorithms don't take advantage of the getNumberOf... functions

function getNodes(graph) {
  verifyGraph(graph);
  let nodeList = [];
  nodeIds = [...graph.nodes.keys()];
  nodeIds.forEach((nodeId) => {
    if ( nodeExists(nodeId) ) {
      nodeList.push(nodeId);
    }
  })
}

// and similar for all functions that rely on existence of nodes and edges

// an exception is getScalar: nonexistent nodes still need a placeholder in the display
// this won't affect trees since scalar is not relevant in elkjs layout

/**
 * Made it as far as setters - should be more challenging from here on
 */

