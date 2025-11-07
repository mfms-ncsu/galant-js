/**
 * BinaryTreeBuilder algorithm that prompts the user to add or remove nodes until user says to stop
 * Based on Bryan's Binary Search, peer programmed with Andrew
 * 
 * Q1 is the tree done, yes = stop
 * Q2 Do you want to add a node, yes = add
 * Q3 Do you want to delete a node, yes = delete
 * Q4 If adding, what is the weight, if removing, what is the id (id is 1st/big #, weight is 4th/lil #)
 * Maybe need to do error checking (might be done already in thread.js)
 * If adding, get the parent via binary tree search (adding the first node/root may be a special case)
 * If deleting, use right successor (leaf is easy, handle cases for deleteing a parent, root may be a special case)
 * Do add/delete
 * Loop
 */

//THIS IS SOLELY MEANT TO CREATE FROM AN EMPTY TREE, OR LOAD A TREE CREATED FROM THIS ALGO

//CytoScapeInterface should handle dummy styling automatically in the future
//TODO: for some reason, the first add after loading moves the camera, would like to fix that
//TODO: kind of works, really kind of doesn't. Has moved 2 from left child of 4 to right, and has added dummys when it shouldn't
//and broken tree without deleting. Will look into further. 

setDirected(true);

//-----------------TreeInterface will later replace these fns with their own, need them here for now-------------------
// Looks for the root node by looking for inDegree of 0

// Show the nodes being traced to the user
function accentNode(x){
  // For some reason only marking the root, so commented out for now
  step(() => {
    //mark(x);
    highlight(x);
  });
}

function cleanTree(){
  step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    clearEdgeHighlights();
    clearEdgeColors();
  });
}

//-----------------UNIQUE BST FNS-------------------

// Call this on the left child of the subtree root
function findInOrderPredecessor(currentNode){
  // While there is a real right child, go right
  mark(currentNode)
  while( getRight(currentNode) && getAttribute(getRight(currentNode), "dummy") != true ){
    
    // If a real right child exists, recur
    return findInOrderPredecessor(getRight(currentNode));
  }

  // If I have no real right child, I am the predecessor
  display(`Found predecessor at '${weight(currentNode)}'`)
  return currentNode
}

// Call this on the right child of the subtree rotty
// function findInOrderSuccessor(currentNode){
//   // While there is a real left child, go left
//   while( left(currentNode) && getAttribute(left(currentNode), "dummy") != true ){
    
//     // If a real left child exists, recur
//     return findInOrderSuccessor(left(currentNode));
//   }
//   display(`Found successor at '${currentNode}'`)
//   return currentNode
// }

function dummify( nodeId ){
  setAttribute(nodeId, "dummy", true);
  setAttribute(nodeId, "weight", undefined);
  return nodeId;
}

function undummify( nodeId, weight ){
  setAttribute(nodeId, "dummy", false);
  setAttribute(nodeId, "weight", weight);
  return nodeId;
}

function createDummy(){
  const dummy = addNode(0,0)
  setAttribute(dummy, "dummy", true);
  return dummy;
}

// function dummify(node){
//   setAttribute( node, "dummy", true)
// }

//-----------------ADD/DELETE-------------------
function addNodeBST(x, k) {

  // If empty, make new root
  if (x === undefined) {
    const newNode = addNode(0,0)
    setWeight(newNode, k);
    display(`Created root '${k}'`);
    return;
  }

  accentNode(x);

  // Found duplicate node
  if (k === weight(x)) {
    display(`Node with key '${k}' already exists`);
    return;
  }

  // If a leaf, then add 2 dummy nodes
  if (isLeaf(x)) {    
    step(()=>{
      if (k < weight(x)) {
        addLeft( x, k);
        dummify(addRight(x, undefined));
      } else {
        addRight(x, k);
        dummify(addLeft(x, undefined));
      } 
    });
    return;
  }

  // At the end of the tree or recursive call
  if (k < weight(x)) {
    const L = getLeft(x);
    if (L && getAttribute(L, "dummy")) { //end, replace dummy
      return undummify(L, k);
    } else {
      return addNodeBST(L, k);  //not end, recur
    }
  } else if (k > weight(x)) {
    const R = getRight(x);
    if (R && getAttribute(R, "dummy")) { //end, replace dummy
      return undummify(R, k);
    } else {
      return addNodeBST(R, k);  //not end, recur
    }
  }
  display("Error: BSTadd did not recur or add a node.");
}


