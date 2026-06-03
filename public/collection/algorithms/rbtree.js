// colors used for red and black nodes should not obscure the weights. so use lighter versions
const BLACK_COLOR = "gray"
const RED_COLOR = "pink"

function isRoot(node) {
    return getParent(node) === null || getParent(node) === undefined
}

function isLeftChild(node) {
    const parent = getParent(node)
    if ( parent === undefined || parent === null ) {
        return undefined
    }
    return getLeft(parent) === node
}

function makeBlack(node) {
    color(node, BLACK_COLOR)
}

function isBlack(node) {
    return isDummy(node) || getColor(node) === BLACK_COLOR
}

function makeRed(node) {
    color(node, RED_COLOR)
}

function isRed(node) {
    return getColor(node) === RED_COLOR
}

/**
 * @returns a new (newly created)dummy node
 */
function createDummy() {
  const dummy = addNode()
  setAttribute(dummy, "dummy", true);
  return dummy;
}

function isDummy(node) {
    return getAttribute(node, "dummy") === true
}

/**
 * @returns the sibling of the given node
 * @param node the node whose sibling we are finding
 * @assume the node has a parent
 * 
 * @todo add this to Thread.js and TreeInterface.js
 */
function getSibling(node) {
  if ( node === null || node === undefined ) {
    throw new Error(`getSibling called on nonexistent node`);  }
  const parent = getParent(node);
  if ( parent === null || parent === undefined ) {
    throw new Error(`getSibling called on node with ${node}, weight ${weight(node)}, no parent`);
  }
  return getLeft(parent) === node ? getRight(parent) : getLeft(parent);
}

function replaceLeaf(leaf, newWeight) {
    step(() => {
        setAttribute(leaf, "dummy", false)
        setWeight(leaf, newWeight)
        makeRed(leaf)
        const dummyOne = createDummy()
        const dummyTwo = createDummy()
        addEdge(leaf, dummyOne)
        addEdge(leaf, dummyTwo)
    })
    return leaf
}

/**
 * removes edges from a node to its children
 */
function disconnectChildren(node) {
    // very important to remove edge to *right child* first;
    //  it's the second child - if edge to left child is gone, there is no second child
    removeEdge(node, getRight(node))
    removeEdge(node, getLeft(node))
}

/**
 * Makes the two children the left and right children of the parent, removing any existing edges
 */
function relink(parent, left, right) {
    display(`||| -> relink, parent = ${parent}, left = ${left}, right = ${right}`)
    addEdge(parent, left)
    addEdge(parent, right)
    setChildren(parent, [left, right])
    display("||| <- relink")
}

/**
 * Performs a rotation based on subtrees and the parents of their roots
 * The end result has parents[1] as root of the final subtree,
 *  parents[0] and parents[2] as its children,
 *  subtrees[0] and subtrees[1] as children of parents[0],
 *  subtrees[2] and subtrees[3] as children of parents[2]
 */
function rotate(parents, subtrees) {
    display(`()() -> rotate, [${parents[0]}, ${parents[1]}, ${parents[2]}], [${subtrees[0]}, ${subtrees[1]}, ${subtrees[2]}, ${subtrees[3]}]`)
    // important to remove all edges prior to relinking;
    // otherwise cycles arise or some nodes end up with two parents
    disconnectChildren(parents[0])
    disconnectChildren(parents[1])
    disconnectChildren(parents[2])
    // now reconnect parents and subtrees in the desired order
    relink(parents[1], parents[0], parents[2])
    relink(parents[0], subtrees[0], subtrees[1])
    relink(parents[2], subtrees[2], subtrees[3])
    display("()() <- rotate")
}

