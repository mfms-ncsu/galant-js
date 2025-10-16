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
}

function addNodeHelper(target, parent){
  if (!getRoot()) {
    addNodeIdAttrs(target, 0, 0, undefined);
    display(`Root not found. Added '${target}' as root`);
    return;
  }

  // Make sure it is added correctly, all cases are accounted for, and the weight is done right
  addNodeIdAttrs(target, 0 ,0, undefined);
  addEdge(parent, target);

  step(() => {
    mark(target);
    highlight(target);
    label(target, "#" + visit++);
  });

  display(`Successully added: '${target}'`);
}

function deleteNodeHelper(target, parent){
  // Make sure it is removed correctly and all cases are accounted for
  deleteEdge(getEdgeBetween(parent, target))
  deleteNode(target);
  
  // step(() => {
  //   mark(target);
  //   highlight(target);
  //   label(target, "#" + visit++);
  // });

  display(`Successully deleted: '${target}'`);
}

// Recursivly goes through the tree to add the node
function addNode(node, target, lastVisited) {
  if (node === undefined) {
    display(`'${target}' NOT found, adding`);
    //do the add
    addNodeHelper(target, lastVisited);
    return;
  }

   step(() => {
    mark(node);
    highlight(node);
    label(node, "#" + visit++);
  });

  // Found the node we are trying to add, error
  if (node === target) {
    display(`Cannot add node '${target}', it already exists`);
    return;
  }

  // Recursive call
  const children = outgoingNodes(node);
  if (target < node) {
    return addNode(children[0], target, node);    
  } else {
    return addNode(children[1], target, node);
  }
 
}

function deleteNode(node, target, lastVisited) {
  // Couldn't find node we are trying to delete, error
  if (node === undefined) {
    display(`Could not find node '${target}' to delete`);
    return;
  }

  step(() => {
    mark(node);
    highlight(node);
    label(node, "#" + visit++);
  });

  if (node === target) {
    display(`'${target}' FOUND, deleting`);
    //do the delete
    deleteNodeHelper(target, lastVisited);
    return;
  }

  // Recursive call
  const children = outgoingNodes(node);
  if (target < node) {
    return deleteNode(children[0], target, node);    
  } else {
    return deleteNode(children[1], target, node);
  }
}


//Entry point
while (!promptBoolean("Is the tree done?")){
  //why is each of these a step in the algorithm???
  // clearNodeMarks();
  // clearNodeHighlights();
  // clearNodeLabels();
  // clearNodeWeights();
  // clearEdgeHighlights();
  // clearEdgeColors();
  // visit = 1;

  if (promptBoolean("Would you like to ADD a node")){
    let weight = prompt("What is the weight of the new node");
    addNode(getRoot(), weight);
  } else if (promptBoolean("Would you like to DELETE a node")){
    let nodeId = prompt("What is the id of the node you would like to delete");
    deleteNode(getRoot(), nodeId);
  } else {
    display("Only adding and deleting nodes is supported currently");
  }
}

display("The tree is done; the algorithm is finished");