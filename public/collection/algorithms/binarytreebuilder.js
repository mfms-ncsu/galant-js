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


//CytoScapeInterface should handle dummy styling automatically in the future
//TODO: for some reason, the first add after loading moves the camera, would like to fix that
//TODO: kind of works, really kind of doesn't. Has moved 2 from left child of 4 to right, and has added dummys when it shouldn't
//and broken tree without deleting. Will look into further. 

setDirected(true);

//-----------------TreeInterface will later replace these fns with their own, need them here for now-------------------
// Looks for the root node by looking for inDegree of 0
function getRoot() {
  for (const x of getNodes()) {
    if (inDegree(x) === 0) {
      return x;
    }
  }
  return undefined;
}

function isLeaf(node) {
  return (outDegree(node) === 0);
}

function isRoot(node) {
  return (inDegree(node) === 0);
}

function children(node){
  return outgoingNodes(node);
}

//only 1 incoming node for each node, the parent (otherwise undefined if < (root) or > (cycle))
function parent(node){
  const incoming = incomingNodes(node);
  return incoming.length == 1 ? incoming[0] : undefined;
}

function left(node){
  return children(node)[0];
}

function right(node){
  return children(node)[1];
}

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
  while( right(currentNode) && getAttribute(right(currentNode), "dummy") != true ){
    
    // If a real right child exists, recur
    return findInOrderPredecessor(right(currentNode));
  }

  // If I have no real right child, I am the predecessor
  display(`Found predecessor at '${currentNode}'`)
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

function createDummy(){
  const dummy = addNode(0,0)
  setShape(dummy, "square");
  color(dummy, "black");
  setSize(dummy, 20);
  setAttribute(dummy, "dummy", true);
  return dummy;
}

// function dummify(node){
//   setAttribute( node, "dummy", true)
// }

//converts a dummy to a new node
function convertDummy(parent, dummy, k, side) {
  step(()=>{
    setWeight(dummy, k);
    setShape(dummy, "circle");
    color(dummy, "white");
    setSize(dummy, 35);
    setAttribute(dummy, "dummy", false);
    
    display(`Inserted '${k}' as ${side} child of '${weight(parent)}'`);
    return dummy;
  });
}

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
      addEdge(x, createDummy());
      addEdge(x, createDummy());
    });
    step(()=>{
      if (k < weight(x)) {
        convertDummy(x, left(x), k, "left")
      } else {
        convertDummy(x, right(x), k, "right")
      } 
    });
    return;
  }

  // At the end of the tree or recursive call
  if (k < weight(x)) {
    const L = left(x);
    if (L && getAttribute(L, "dummy")) { //end, replace dummy
      return convertDummy(x, L, k, "left");
    } else {
      return addNodeBST(L, k);  //not end, recur
    }
  } else if (k > weight(x)) {
    const R = right(x);
    if (R && getAttribute(R, "dummy")) { //end, replace dummy
      return convertDummy(x, R, k, "right");
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
  //TODO: how many of these are actually needed?
  if (x === undefined || getAttribute(x, "dummy") || (isLeaf(x) && k != weight(x))){
    display(`Could not find node '${k}' to delete`);
    return;
  }

  accentNode(x);

  //Not a leaf, and not == k, keep searching
  if (k < weight(x)) {
    return deleteNodeBST(left(x), k);    
  } else if (k > weight(x)) {
    return deleteNodeBST(right(x), k);
  }

  //If we get here, k must equal weight(x???
  display(`'${k}' FOUND, deleting`);

  const p = parent(x);
  const L = left(x);
  const R = right(x);
  const leftDum = L && getAttribute(L, "dummy");
  const rightDum = R && getAttribute(R, "dummy");

  //is a leaf, or functionally is one with 2 dummy children (all dummy)
  if (isLeaf(x) || leftDum && rightDum){
    deleteNodeHelper(p, x);
    return;
  }

  //no dummy
  if (!leftDum && !rightDum){
    // Find in-order predecessor
    let predecessor = findInOrderPredecessor(L);
    // Replace deleted node weight with in-order predecessor weight
    let predWeight = weight(predecessor);

    // Call delete on in-order predecessor
    deleteNodeBST(x, predWeight);
    setWeight(x, predWeight);
  } 
  //1 of each
  else if (!rightDum){
    if (p){      

      // Replace this node's weight with its only child and store its children
      setWeight(x, weight(R));
      const newChildren = children(R);

      // Delete both children
      children(x).forEach( (child) => {
          display(`Deleting edge between '${weight(x)}' and '${weight(child)}'`);
          deleteEdge(getEdgeBetween(x, child));
          deleteNode(child);
      });

      // Reattach new children
      newChildren.forEach((child) => {
          addEdge(x, child);
      });
      
    }
  } else {
    if (p){

      // Replace this node's weight with its only child and store its children
      setWeight(x, weight(L));
      let newChildren = children(L);

      // Delete both children
      children(x).forEach((child) => {
        display(`Deleting edge between '${weight(x)}' and '${weight(child)}'`);
        deleteEdge(getEdgeBetween(x, child));
        deleteNode(child);
      });

      // Reattach new children
      newChildren.forEach((child) => { 
          addEdge(x, child);
      });
    }
  }

  //deleteNode(x);
  display(`Successully deleted: '${k}'`);
}

while (!promptBoolean("Is the tree done?")){
  cleanTree();

  if (promptBoolean("Would you like to ADD a node")){
    const weight = promptNumber("What is the weight of the new node?");
    addNodeBST(getRoot(), weight);
  } else if (promptBoolean("Would you like to DELETE a node")){
    const weight = prompt("What is the weight of the node to delete");    
    deleteNodeBST(getRoot(), weight);  
  } else {    
    display("Only adding and deleting nodes is supported currently");  
  }
}

display("The tree is done; the algorithm is finished");