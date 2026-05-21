/**
* Allows the user to create a binary search tree using a series of prompts.
* They will be prompted to enter a number -->
*    - If the number is positive, it is added to the tree
*    - If the number is negative, it is deleted from the tree
*    - If the number is 0, the algorithm stops
* Note that duplicate numbers are not allowed in this BST, although it would be
* relatively easy to modify the code to allow duplicates.
*
* Unlike many textbook descriptions, this animation uses dummy nodes only to ensure correct display.
* A node has at most one dummy child. Thus, there are these cases for non-dummy nodes:
* - node is a leaf; it has no children, *not* two dummy children as in the textbooks
* - node has one real child and one dummy child
* - node has two real children
*/

/**
 * Gets rid of all markings and highlights in the tree, so that the next operation
 * can start fresh
 */
function cleanTree(){
  step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearEdgeHighlights();
    clearEdgeColors();
  });
}

/**
 * Used to highlight the path taken to find a node
 * @param nodeId the node to accent
 */
function accentNode(nodeId) {
  step(() => {
    mark(nodeId)
    if ( getParent(nodeId) !== null && getParent(nodeId) !== undefined ) {
       unmark(getParent(nodeId));
    }
  });
}

/**
 * @returns the sibling of the given node
 * @param node the node whose sibling we are finding
 * @assume the node has a parent
 * 
 * @todo add this to Thread.js and TreeInterface.js
 */
function getSibling(node) {
  if ( node === null || node === undefined ) {
    throw new Error(`getSibling called on nonexistent node`);  }
  const parent = getParent(node);
  if ( parent === null || parent === undefined ) {
    throw new Error(`getSibling called on node with ${node}, weight ${weight(node)}, no parent`);
  }

  // If the left child of the parent is the node, return the right child 
  // of the parent which would be the sibling of node
  // else return the left child which would be node's sibling
  return getLeft(parent) === node ? getRight(parent) : getLeft(parent);
}

/**
 * checks if a node is a dummy node
 * need to check that the node exists first, since this may be called
 * for a left or right child that does not exist
 * @param nodeId (id of) the node to check
 */
function isDummy(nodeId) {
  if ( nodeId === null || nodeId === undefined ) return false;
  return getAttribute(nodeId, "dummy");
}

/**
 * adds a node with weight w and puts the weight inside the node
 * used when adding the root node
 */
function addNodeInsideWeight(w) {
  // need newNode in outer scope, otherwise undefined is returned
  let newNode;
  console.log(`-> addNodeInsideWeight(${w})`)
  step(() => {
    display(`Adding node with weight ${w}`);
    newNode = addNode();
    setWeight(newNode, w);
    setAttribute(newNode, "weightInNode", true);
    hideWeight(newNode);
  });
  console.log("<- addnodeInsideWeight, new node =", newNode)
  return newNode;
}

/**
 * @returns the in-order predecessor of a given node, i.e.,
 * the node with maximum weight in the left subtree
 * @param currentNode the node whose in-order predecessor we are finding
 */
function findInOrderPredecessor(currentNode){
  // While there is a real right child, go right
  if ( getRight(currentNode) && ! getAttribute(getRight(currentNode), "dummy") ) {
    // If a real right child exists, recur
    return findInOrderPredecessor(getRight(currentNode));
  }

  // If I have no real right child, I am the predecessor
  display(`Found predecessor at ${weight(currentNode)}`)
  return currentNode
}

// this is sort of superfluous but makes the code more readable
function dummify(nodeId) {
  setAttribute(nodeId, "dummy", true);
}

/**
 * replaces a dummy node with a real node with given weight
 * @param nodeId (id of) the dummy node to replace
 * @param weight the weight of the new node
 */
function undummify(nodeId, weight) {
  step(() => {
    setAttribute(nodeId, "dummy", false);
    setWeight(nodeId, weight);
    setAttribute(nodeId, "weightInNode", true);
    hideWeight(nodeId);
    display(`Successfully added node ${weight}`)
  });
  return nodeId;
}