function deleteNodeHelper(p, x){
  const k = weight(x);
  if (p){
    addEdge(p, createDummy());
    deleteEdge(getEdgeBetween(p, x))
  }
  deleteNode(x);
  display(`Successully deleted: '${k}'`);
}

function deleteNodeBST(x, k) {
  // Couldn't find node we are trying to delete, error
  if (x === undefined || getAttribute(x, "dummy") || (isLeaf(x) && k != weight(x))){
    display(`Could not find node '${k}' to delete`);
    return;
  }

  accentNode(x);

  //Not a leaf, and not == k, keep searching
  if (k < weight(x)) {
    return deleteNodeBST(getLeft(x), k);    
  } else if (k > weight(x)) {
    return deleteNodeBST(getRight(x), k);
  }

  //If we get here, k must equal weight(x???
  display(`'${k}' FOUND, deleting`);

  const p = getParent(x);
  const L = getLeft(x);
  const R = getRight(x);
  const leftDum = L && getAttribute(L, "dummy");
  const rightDum = R && getAttribute(R, "dummy");
  let S = null;
    if (p) {
        S = getLeft(p) === x ? getRight(p) : getLeft(p);
    }
  const sibDum = S && getAttribute(S, "dummy");

  //CASE 1: DELETE A LEAF
  if (isLeaf(x)){
    //if sibling is a dummy, delete this and the sibling, otherwise turn this to a dummmy
    if (sibDum){
      deleteNode(x);
      deleteNode(S);
      display(`Deleted leaf '${k}' and its dummy sibling`);
      return;
    } else {
      dummify(x);
      display(`Successully deleted: '${k}'`);
      return;
    }
  }

  //CASE 2: DELETE WITH 2 CHILDREN
  if (!leftDum && !rightDum){
    // Find in-order predecessor
    let predecessor = findInOrderPredecessor(L);
    // Replace deleted node weight with in-order predecessor weight
    step(() =>{
      let predWeight = weight(predecessor);
      // Call delete on in-order predecessor
      deleteNodeBST(x, predWeight);
      setWeight(x, predWeight);
      display(`Successully deleted: '${k}'`)
    });
  } 
  //1 of each

  //CASE 3: DELETE WITH 1 CHILD
  else if (!rightDum){
    if (p){      

      // Replace this node's weight with its only child and store its children
      setWeight(x, weight(R));
      const newChildren = getChildren(R);

      // Delete both children
      getChildren(x).forEach( (child) => {
          display(`Deleting edge between '${weight(x)}' and '${weight(child)}'`);
          deleteEdge(getEdgeBetween(x, child));
          deleteNode(child);
      });

      // Reattach new children
      newChildren.forEach((child) => {
          addEdge(x, child);
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
      getChildren(x).forEach((child) => {
        display(`Deleting edge between '${weight(x)}' and '${weight(child)}'`);
        deleteEdge(getEdgeBetween(x, child));
        deleteNode(child);
      });

      // Reattach new children
      newChildren.forEach((child) => { 
          addEdge(x, child);
      });
    }else{
      step(() => {
        deleteNode(R);
        deleteNode(x);
      });
    }
  }

  //deleteNode(x);
  display(`Successully deleted: '${k}'`);
}

//TODO: this may cause issues if the loaded tree has weights <= 0, but is an easier UX
let running = true;
while (running){
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