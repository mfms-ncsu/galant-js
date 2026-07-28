/**
Allows the user to create a binary search tree using a series of prompts.
They will be prompted to enter a number -->
   - If the number is positive, it is added to the tree
   - If the number is negative, it is deleted from the tree
   - If the number is 0, the algorithm stops
Note that duplicate numbers are not allowed in this BST, although it would be
relatively easy to modify the code to allow duplicates.

Unlike many textbook descriptions, this animation uses dummy nodes only to ensure correct display.
A node has at most one dummy child. Thus, there are these cases for non-dummy nodes:
  - node is a leaf; it has no children, *not* two dummy children as in the textbooks
  - node has one real child and one dummy child
  - node has two real children
Start with empty.tree or bs-example.tree (for testing deletion)
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
  color(nodeId, "orange")
}

function unaccent(nodeId) {
  uncolor(nodeId)
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
  return getLeft(parent) === node ? getRight(parent) : getLeft(parent);
}

/**
 * checks if a node is a dummy node
 * need to check that the node exists first, since this may be called
 * for a left or right child that does not exist
 * @param nodeId (id of) the node to check
 */
function isDummy(nodeId) {
  if ( nodeId === null || nodeId === undefined ) {
    return false;
  }
  return getAttribute(nodeId, "dummy");
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
    display(`Added node with weight ${weight}`)
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

//------------------ ADD -------------------

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
    step(() => {
      const newNode = addNode();
      setWeight(newNode, k);
      display(`Created root with weight ${k}`);
    })
    return;
  }

  accentNode(x)

  // Found duplicate node
  if ( k === weight(x) ) {
    display(`Node with key ${k} already exists`);
    return;
  }

  // If a leaf, then add new node and a dummy here
  if ( isLeaf(x) ) {
    if ( isDummy(x) ) {
      undummify(x, k)
      unaccent(x)
      return x
    } 
    step(() => {
      const newNode = addNode();
      setWeight(newNode, k);
      const dummy = createDummy();
      addEdge(x, newNode);
      addEdge(x, dummy)
      if ( k < weight(x) ) {
        setChildren(x, [newNode, dummy])
      } else {
        setChildren(x, [dummy, newNode])
      } 
      display(`Added node with weight ${k}`)
    });
    unaccent(x)
    return;
  }

  // Not a leaf, keep searching
  console.log(`Not a leaf, key ${k} at subroot with key ${weight(x)}`);
  if ( k < weight(x) ) {
    unaccent(x)
    return addNodeBST(getLeft(x), k);
  } else {
    unaccent(x)
    return addNodeBST(getRight(x), k);
  }
}

// ------------- END ADD ------------

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
    throw new Error(`** Error: isRightChild called on node with no parent; id = ${nodeId}, weight = ${weight(nodeId)}`);
  }
  return getRight(parent) === nodeId;
}

// ========= DELETE ===============

/**
 * @returns the in-order predecessor of a given node, i.e.,
 * the node with maximum weight in the left subtree
 * @param currentNode the node whose in-order predecessor we are finding
 */
function findInOrderPredecessor(currentNode) {
  accentNode(currentNode)
  // While there is a real right child, go right
  if ( getRight(currentNode) && ! getAttribute(getRight(currentNode), "dummy") ) {
    // If a real right child exists, recur
    unaccent(currentNode)
    currentNode = findInOrderPredecessor(getRight(currentNode));
  }

  // If I have no real right child, I am the predecessor
  display(`Found predecessor at node with weight ${weight(currentNode)}`)
  return currentNode
}

/**
 * handles deletion of a terminal node (a leaf or a node with one child)
 * @param x the node to delete
 * @param isPredecessor true if x is an in-order predecessor,
 *         used only to get a meaningful message
 */