/**
 * @returns a new (newly created)dummy node
 */
function createDummy(){
  const dummy = addNode()
  setAttribute(dummy, "dummy", true);
  return dummy;
}

//-----------------ADD/DELETE-------------------

/**
 * Adds a node with weight k to the BST rooted at x
 * @param x a subroot of BST, initially the root of the BST
 * @param k the weight of the node to add
 */
function addNodeBST(x, k) {
  const theWeight = (x === null || x === undefined) ? null : weight(x);
  console.log(`*** -> addNodeBST x = ${x}, weight(x) =  ${theWeight}, dummy? ${isDummy(x)}, k = ${k}`);
  // If empty, make new root
  if ( x === null || x === undefined ) {
    addNodeInsideWeight(k);
    display(`Created root ${k}`);
    return;
  }

  // Found duplicate node
  if ( k === weight(x) ) {
    display(`Node with key ${k} already exists`);
    return;
  }

  // If a leaf, then add new node and a dummy here
  if ( isLeaf(x) ) {    
    step(()=>{
      const newNode = addNodeInsideWeight(k);
      const dummy = createDummy();
      console.log("x is a leaf, new node is ", newNode, " dummy is ", dummy)
      addEdge(x, newNode);
      addEdge(x, dummy)
      if ( k < weight(x) ) {
        setChildren(x, [newNode, dummy])
      } else {
        setChildren(x, [dummy, newNode])
      } 
      display(`Successfully added node ${k}`)
    });
    return;
  }

  // Not a leaf, keep searching
  accentNode(x);
  console.log(`Not a leaf, key ${k} at subroot with key ${weight(x)}`);
  if ( k < weight(x) ) {
    const L = getLeft(x);
    console.log("Going left, L key:", L ? weight(L) : "null");
    if ( L && isDummy(L) ) { //end, replace dummy
      deleteNode(L);
      const newnode = addNodeInsideWeight(k);
      addEdge(x, newnode);
      setChildren(x, [newnode, getRight(x)])      
      return newnode;
    } else {
      return addNodeBST(L, k);  //not end, recur
    }
  } else if ( k > weight(x) ) {
    const R = getRight(x);
    console.log("Going right, R key:", R ? weight(R) : "null");
    if ( R && isDummy(R) ) { //end, replace dummy
      deleteNode(R);
      const newnode = addNodeInsideWeight(k);
      addEdge(x, newnode);
      setChildren(x, [getLeft(x), newnode])      
      return newnode;
    } else {
      return addNodeBST(R, k);  //not end, recur
    }
  }
  // Should never reach here
  display("Error: BSTadd did not recur or add a node.");
}

/**
 * @returns true if the given node has two real (non-dummy) children
 * @param nodeId (id of) the node to check 
 */
function hasTwoRealChildren(nodeId) {
  if ( isLeaf(nodeId) ) return false;
  const leftChild = getLeft(nodeId);
  const rightChild = getRight(nodeId);
  return leftChild && ! isDummy(leftChild) && rightChild && ! isDummy(rightChild);
}

function isRightChild(nodeId) {
  const parent = getParent(nodeId);
  if ( parent === null || parent === undefined ) {
    throw new Error(`isRightChild called on node with ${nodeId}, weight ${weight(nodeId)}, no parent`);
  }
  return getRight(parent) === nodeId;
}

/**
 * handles deletion of a terminal node (a leaf or a node with one child)
 * @param x the node to delete
 */