function restructure(child, parent, grandparent) {
    display(`### -> restructure, child weight = ${weight(child)}, parent weight = ${weight(parent)}, grandparent weight = ${weight(grandparent)}`)
    if ( child === getLeft(parent) && parent === getLeft(grandparent) ) {
        rotate([child, parent, grandparent], [getLeft(child), getRight(child), getRight(parent), getRight(grandparent)])
        // makeRed(grandparent)
        // makeBlack(parent)
        // makeRed(child)
        display(`### <- restructure, return parent = ${parent}, weight = ${weight(parent)}`)
        return parent
    }
    if ( child === getRight(parent) && parent === getRight(grandparent) ) {
        rotate([grandparent, parent, child], [getLeft(grandparent), getLeft(parent), getLeft(child), getRight(child)])
        // makeRed(grandparent)
        // makeBlack(parent)
        // makeRed(child)
        display(`### <- restructure, return parent = ${parent}, weight = ${weight(parent)}`)
        return parent
    }
    if ( child === getLeft(parent) && parent === getRight(grandparent) ) {
        rotate([grandparent, child, parent], [getLeft(grandparent), getLeft(child), getRight(child), getRight(parent)])
        // makeRed(grandparent)
        // makeBlack(child)
        // makeRed(parent)
        display(`### <- restructure, return child = ${parent}, weight = ${weight(child)}`)
        return child
    }
    if ( child === getRight(parent) && parent === getLeft(grandparent) ) {
        rotate([parent, child, grandparent], [getLeft(parent), getLeft(child), getRight(child), getRight(grandparent)])
        // makeRed(parent)
        // makeBlack(child)
        // makeRed(grandparent)
        display(`### <- restructure, return child = ${parent}, weight = ${weight(child)}`)
        return child
    }
}

/// +++ ADDITION

/**
 * Main function that adds a node
 * @param subroot root of subtree where the search continues
 * @param newWeight weight of the node to be added
 * @returns true if the subroot has been recolored red, leading to a potential double red
 *          false means we're done - no possibility of double red up the line
 * The return value is important as an indicator that we're done after a restructure
 */
function addNodeRBT(subroot, newWeight) {
    // empty tree, create a new root
    if ( subroot === null || subroot === undefined ) {
        const newNode = addNode()
        display("empty tree, new node =", newNode)
        replaceLeaf(newNode, newWeight)
        makeBlack(newNode)
        return false
    }

    let redSubroot
    display(`+++ -> addNodeRBT(${subroot}, ${weight(subroot)}, ${newWeight})`)
    if ( isDummy(subroot) ) {
      const newNode = replaceLeaf(subroot, newWeight)
      display(`added new (red) node`)
      // we replaced the current subroot with a red node
      redSubroot = true
    } else {
      // Note: weights will be equal if we replaced the subroot,
      //  so need to put the check for equality in the else clause
      if ( newWeight < weight(subroot) ) {
        redSubroot = addNodeRBT(getLeft(subroot), newWeight)
      } else if ( newWeight > weight(subroot) ) {
        redSubroot = addNodeRBT(getRight(subroot), newWeight)
      } else {
        // weights are equal
        display(`A node with weight ${newWeight} already exists`)
        return false
      }
    }

    // the root will always be black, regardless of what happens below
    if ( isRoot(subroot) ) {
        makeBlack(subroot)
        display(`+++ <- addNodeRBT(${subroot}), subroot is the root, return false`)
        return false
    }

    // No recoloring of the subroot means it's safe to return
    if ( ! redSubroot ) {
        display(`+++ <- addNodeRBT(${subroot}): subroot is black or node with newWeight already exists,  return false`)
        return false
    }

    // parent is black, so no double red
    if ( isBlack(getParent(subroot))) {
        display(`+++ <- addNodeRBT(${subroot}), parent of subroot is black, return false`)
        return false
    }

    // Now we have a double red:
    //  subroot is red and its parent is also red
    // Subroot must have a parent - we've already handled the case where it is the root
    // The two red nodes are the subroot and its parent
    const parent = getParent(subroot)
    const sibling = getSibling(parent)

    if ( isBlack(sibling) ) {
        // Do a restructure/recolor involving subroot, parent, and grandparent
        //   - see slide 6 of the lecture slides.
        // This is the end of the line - the subroot of the restructured subtree is black
        // Since subtree root may change during restructuring, the grandparent may have a different child.
        // We need to know which child is replaced unless the parent is the root, i.e., has no parent.
        const grandparent = getParent(parent)
        const greatgrandparent = getParent(grandparent)
        display(`sibling is black, parent = ${parent}, grandparent = ${grandparent}`)
        let grandparentIsLeftChild
        // If the grandparent exists, need to disconnect before restructuring to avoid confusion
        if ( greatgrandparent !== null && greatgrandparent !== undefined ) {
            grandparentIsLeftChild = isLeftChild(grandparent)
            removeEdge(greatgrandparent, grandparent)
        }
        const newSubroot = restructure(subroot, parent, grandparent)
        makeBlack(newSubroot)
        makeRed(getLeft(newSubroot))
        makeRed(getRight(newSubroot))
        // reconnect new subroot with greatgrandparent
        if ( greatgrandparent !== null && greatgrandparent !== undefined ) {
            addEdge(grandparent, newSubroot)
            if ( grandparentIsLeftChild ) {
              setChildren(greatgrandparent, [newSubroot, getRight(greatgrandparent)])
            }
            else {
              setChildren(greatgrandparent, [getLeft(greatgrandparent), newSubroot])
            }
        }
        display(`+++ <- addNodeRBT(${subroot}), retructuring has occurred, return false`)
        return false
    }
    // Now we deal with a red sibling
    // - see slide 8
    // Recoloring will turn the parent red, which may cause a double red up the line
    // Note: If parent is the root, it can stay black; this case is dealt with up the line as well
    step(() => {
        makeBlack(subroot)
        makeBlack(sibling)
        makeRed(parent)
    })
    display(`+++ <- addNodeRBT(${subroot}), parent has turned red, return true`)
    return true
}

