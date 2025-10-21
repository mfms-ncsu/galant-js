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

setDirected(true);
let visit = 1;

// Looks for the root node by looking for inDegree of 0
function getRoot() {
  for (const x of getNodes()) {
    if (inDegree(x) === 0) {
      return x;
    }
  }
  return undefined;
}

//TODO: TEMP FIX. weight in thread.js is undefined, this is a NOT GOOD temp fix. Also breaks detecting adding duplicate nodes
// X MUST BE AN ID (STRING)
// function weight(x){
//   return x;
// }

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

function createDummy(){
  const dummy = addNode(0,0)
  setShape(dummy, "square");
  color(dummy, "black");
  setSize(dummy, 20);
  setAttribute(dummy, "dummy", true);
  return dummy;
}

function replaceDummy(parent, dummy, k, side) {
  //DO not delete, just change to a normal node
  setWeight(dummy, k);
  setShape(dummy, "circle");
  color(dummy, "white");
  setSize(dummy, 35);
  setAttribute(dummy, "dummy", false);
  
  display(`Inserted '${k}' as ${side} child of '${weight(parent)}'`);
  return dummy;
}

// A loaded tree does not have dummies. Should add them at the start.
// Uses up IDs. is that ok???
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
// Uses same value k for id and weight
function addNodeBST(x, k) {

  // If empty, make new root
  if (x === undefined) {
    console.log("undefined root: ", getRoot());
    const newNode = addNode(0,0)
    setWeight(newNode, k);
    display(`Created root '${k}'`);
    return;
  }

  // Show the step to the user
  step(() => {
    mark(x);
    highlight(x);
    //label(x, "#" + visit++);
  });

  // Found duplicate node
  if (k === weight(x)) {
    display(`Node with key '${k}' already exists`);
    return;
  }

  //TODO: fix infinite loop
  // If leaf, attach two dummies (tree input will not contain dummies)
  // Do dummies count towards outgoing edges? How do I know if it is a leaf if it has dummy kids? 
  // How do I make sure there's only 1 layer of dummies? (adding too many already)
  if (isLeaf(x)) {
    
    addEdge(x, createDummy());
    addEdge(x, createDummy());
    if (k < weight(x)) {
      replaceDummy(x, left(x), k, "left")
    } else {
      replaceDummy(x, right(x), k, "right")
    } 
  }

  //check if leaf, is leaf, add 2 dummies, replace the correct one
  //if not a leaf, check which child is a dummy (should only be 1), either recurse or replace

  // At the end of the tree or recursive call
  if (k < weight(x)) {
    const L = left(x);
    if (L && getAttribute(L, "dummy")) { //end, replace dummy
      return replaceDummy(x, L, k, "left");
    } else {
      return addNodeBST(L, k);  //not end, recur
    }
  } else if (k > weight(x)) {
    const R = right(x);
    if (R && getAttribute(R, "dummy")) { //end, replace dummy
      return replaceDummy(x, R, k, "right");
    } else {
      return addNodeBST(R, k);  //not end, recur
    }
  }
  display("Error: BSTadd did not recur or add a node.");
}

//!promptBoolean("Is the tree done?")
while (true){
  step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    //clearNodeWeights();
    clearEdgeHighlights();
    clearEdgeColors();
    visit = 1;
  });

  let k = promptNumber("What is the weight (key) of the new node?");
  console.log("root: ", getRoot());
  addNodeBST(getRoot(), k);
}

display("The tree is done; the algorithm is finished");