/**
 * In-order traversal algorithm for trees. Works for binary trees
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
function inOrder(node) {
  if (node === undefined) {
    return;
  }

  mark(node);

  const children = outgoingNodes(node);

  // First visit the left child
  inOrder(children[0]);

  step(() => {
    color(node, "red");
    traversal = traversal + node + " ";
    // Lists the order the nodes have been traversed in
    display(`Traversal: ${traversal}`);
  });

  // Finally visit the right child
  inOrder(children[1]);
}

// Starts inOrder traversal on the given node
inOrder(start);

// Outputs the final traversal after algorithm is finished
display(`Algorithm finished: Final traversal: ${traversal}`);