/// +++ END, ADDITION

/// --- REMOVAL

/**
 * @returns the in-order predecessor of a given node, i.e.,
 * the node with maximum weight in the left subtree
 * @param currentNode the node whose in-order predecessor we are finding
 */
function findInOrderPredecessor(currentNode) {
  accentNode(currentNode)
  // While there is a real right child, go right
  if ( getRight(currentNode) && ! getAttribute(getRight(currentNode), "dummy") ) {
    // If a real right child exists, recur
    unaccent(currentNode)
    currentNode = findInOrderPredecessor(getRight(currentNode));
  }

  // If I have no real right child, I am the predecessor
  display(`Found predecessor at node with weight ${weight(currentNode)}`)
  return currentNode
}

/**
 * handles deletion of a terminal node (a leaf or a node with one child)
 * @param x the node to delete
 * @param isPredecessor true if x is an in-order predecessor,
 *         used only to get a meaningful message
 */
function terminalNodeDeletion(x, isPredecessor) {
  const parent = getParent(x);
  if ( isLeaf(x) ) {
    if ( parent === null || parent === undefined ) {
      // Deleting the root node which is the only node in the tree
      deleteNode(x);
      display(`The tree is now empty`);
      return;
    }
    // not the root, so has a parent
    const sibling = getSibling(x);
    if ( isDummy(sibling) ) {
      // delete x and its sibling dummy
      const weightX = weight(x)
      step(() => {
        if ( isPredecessor ) {
          display("Deleting predecessor node and its dummy sibling")
        } else {
          display(`Deleting node with weight ${weight(x)} and its dummy sibling`)
        }
        deleteNode(x);
        deleteNode(sibling);
        unaccent(parent)
      })
      return;
    }
    // sibling is real, so dummify x
    // first delete edge from parent to sibling
    // now set sibling as child of parent in place of x
    // and put a dummy node on the other side
    step(() => {
      if ( isPredecessor ) {
        display("Deleting predecessor node, turning it into a dummy")
      } else {
        display(`Deleting node with weight ${weight(x)}, turning it into a dummy`)
      }
      dummify(x);
    })
    return
  }
  // at this point, x is not a leaf and has one real child and one dummy child
  const leftDummy = isDummy(getLeft(x));
  const theRealChild = leftDummy ? getRight(x) : getLeft(x);
  const theDummyChild = leftDummy ? getLeft(x) : getRight(x);
  // now delete x from the tree and replace if with theRealChild
  // first delete the dummy child to keep it from dangling
  deleteNode(theDummyChild);
  // then replace x with the real child
  if ( parent === null || parent === undefined ) {
    // if x is the root, there is no parent,
    //  so no need to delete edge nor figure out if x is left or right child
    // simply delete it and the real child becomes the new root automatically
    display(`Deleted root node, new root has weight ${weight(theRealChild)}`);
    deleteNode(x);
    return;
  }
  // x is not the root, so create edge from parent to theRealChild
  // making sure that theRealChild is in the correct position
  // then delete x
  const xIsRightChild = isRightChild(x);
  const sibling = getSibling(x);
  step(()=> {
    if ( isPredecessor ) {
      display("Deleting predecessor node, replacing it with its child")
    } else {
      display(`Deleting node with weight ${weight(x)}, replacing it with its child`)
    }
    deleteNode(x);
    addEdge(parent, theRealChild);
    // at this point the parent has edges to the sibling and the real child
    // it remains to determine their order
    if ( xIsRightChild ) {
      setChildren(parent, [sibling, theRealChild]);
    } else {
      setChildren(parent, [theRealChild, sibling]);
    }
  })
  return;
}

