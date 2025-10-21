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
function weight(x){
  return x;
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

function createDummy(){
  const dummy = addNodeIdAttrs(0, 0, 0, 0);
  setShape(dummy, "square");
  color(dummy, "black");

  //TODO: fix
  // Cannot create property 'dummy' on string '0'
  //dummy.dummy = true;
  return dummy;
}

function replaceDummy(parent, dummy, k, side) {
  deleteNode(dummy); 
  const newNode = addNodeIdAttrs(k, 0, 0, undefined);
  setWeight(newNode, k);
  addEdge(parent, newNode);

  // add 2 dummy children
  addEdge(newNode, createDummy());
  addEdge(newNode, createDummy());

  display(`Inserted '${k}' as ${side} child of '${weight(parent)}'`);
  return newNode;
}

// A loaded tree does not have dummies. Should add them at the start.
// Uses up IDs. is that ok???
function dummifyTree(node) {
  if (!node){
    return;
  } 

  // Skip if node is a dummy
  if (node.dummy){
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
    const newNode = addNodeIdAttrs(k, 0, 0, undefined);
    setWeight(newNode, k);
    addEdge(newNode, createDummy());
    addEdge(newNode, createDummy());
    display(`Created root '${k}'`);
    return;
  }

  // Show the step to the user
  step(() => {
    mark(x);
    highlight(x);
    label(x, "#" + visit++);
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
  // if (isLeaf(x)) {
  //   addEdge(x, createDummy());
  //   addEdge(x, createDummy());
  // }

  // At the end of the tree or recursive call
  if (k < weight(x)) {
    const L = left(x);
    if (L && L.dummy) { //end, replace dummy
      return replaceDummy(x, L, k, "left");
    } else {
      return addNodeBST(L, k);  //not end, recur
    }
  } else if (k > weight(x)) {
    const R = right(x);
    if (R && R.dummy) { //end, replace dummy
      return replaceDummy(x, R, k, "right");
    } else {
      return addNodeBST(R, k);  //not end, recur
    }
  }
}

// Entry point


step(() => {
  dummifyTree(getRoot());
});

while (!promptBoolean("Is the tree done?")){
  step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    //clearNodeWeights();
    clearEdgeHighlights();
    clearEdgeColors();
    visit = 1;
  });

  let k = Number(prompt("What is the weight (key) of the new node?"));
  if (isNaN(k)) {
    display("Invalid input. Please enter a number.");
  } else {
    addNodeBST(getRoot(), k);
  }

}

display("The tree is done; the algorithm is finished");