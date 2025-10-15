/**
 * Treebuilder algorithm that prompts the user to add or remove nodes until user says to stop
 * Based on Bryan's Binary Search, peer programmed with Andrew
 */



/**
 * Q1 is the tree done, yes = stop
 * Q2 Do you want to add a node, yes = add, no = delete
 * Q3 If adding, what is the weight, if removing, what is the id (id is 1st/big #, weight is 4th/lil #)
 * Maybe need to do error checking (might be done already in thread.js)
 * If adding, Ask user for the edge (can become parent of root, or leaf child of any node, can't be parent of a node other than the root)
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

  target = prompt("Enter new node weight:");
  //display(`Searching for '${target}'`);
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
//^^happens once at the start

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
    display(`'${target}' not found`);
    createNode = promptBoolean(`Do you want to insert: '${target}'`);

    if (createNode) {
      addNodeIdAttrs(target, 0 ,0, undefined);
      addEdge(lastVisited, target);

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