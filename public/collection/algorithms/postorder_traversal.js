/**
 * Post-order traversal algorithm for trees. Works for trees only (extension .tree)
 */

setDirected(true);
let start;
let traversal = "";

// Prompts the user for a starting node
step(() => {
  clearNodeMarks();
  clearNodeHighlights();
  clearNodeLabels();
  clearNodeWeights();

  clearEdgeHighlights();
  clearEdgeColors();

  start = promptNode("Enter start node:");
  display(`Starting at node '${start}'`);
});

// Recursivly goes through the tree
function postOrder(node) {
  if (node === undefined) {
    return;
  }

  mark(node);

  // Visit all children
  for ( const x of getChildren(node) ) {
    postOrder(x);
  }

  step(() => {
    color(node, "red");
    traversal = traversal + node + " ";
    // Lists the order the nodes have been traversed in
    display(`Traversal: ${traversal}`);
  });
}

// Starts postOrder traversal on the given node
postOrder(start);

// Outputs the final traversal after algorithm is finished
display(`Algorithm finished: Final traversal: ${traversal}`);
