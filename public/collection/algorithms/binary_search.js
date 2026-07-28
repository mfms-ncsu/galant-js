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
      return outgoingNodes(x)[0];
    }
  }
}

// Algorithm starts on root
const start = getRoot();

// Recursivly goes through the tree
function search(node, target, lastVisited) {
  if (node === undefined) {
    display(`'${target}' not found`);
    let createNode = promptBoolean(`Do you want to insert: '${target}'`);

    if (createNode) {
      step(() => {
        addNodeIdAttrs(target, 0 ,0, undefined);
        addEdge(lastVisited, target);
      });
      step(() => {
        mark(target);
        highlight(target);
        label(target, "#" + visit++);
      });

      display(`Successully added: '${target}'`);
      return node;
    }
    display(`Algorithm finished: '${target}' not found`);
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
    return search(children[0], target, node);
    
  }

  // Looks at the right branch if the target is bigger
  return search(children[1], target, node);
}

// Starts postOrder traversal on the given node
if (search(start, target)) {
  display(`Algorithm finished: '${target}' successfully found`);
}
