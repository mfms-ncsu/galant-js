/**
 * SHOULD HAVE BEEN BINARYTREEBUILDER - SEE NEW FILE BINARYTREEBUILDER
 * Treebuilder algorithm that prompts the user to add or remove nodes until user says to stop
 * Based on Bryan's Binary Search, inordertravseral, peer programmed with Andrew
 * 
 * Q1 is the tree done, yes = stop
 * Q2 Do you want to add a node, yes = add, no = delete
 * Q3 If adding, what is the weight, if removing, what is the id (id is 1st/big #, weight is 4th/lil #)
 * Maybe need to do error checking (might be done already in thread.js)
 * If adding, Ask user for the parent (can become parent of root, or leaf child of any node, can't be parent of a node other than the root)
 * If deleting, use right successor (deleting root replaces root with right child, same for a parent node, leaf is easy)
 * Do add/delete, loop
 * 
 * In future: will have a binarytreebuilder which will control everything
 * Right now just need to only allow ops that keep it a tree (no breaking tree, no cycles, no 2 parents for 1 node)
 * 
 * Q1 will be an outer while loop (while not done)
 *    Another promp, true = add, false = delete
 *      get data from user
 *      do the op
 */

setDirected(true);

// Clears everything to start
step(() => {
  clearNodeMarks();
  clearNodeHighlights();
  clearNodeLabels();
  clearNodeWeights();
  clearEdgeHighlights();
  clearEdgeColors();
});

// Looks for the root node by looking for inDegree of 0
function getRoot() {
  for (const x of getNodes()) {
    if (inDegree(x) === 0) {
      return x;
    }
  }
  //no root
  return undefined;
}

function addNode(target, parent){
  addNodeIdAttrs(target, 0, 0, target);

  //If no root
  if (getRoot === undefined){
    display(`No root found, '${target}' added as root`);
    return;
  }

  //If root
  addEdge(parent, target);
  display(`Successully added: '${target}' as child of '${parent}'`);
}

// function deleteNode(target){
//   //if a leaf (easy)
//   if (outgoingNodes(target).length == 0 ){
//     deleteNode(target);
//     display(`Successully deleted: '${target}'`);
//     return;
//   }
  
//   //use the right child as the successor if not a leaf
  
// }

// Recursively finds target via inorder traversal and returns it (or undefined if not found)
function search(node, target) {
  //Search didn't find the target
  if (node === undefined) {
    return undefined;
  }

  //Search found the target
  if (node === target) {
    return node;
  }

  //keep looking
  mark(node);
  const children = outgoingNodes(node);

  // First visit the left child
  search(children[0], target);

  // Finally visit the right child
  search(children[1], target);
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

  if (promptBoolean("Would you like to ADD a node")){
    let weight = prompt("What is the weight of the new node");
    let parent = prompt("What is the id of the parent node for the new node ('none' if the new node is the root)");
    
    if (search(getRoot(), weight)){ //Node FOUND
      display(`Cannot add node '${weight}', it already exists`);
    } else {  //Node NOT found
      display(`'${weight}' NOT found, adding`);
      addNode(weight, parent);
    }

  } else if (promptBoolean("Would you like to DELETE a node")){
    let nodeId = prompt("What is the id of the node you would like to delete");
    
    if (search(getRoot(), nodeId)){ //Node FOUND
      display(`'${nodeId}' FOUND, deleting`);
      deleteNode(nodeId);
    } else {  //Node NOT found
      display(`Could not find node '${nodeId}' to delete`);
    }
  } else {
    display("Only adding and deleting nodes is supported currently");
  }
}

display("The tree is done; the algorithm is finished");
  