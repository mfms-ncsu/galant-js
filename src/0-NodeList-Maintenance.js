/**
 * Should create a new branch for making these changes, since they're pretty radical!
 * call it `sequencing`
 * 
 * This file gives an alternate strategy that uses sequence numbers instead of a node list to avoid dependence on list indexes
 * The philosopy behind this approach is that each node is given a sequence number.
 * When the set of nodes is traversed for display, the list of nodes is sorted by sequence number.
 * Some invariants:
 * - no two nodes have the same sequence number
 * - the sequence number of a node stays the same unless changed by setChildren, described below
 *   + in the future, it may also make sense to use sequence numbers to reorder adjacency lists
 * - when a node is added it is given the next available sequence number
 * - when a node is deleted its sequence number is *not* reused
 * Instead of restricting operations to binary trees, we use setChildren to change the order of children of a node.
 * setChildren works as follows
 * - let [n'_1, ... , n'_k] be the desired order of children
 * - collect the sequence numbers of the children as a list of pairs P = [(node_1, seq#_1) , ... , (node_k, seq#_k)]
 * - create a new list C = [(n'_1, seq#_1) , ... , (n'_k, seq#_k)]
 * - create a change record using P and C as previous and current, respectively
 * - reassign sequence numbers using C
 */

/** !!! Need to fix everything below here !!! */

/**
 * !!! Here are the changes to relevant part of the code with the parts to modify bracketed
 * by comments that begin with !!!
 */

/**
 * Add a new field called sequenceNumber to a node
 */

/**
 * Need to modify addNode to give a new node a sequence number; a function to generate a new sequence number will be necessary, similar to generateId().
 * When addNode is undone and redone, it keeps the sequence number.
 * Sequence numbers are not reused.
 * Consider a new method for assigning id's to new nodes; maybe require user to provide one.
 */

/**
 * Get rid of nodeList.
 * In CytoscapeInterface, turn nodes, the node map, into a list of pairs of the form
 *  [[id_1, node_1] , ... , [id_n, node_n]]
 * as follows
 */
 const nodeList = Object.entries(nodes).sort((a, b) => a[1].sequenceNumber - b[1].sequenceNumber);
 /* Then ...
 */
  nodeList.forEach(idNodePair => {
    const node = idNodePair[1];
    // ...
  })
  return elements

/**
 * Example of recording change
 */
  const newChangeManager = recordChange(changeManager, [
    new ChangeObject(
      "setEdgeAttribute",
      {
        source: source,
        target: target,
        attribute: {
          name: name,
          value: graph.nodes
            .get(source)
            .edges.get(`${source},${target}`)
            .attributes.get(name),
        },
      },
      {
        source: source,
        target: target,
        attribute: {
          name: name,
          value: value,
        },
      }
    ),
  ]);


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
    let edgeIds = [... graph.nodes.get(nodeId).edges.keys()] ;
    return edgeIds.filter(edgeId => edgeExists(edgeId));
  }
  // !!!
}

// !!! use the filter construct in all that follows !!!

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

