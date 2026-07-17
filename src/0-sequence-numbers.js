/**
 * This file explains the current strategy for maintaing left to right order of nodes in an elkjs layout.
 * The philosopy behind this approach is that each node is given a sequence number.
 * When the set of nodes is traversed for display, the list of nodes is sorted by sequence number.
 * Some invariants:
 * - no two nodes have the same sequence number
 * - the sequence number of a node stays the same unless changed by setChildren, described below
 *   + in the future, it may also make sense to use sequence numbers to reorder adjacency lists
 * - when a node is added it is given the next available sequence number
 * - when a node is deleted its sequence number is *not* reused
 *   + this is also tree of node id's
 * Instead of restricting operations to binary trees, we use setChildren to change the order of children of a node.
 * setChildren works as follows
 * - let [n'_1, ... , n'_k] be the desired order of children
 * - collect the sequence numbers of the children as a list of pairs P = [(node_1, seq#_1) , ... , (node_k, seq#_k)]
 * - create a new list C = [(n'_1, seq#_1) , ... , (n'_k, seq#_k)]
 * - create a change record with a list of changes
 *    using each element of P and C as previous and current, respectively
 * - reassign sequence numbers using C
 */

/**
 * Add a new field called sequenceNumber to a node
 */

/**
 * addNode gives a new node a sequence number; a function to generate a new sequence is used, similar to generateId().
 * When addNode is undone and redone, it keeps the sequence number.
 * Sequence numbers are not reused.
 * Consider a new method for assigning id's to new nodes; maybe require user to provide one.
 */

/**
 * In CytoscapeInterface, turn nodes, the node map, into a list of pairs of the form
 *  [[id_1, node_1] , ... , [id_n, node_n]]
 * and sort the pairs by node_k.sequenceNumber
 *
 * Then you can do
  nodeList.forEach(idNodePair => {
    const node = idNodePair[1];
    // ...
  })
  return elements
*/

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