function terminalNodeDeletion(x) {
  const parent = getParent(x);
  if ( isLeaf(x) ) {
    if ( parent === null || parent === undefined ) {
      // Deleting the root node which is the only node in the tree
      deleteNode(x);
      display(`The tree is now empty`);
      return;
    }
    // not the root, so has a parent
    const sibling = getSibling(x);
    console.log(`Deleting leaf node with weight ${weight(x)}`);
    console.log(`Its sibling has weight ${weight(sibling)}`);
    console.log(`Deleted edge from parent with weight ${weight(parent)} to node with weight ${weight(x)}`);
    if ( isDummy(sibling) ) {
      // delete x and its sibling dummy
      deleteNode(x);
      deleteNode(sibling);
      return;
    }
    // sibling is real, so dummify x
    // first delete edge from parent to sibling
    // now set sibling as child of parent in place of x
    // and put a dummy node on the other side
    dummify(x);
    return
  }
  // at this point, x is not a leaf and has one real child and one dummy child
  const leftDummy = isDummy(getLeft(x));
  const theRealChild = leftDummy ? getRight(x) : getLeft(x);
  const theDummyChild = leftDummy ? getLeft(x) : getRight(x);
  console.log(`The real child has weight ${weight(theRealChild)}`);
  // now delete x from the tree and replace if with theRealChild
  console.log(`Deleting node with weight ${weight(x)} and replacing with child with weight ${weight(theRealChild)}`);
  // first delete the dummy child to keep it from dangling
  deleteNode(theDummyChild);
  // then replace x with the real child
  if ( parent === null || parent === undefined ) {
    // if x is the root, there is no parent,
    //  so no need to delete edge nor figure out if x is left or right child
    // simply delete it and the real child becomes the new root automatically
    console.log(`Deleted root node, new root has weight ${weight(theRealChild)}`);
    deleteNode(x);
    return;
  }
  // x is not the root, so create edge from parent to theRealChild
  // making sure that theRealChild is in the correct position
  // then delete x
  const xIsRightChild = isRightChild(x);
  const sibling = getSibling(x);
  deleteNode(x);
  addEdge(parent, theRealChild);
  console.log(`Deleted edge from parent with weight ${weight(parent)} to x)}`);
  // at this point the parent has edges to the sibling and the real child
  // it remains to determine their order
  if ( xIsRightChild ) {
    setChildren(parent, [sibling, theRealChild]);
  } else {
    setChildren(parent, [theRealChild, sibling]);
  }
  return;
}

/**
 * Deletes a node with weight k from the BST rooted at x
 * @param x a subroot of BST, initially the root of the BST
 * @param k the weight of the node to delete
 */
function deleteNodeBST(x, k) {
  console.log(`-> deleteNodeBST called with k=${k} at node ${ x ? weight(x) : "null" }`);
  // Couldn't find node we are trying to delete, error
  if ( x === undefined || getAttribute(x, "dummy") || ( isLeaf(x) && k != weight(x) ) ){
    display(`Could not find node ${k} to delete`);
    return;
  }

  //Not a leaf, and weight(x) not k, keep searching
  accentNode(x);
  if ( k < weight(x) ) {
    return deleteNodeBST(getLeft(x), k);    
  } else if ( k > weight(x) ) {
    return deleteNodeBST(getRight(x), k);
  }

  if ( ! hasTwoRealChildren(x) ) {
    terminalNodeDeletion(x);
    display(`Successully deleted: ${k}`);
    return;
  }

  // Has two real children, need to replace x with in-order predecessor

  // Find in-order predecessor
  let predecessor = findInOrderPredecessor(getLeft(x));

  // Replace deleted node weight with in-order predecessor weight
  let predWeight = weight(predecessor);
  setWeight(x, predWeight);
  // Now delete the predecessor node, which has at most one child
  terminalNodeDeletion(predecessor);
  display(`Successully deleted: '${k}' by replacing with predecessor '${predWeight}'`);
  return
}

/**
 * Main loop for adding/deleting nodes in a BST
 */
setDirected(true);
let running = true;
while ( running ) {
  cleanTree();
  const weight = promptNumber("What is the weight and operation (weight is a number, +/- for add/delete, ex. -5 or +3) (0 to stop)")

  if (weight > 0){
    addNodeBST(getRoot(), weight);
  } else if (weight < 0){
    deleteNodeBST(getRoot(), -weight);  
  } else {    
    running = false; 
  }
}

display("The tree is done; the algorithm is finished");