/**
 * Deletes a node with weight k from the BST rooted at x
 * @param x a subroot of BST, initially the root of the BST
 * @param k the weight of the node to delete
 */
function removeNodeRBT(x, k) {
  // Couldn't find node we are trying to delete, error
  if ( x === undefined || getAttribute(x, "dummy") || ( isLeaf(x) && k != weight(x) ) ){
    display(`Could not find node ${k} to delete`);
    return;
  }

  //Not a leaf, and weight(x) not k, keep searching
  accentNode(x);
  if ( k < weight(x) ) {
    unaccent(x)
    return removeNodeRBT(getLeft(x), k);    
  } else if ( k > weight(x) ) {
    unaccent(x)
    return removeNodeRBT(getRight(x), k);
  }

  if ( ! hasTwoRealChildren(x) ) {
    terminalNodeDeletion(x, false);
    return;
  }

  // Has two real children, need to replace x with in-order predecessor

  // Find in-order predecessor
  step(() => {
    display("Looking for in-order predecessor")
    color(x, "black")
  })
  const predecessor = findInOrderPredecessor(getLeft(x));

  // Replace deleted node weight with in-order predecessor weight
  const predWeight = weight(predecessor);
  step(() => {
    setWeight(x, predWeight);
    uncolor(x)
    color(predecessor, "black");
  })
  // Now delete the predecessor node, which has at most one child
  terminalNodeDeletion(predecessor, true);
  display(`Deleted node with weight ${k} by replacing with predecessor`);
  return
}

/// --- END REMOVAL

/**
 * Main loop for adding/deleting nodes in a BST
 */
step(() => {
//  setWeightsInside(true)
  setDirected(true);
})
let running = true;
display("Red/black tree animation. To add nodes, give positive weights; to remove, negative and to stop 0")
while ( running ) {
  // the following does not work; something is amiss with prompts and line feeds
  const LF = "\n"
  const weight = promptNumber("Add (weight > 0), remove (-weight) or stop (0)")
  if (weight > 0) {
    display(`Adding node with weight ${weight}`)
    display(`Root = ${getRoot()}`)
    addNodeRBT(getRoot(), weight);
  } else if (weight < 0) {
    display("Removal not yet implemented")
    // display(`Deleting node with weight ${-weight}`)
    // removeNodeRBT(getRoot(), -weight);  
  } else {
    running = false; 
  }
}

display("The tree is done; the algorithm is finished");