function terminalNodeDeletion(x, isPredecessor) {
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
    if ( isDummy(sibling) ) {
      // delete x and its sibling dummy
      const weightX = weight(x)
      step(() => {
        if ( isPredecessor ) {
          display("Deleting predecessor node and its dummy sibling")
        } else {
          display(`Deleting node with weight ${weight(x)} and its dummy sibling`)
        }
        deleteNode(x);
        deleteNode(sibling);
        unaccent(parent)
      })
      return;
    }
    // sibling is real, so dummify x
    // first delete edge from parent to sibling
    // now set sibling as child of parent in place of x
    // and put a dummy node on the other side
    step(() => {
      if ( isPredecessor ) {
        display("Deleting predecessor node, turning it into a dummy")
      } else {
        display(`Deleting node with weight ${weight(x)}, turning it into a dummy`)
      }
      dummify(x);
    })
    return
  }
  // at this point, x is not a leaf and has one real child and one dummy child
  const leftDummy = isDummy(getLeft(x));
  const theRealChild = leftDummy ? getRight(x) : getLeft(x);
  const theDummyChild = leftDummy ? getLeft(x) : getRight(x);
  // now delete x from the tree and replace if with theRealChild
  // first delete the dummy child to keep it from dangling
  deleteNode(theDummyChild);
  // then replace x with the real child
  if ( parent === null || parent === undefined ) {
    // if x is the root, there is no parent,
    //  so no need to delete edge nor figure out if x is left or right child
    // simply delete it and the real child becomes the new root automatically
    display(`Deleted root node, new root has weight ${weight(theRealChild)}`);
    deleteNode(x);
    return;
  }
  // x is not the root, so create edge from parent to theRealChild
  // making sure that theRealChild is in the correct position
  // then delete x
  const xIsRightChild = isRightChild(x);
  const sibling = getSibling(x);
  step(()=> {
    if ( isPredecessor ) {
      display("Deleting predecessor node, replacing it with its child")
    } else {
      display(`Deleting node with weight ${weight(x)}, replacing it with its child`)
    }
    deleteNode(x);
    addEdge(parent, theRealChild);
    // at this point the parent has edges to the sibling and the real child
    // it remains to determine their order
    if ( xIsRightChild ) {
      setChildren(parent, [sibling, theRealChild]);
    } else {
      setChildren(parent, [theRealChild, sibling]);
    }
  })
  return;
}

/**
 * Deletes a node with weight k from the BST rooted at x
 * @param x a subroot of BST, initially the root of the BST
 * @param k the weight of the node to delete
 */
function deleteNodeBST(x, k) {
  // Couldn't find node we are trying to delete, error
  if ( x === undefined || getAttribute(x, "dummy") || ( isLeaf(x) && k != weight(x) ) ){
    display(`Could not find node ${k} to delete`);
    return;
  }

  //Not a leaf, and weight(x) not k, keep searching
  accentNode(x);
  if ( k < weight(x) ) {
    unaccent(x)
    return deleteNodeBST(getLeft(x), k);    
  } else if ( k > weight(x) ) {
    unaccent(x)
    return deleteNodeBST(getRight(x), k);
  }

  if ( ! hasTwoRealChildren(x) ) {
    terminalNodeDeletion(x, false);
    return;
  }

  // Has two real children, need to replace x with in-order predecessor

  // Find in-order predecessor
  step(() => {
    display("Looking for in-order predecessor")
    color(x, "black")
  })
  const predecessor = findInOrderPredecessor(getLeft(x));

  // Replace deleted node weight with in-order predecessor weight
  const predWeight = weight(predecessor);
  step(() => {
    setWeight(x, predWeight);
    uncolor(x)
    color(predecessor, "black");
  })
  // Now delete the predecessor node, which has at most one child
  terminalNodeDeletion(predecessor, true);
  display(`Deleted node with weight ${k} by replacing with predecessor`);
  return
}

// ------------ END DELETE -----------

/**
 * Main loop for adding/deleting nodes in a BST
 */
step(() => {
  setWeightsInside(true)
  setDirected(true);
  cleanTree();
})
let running = true;
display("Binary search tree animation. To add nodes, give positive weights; to remove, negative and to stop 0")
while ( running ) {
  // the following does not work; something is amiss with prompts and line feeds
  const weight = promptNumber("Add (weight > 0), remove (-weight) or stop (0)")
  if (weight > 0) {
    display(`Adding node with weight ${weight}`)
    addNodeBST(getRoot(), weight);
  } else if (weight < 0){
    display(`Deleting node with weight ${-weight}`)
    deleteNodeBST(getRoot(), -weight);  
  } else {
    running = false; 
  }
}

display("The tree is done; the algorithm is finished");
