/**
* Allows the user to create a BST just with prompting.
* They will be prompted to enter a number -->
*    - If the number is positive, it is added to the tree
*    - If the number is negative, it is deleted from the tree
*    - If the number is 0, the algorithm stops
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
    if ( parent(nodeId) ) unmark(parent(nodeId));
  });
}

// this should be added to Thread.js and TreeInterface.js
function getSibling(node) {
  const parent = getParent(node);

  // If the left child of the parent is the node, return the right child 
  // of the parent which would be the sibling of node
  // else return the left child which would be node's sibling
  return getLeft(parent) === node ? getRight(parent) : getLeft(parent);
}

//-----------------UNIQUE BST FNS-------------------

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
 * adds a left child with weight w and puts the weight inside the node
 * @param nodeId (id of) the node whose left child we are adding
 * @param w weight of the new left child
 */
function addLeftInsideWeight(nodeId, w) {
  const newNode = addLeft(nodeId, w);
  setAttribute(newNode, "weightInNode", true);
  hideWeight(newNode);
  return newNode;
}

/**
 * adds a right child with weight w and puts the weight inside the node
 * @param nodeId (id of) the node whose right child we are adding
 * @param w weight of the new right child
 */
function addRightInsideWeight(nodeId, w) {
  const newNode = addRight(nodeId, w);
  setAttribute(newNode, "weightInNode", true);
  hideWeight(newNode);
  return newNode;
}

/**
 * adds a node with weight w and puts the weight inside the node
 * used when adding the root node
 */
function addNodeInsideWeight(w) {
  const newNode = addNode(0, w);
  setAttribute(newNode, "weightInNode", true);
  hideWeight(newNode);
  return newNode;
}

/**
 * finds the in-order predecessor of a given node, i.e.,
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
  setAttribute(nodeId, "dummy", false);
  setAttribute(nodeId, "weight", weight);
  display(`Successfully added node ${weight}`)
  return nodeId;
}

/**
 * creates and returns a new dummy node
 */
function createDummy(){
  const dummy = addNode(0, 0)
  setAttribute(dummy, "dummy", true);
  return dummy;
}

//-----------------ADD/DELETE-------------------

function addNodeBST(x, k) {
  // If empty, make new root
  if ( x === null ) {
    addNodeInsideWeight(k);
    display(`Created root ${k}`);
    return;
  }

  // Found duplicate node
  if (k === weight(x)) {
    display(`Node with key ${k} already exists`);
    return;
  }

  // If a leaf, then add 2 dummy nodes
  if ( isLeaf(x) ) {    
    step(()=>{
      if ( k < weight(x) ) {
        addLeftInsideWeight(x, k);
        dummify(addRight(x, undefined));
      } else {
        addRightInsideWeight(x, k);
        dummify(addLeft(x, undefined));
      } 
      display(`Successfully added node ${k}`)
    });
    return;
  }

  // Not a leaf, keep searching
  accentNode(x);
  if ( k < weight(x) ) {
    const L = getLeft(x);
    if ( L && isDummy(L) ) { //end, replace dummy
      return undummify(L, k);
    } else {
      return addNodeBST(L, k);  //not end, recur
    }
  } else if ( k > weight(x) ) {
    const R = getRight(x);
    if ( R && isDummy(R) ) { //end, replace dummy
      return undummify(R, k);
    } else {
      return addNodeBST(R, k);  //not end, recur
    }
  }
  // Should never reach here
  display("Error: BSTadd did not recur or add a node.");
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

  //Not a leaf, and not == k, keep searching
  accentNode(x);
  if ( k < weight(x) ) {
    return deleteNodeBST(getLeft(x), k);    
  } else if ( k > weight(x) ) {
    return deleteNodeBST(getRight(x), k);
  }

  // Found node to delete
  const leftDummy = getLeft(x) && isDummy(getLeft(x));
  const rightDummy = getRight(x) && isDummy(getRight(x));
  const sibling = getSibling(x);
  const sibDummy = isDummy(sibling);

  // CASE 1: DELETE A LEAF
  if ( isLeaf(x) ) {
    // if sibling is a dummy, delete this and the sibling, otherwise turn this to a dummmy
    if ( sibDummy ){
      deleteNode(x);
      deleteNode(sibling);
      display(`Deleted leaf ${k} and its dummy sibling`);
      return;
    } else if ( getRoot() != x ) {
      dummify(x);
      display(`Successully deleted: ${k}`);
      return;
    } else {
      deleteNode(x);
      display(`Successully deleted: ${k}`);
    }
  }

  // CASE 2: DELETE WITH 2 CHILDREN
  else if ( ! leftDummy  && ! rightDummy ) {

    // Find in-order predecessor
    let predecessor = findInOrderPredecessor(left(x));

    // Replace deleted node weight with in-order predecessor weight
    step(() =>{
      let predWeight = weight(predecessor);
      // Delete the in-order predecessor
      deleteNodeBST(x, predWeight, true);
      setWeight(x, predWeight);
      display(`Successully deleted: '${k}'`)
    });
  } 

  // CASE 3: DELETE WITH 1 CHILD
  // Get the lone child
  const theChild = leftDummy ? getRight(x) : getLeft(x);

  // first the easy case: x is the root
  // then just make the child the new root,
  // which is easy, since we can just delete the root
  if ( ! p ) {
    deleteNode(x);
  }
  else {
    // @todo: need functions makeLeftChild and makeRightChild for situations where
    // both the node and the child already exist -- see TreeInterface.js
    // these functions would be in Thread.js as well
    // after that, it will be easy to refactor this code to use those functions

    // if x has a parent, we need to attach the child to the parent
    // first, figure out if x is a left or right child of its parent
    if ( getLeft(p) === x ) {
      // x is a left child
      step(() => {
        deleteEdge(p, x);
        addEdge(p, theChild);
        deleteNode(x);
      });
    }
    else {
      // x is a right child
      step(() => {
        deleteEdge(p, x);
        addEdge(p, theChild);
        deleteNode(x);
      });
    }
  }

  else if ( ! rightDum ) {
    // has only a right child
    if ( p ) {
      // if node has a parent, the right child takes its place    

      setWeight(x, weight(R));
      const newChildren = getChildren(R);

      // Delete both children
      step(() => {
        getChildren(x).forEach( (child) => {
            deleteNode(child);
        });
      });

      // Reattach new children
      step(() => {
        newChildren.forEach((child) => {
            addEdge(x, child);
        });
      });
      
    }else{
      step(() => {
        deleteNode(L);
        deleteNode(x);
      });
    }
  } else {
    if (p){

      // Replace this node's weight with its only child and store its children
      setWeight(x, weight(L));
      let newChildren = getChildren(L);
      // Delete both children
      step(() => {
        getChildren(x).forEach((child) => {
          deleteNode(child);
        });
      });

      // Reattach new children
      step(() => {
        newChildren.forEach((child) => { 
          addEdge(x, child);
        });
      });
    }else{
      step(() => {
        deleteNode(R);
        deleteNode(x);
      });
    }
  }

  if( !hideDisplay ){
    display(`Successully deleted: '${k}'`);
  }
}

// Cannot store values <= 0
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
