/**
 * Binary search algorithm for trees. Works for binary trees
 */

setDirected(true);
let target;

// Order that node has been visited
let visit = 1;

// Prompts the user for target node to search for
step(() => {
  clearNodeMarks();
  clearNodeHighlights();
  clearNodeLabels();
  clearNodeWeights();

  clearEdgeHighlights();
  clearEdgeColors();

  target = prompt("Enter target node:");
  display(`Searching for '${target}'`);
});

// Looks for the root node by looking for inDegree of 0
function getRoot() {
  for (const x of getNodes()) {
    if (inDegree(x) === 0) {
      return x;
    }
  }
}

// Algorithm starts on root
const start = getRoot();

// Recursivly goes through the tree
function search(node, target) {
  if (node === undefined) {
    return node;
  }

  step(() => {
    mark(node);
    highlight(node);
    label(node, "#" + visit++);
  });

  if (node === target) {
    return node;
  }

  const children = outgoingNodes(node);

  // Looks at the left branch if target is smaller
  if (target < node) {
    color(getEdgeBetween(node, children[0]), "red");
    return search(children[0], target);
  }

  // Looks at the right branch if the target is bigger
  color(getEdgeBetween(node, children[1]), "red");
  return search(children[1], target);
}

// Starts postOrder traversal on the given node
if (search(start, target)) {
  display(`Algorithm finished: '${target}' successfully found`);
} else {
  display(`Algorithm finished: '${target}' not found`);
}
