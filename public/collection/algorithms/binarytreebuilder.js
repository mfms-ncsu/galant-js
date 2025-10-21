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
//TODO: for some reason the step after adding 2 dummies and before replacing one moves the camera, would like to skip that

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

function left(node){
  return children(node)[0];
}

function right(node){
  return children(node)[1];
}


//-----------------UNIQUE BST FNS-------------------
function createDummy(){
  const dummy = addNode(0,0)
  setShape(dummy, "square");
  color(dummy, "black");
  setSize(dummy, 20);
  setAttribute(dummy, "dummy", true);
  return dummy;
}

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

// Not used now, may be useful later
function dummifyTree(node) {
  if (!node){
    return;
  } 
  // Skip if node is a dummy
  if (getAttribute(node, "dummy")){
    return;
  }
  // If leaf, add two dummies
  if (children(node).length === 0) {
    addEdge(node, createDummy());
    addEdge(node, createDummy());
    return;
  }
  // Otherwise, recursive call on each child
  dummifyTree(left(node));
  dummifyTree(right(node));
}


// Main adding logic
function addNodeBST(x, k) {

  // If empty, make new root
  if (x === undefined) {
    const newNode = addNode(0,0)
    setWeight(newNode, k);
    display(`Created root '${k}'`);
    return;
  }

  // Show the nodes being traced to the user
  // For some reason only marking the root, so commented out for now
  step(() => {
    //mark(x);
    highlight(x);
  });

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

//Commented out for speed of debugging
//!promptBoolean("Is the tree done?")
while (true){
  step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    clearEdgeHighlights();
    clearEdgeColors();
  });

  let k = promptNumber("What is the weight of the new node?");
  addNodeBST(getRoot(), k);
}

display("The tree is done; the algorithm is finished");