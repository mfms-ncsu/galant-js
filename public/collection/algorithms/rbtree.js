// colors used for red and black nodes should not obscure the weights. so use lighter versions
// also use heavy border for black nodes
const BLACK_COLOR = "gray"
const BLACK_BORDER_WIDTH = 6
const RED_COLOR = "pink"

function accentNode(node) {
  label(node, "<")
}

function unaccent(node) {
  unlabel(node)
  label(node, node)
}

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
  step(() => {
    color(node, BLACK_COLOR)
    setBorderWidth(node, BLACK_BORDER_WIDTH)
    setAttribute(node, "borderColor", "black")
  })
}

function isBlack(node) {
    return isDummy(node) || getColor(node) === BLACK_COLOR
}

function makeRed(node) {
  step(() => {
    color(node, RED_COLOR)
    clearBorderWidth(node)
    setAttribute(node, "borderColor", "red")
  })
}

function isRed(node) {
    return getColor(node) === RED_COLOR
}

function makeDoubleBlack(node) {
  const parentEdge = getEdgeBetween(getParent(node), node)
  setEdgeWidth(parentEdge, BLACK_BORDER_WIDTH)
}

function clearDoubleBlack (node) {
  const parentEdge = getEdgeBetween(getParent(node), node)
  clearEdgeWidth(parentEdge)
}

/**
 * @returns a new (newly created) dummy node
 */
function createDummy() {
  const dummy = addNode()
  setAttribute(dummy, "dummy", true);
  label(dummy, dummy)
  return dummy;
}

function isDummy(node) {
  // if the tree is read from a file, the attribute will be a string
  return getAttribute(node, "dummy") || getAttribute(node, "dummy") === "true" 
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
 * Functions relink(), rotate() and restructure are based on
 * Goodrich, Tamassia and Goldwasser, Sixth Edition, p.478
 */

/**
 * Makes the child either the left or right child of the parent
 *  removing any existing edges
 * @param parent the parent to be
 * @param left the left child to be
 * @param right the right child to be
 */
function relink(parent, left, right) {
    display(`||| -> relink, parent = ${parent}, left = ${left}, right = ${right}`)
    addEdge(parent, left)
    addEdge(parent, right)
    setChildren(parent, [left, right])
    display("||| <- relink")
}

/**
 * Performs a rotation based on the relative positions of the node, its parent and its grandparent
 * This version differs from Goodrich et al.
 * It's based on my notes and is more explicit about the order of the subtrees
 * Too whit,
 *  
 *  parents[1] has parents[0] and parents[2] as its children,
 *  subtrees[0] and subtrees[1] are children of parents[0],
 *  subtrees[2] and subtrees[3] are children of parents[2]
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

/**
 * Performs a trinode restructuring of the node, its parent and its grandparent,
 *  based on their left to right order.
 * The left to right order is preserved and one of the three nodes becomes parent of the others.
 * This yields a more balanced tree.
 * @param child the node at the lowest level before restructuring
 * @returns the node that ends up as parent of the other two
 */
function restructure(child) {
  const parent = getParent(child)
  const grandparent = getParent(parent)
  display(`### -> restructure, node = ${child}, parent = ${parent}, grandparent = ${grandparent}`)

  // this will be the root of the subtree after restructure
  let newSubtreeRoot

  // If the greatgrandparent exists, need to disconnect before restructuring to avoid confusion
  // Also need to save important information that will get lost after restructure
  const grandparentIsRoot = isRoot(grandparent)
  // the following will be needed only if grandparent is not currently the root
  const greatgrandparent = getParent(grandparent)
  const grandparentIsLeftChild = grandparentIsRoot ? undefined : isLeftChild(grandparent)
  const leftOfGreatgrandparent = grandparentIsRoot ? undefined : getLeft(greatgrandparent)
  const rightOfGreatgrandparent = grandparentIsRoot ? undefined : getRight(greatgrandparent)
  if ( ! grandparentIsRoot ) {
    removeEdge(greatgrandparent, grandparent)
  }
  if ( child === getLeft(parent) && parent === getLeft(grandparent) ) {
    rotate([child, parent, grandparent], [getLeft(child), getRight(child), getRight(parent), getRight(grandparent)])
    newSubtreeRoot = parent
  }
  if ( child === getRight(parent) && parent === getRight(grandparent) ) {
    rotate([grandparent, parent, child], [getLeft(grandparent), getLeft(parent), getLeft(child), getRight(child)])
    newSubtreeRoot = parent
  }
  if ( child === getLeft(parent) && parent === getRight(grandparent) ) {
    rotate([grandparent, child, parent], [getLeft(grandparent), getLeft(child), getRight(child), getRight(parent)])
    newSubtreeRoot = child
  }
  if ( child === getRight(parent) && parent === getLeft(grandparent) ) {
    rotate([parent, child, grandparent], [getLeft(parent), getLeft(child), getRight(child), getRight(grandparent)])
    newSubtreeRoot = child
  }
  if ( ! grandparentIsRoot ) {
    if ( grandparentIsLeftChild ) {
      relink(greatgrandparent, newSubtreeRoot, rightOfGreatgrandparent)
    } else {
      relink(greatgrandparent, leftOfGreatgrandparent, newSubtreeRoot)
    }
  }
  display(`### <- restructure, return newSubtreeRoot = ${newSubtreeRoot}, weight = ${weight(newSubtreeRoot)}`)
  return newSubtreeRoot
}

/// +++ ADDITION

/**
 * Main function that adds a node
 * @param subroot root of subtree where the search continues
 * @param newWeight weight of the node to be added
 * @returns true if we are done, no longer concerned about double red; this occurs in one of the following
 *           - a restructure has happened
 *           - a recolor has reached the root, which stays black
 *           - a node with weight = newWeight exists, so no new node
 *           - subroot is the root; for completeness
 *          false if a recoloring opens up the possibility of a double red above
 */
function addNodeRBT(subroot, newWeight) {
    // empty tree, create a new root
    if ( subroot === null || subroot === undefined ) {
        const newNode = addNode()
        label(newNode, newNode)
        display("empty tree, new node =", newNode)
        replaceLeaf(newNode, newWeight)
        makeBlack(newNode)
        return true
    }

    let done
    display(`+++ -> addNodeRBT(${subroot}, ${weight(subroot)}, ${newWeight})`)
    if ( isDummy(subroot) ) {
      const newNode = replaceLeaf(subroot, newWeight)
      display(`added new (red) node`)
      // we replaced the current subroot with a red node, not done
    } else {
      // Note: weights will be equal if we replaced the subroot,
      //  so need to put the check for equality in the else clause
      if ( newWeight < weight(subroot) ) {
        done = addNodeRBT(getLeft(subroot), newWeight)
      } else if ( newWeight > weight(subroot) ) {
        done = addNodeRBT(getRight(subroot), newWeight)
      } else {
        // weights are equal
        display(`A node with weight ${newWeight} already exists`)
        return true
      }
    }

    // the root will always be black, regardless of what happens below
    if ( isRoot(subroot) ) {
        display(`+++ <- addNodeRBT(${subroot}), subroot is the root, return true`)
        return true
    }

    // No recoloring of the subroot means it's safe to return
    if ( done ) {
        display(`+++ <- addNodeRBT(${subroot}): done,  return true`)
        return true
    }

    // Now we have to check for double red involving the subroot and its parent
    //  subroot is red and its parent is also red
    // Subroot must have a parent - we've already handled the case where it is the root
    const parent = getParent(subroot)

    // if either relevant node is black, there may still be a double red above
    if ( isBlack(subroot) || isBlack(parent) ) {
      display(`+++ <- addNodeRBT(${subroot}): subroot is black or has black parent (double red may occur above), return false`)
      return false
    }

    // Now we have a double red - both subroot and its parent are red
    const sibling = getSibling(parent)
    const grandparent = getParent(parent)

    if ( isBlack(sibling) ) {
        // Do a restructure/recolor involving subroot, parent, and grandparent
        //   - see slide 6 of the lecture slides.
        // This is the end of the line - the subroot of the restructured subtree is black
        // Since subtree root may change during restructuring, the grandparent may have a different child.
        // We need to know which child is replaced unless the parent is the root, i.e., has no parent.
        display(`sibling is black, parent = ${parent}, grandparent = ${grandparent}`)
        const newSubroot = restructure(subroot, parent, grandparent)
        makeBlack(newSubroot)
        makeRed(getLeft(newSubroot))
        makeRed(getRight(newSubroot))
        display(`+++ <- addNodeRBT(${subroot}), retructuring has occurred, return true`)
        return true
    }
    // Now we deal with a red sibling
    // - see slide 8
    // Recoloring will turn the parent red, which may cause a double red up the line
    // Note: If parent is the root, it can stay black; this case is dealt with up the line as well
    step(() => {
        makeBlack(parent)
        makeBlack(sibling)
        if ( grandparent !== getRoot() ) {
          makeRed(grandparent)
          display(`+++ <- addNodeRBT(${subroot}), grandparent has turned red, so return false`)
          return false
        } else {
          display(`+++ <- addNodeRBT(${subroot}), grandparent is root, so return true`)
          return true
        }
    })
}

/// +++ END, ADDITION

/// --- REMOVAL

/**
 * @returns true if neither child of the node is a dummy
 */
function hasTwoRealChildren(node) {
  return ! isDummy(getLeft(node)) && ! isDummy(getRight(node))
}
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
 * Deletes a node with weight weightToRemove from the BST rooted at x
 * @param x a subroot of BST, initially the root of the BST
 * @param weightToRemove the weight of the node to remove
 * @returns the node to be removed or undefined if no such node exists;
 *          if the node with weight weightToRemove has two real children, the inorder predecessor is returned;
 *          the returned node will have at most one real child
 */
function findNodeToRemove(subroot, weightToRemove) {
  display(`^^^ -> findNodeToRemove(${subroot}, ${weightToRemove})`)

  // Couldn't find node we are trying to delete, error
  if ( isDummy(subroot) ) {
    display(`Could not find node with weight ${weightToRemove}`);
    return null;
  }

  //Not a leaf, and weight(x) not k, keep searching
  accentNode(subroot);
  if ( weightToRemove < weight(subroot) ) {
    unaccent(subroot)
    return findNodeToRemove(getLeft(subroot), weightToRemove);    
  } else if ( weightToRemove > weight(subroot) ) {
    unaccent(subroot)
    return findNodeToRemove(getRight(subroot), weightToRemove);
  }

  // found the node with the given weight

  if ( ! hasTwoRealChildren(subroot) ) {
    display(`^^^ <- findNodeToRemove, at least one dummy child, subroot = ${subroot}`)
    return subroot;
  }

  // Has two real children, need to replace x with in-order predecessor

  // Find in-order predecessor
  step(() => {
    display("Looking for in-order predecessor")
    color(subroot, "black")
  })
  const predecessor = findInOrderPredecessor(getLeft(subroot));

  // Replace deleted node weight with in-order predecessor weight
  const predWeight = weight(predecessor);
  step(() => {
    setWeight(subroot, predWeight);
    uncolor(subroot)
    color(predecessor, "black");
  })
  display(`^^^ <- returning predecessor ${predecessor} with weight ${predWeight}`)
  return predecessor
}

function getRedChild(node) {
  if ( isRed(getLeft(node)) ) {
    return getLeft(node)
  }
  if ( isRed(getRight(node)) ) {
    return getRight(node)
  }
  return undefined
}

/**
 * Removes the node that has the given weight and adjust coloring and and/or restructure as needed
 * @param root the root of the tree
 * @param weightToRemove weight of the node to be removed
 */
function removeNodeRBT(root, weightToRemove) {
  display(`--- -> removeNodeRBT(${root}, ${weightToRemove})`)
  // first identify the actual node to remove, which may be the one holding the inorder predecessor
  const nodeToRemove = findNodeToRemove(root, weightToRemove)
  // then remove it and iteratively, bottom-up recolor and/or restructure as needed

  // the node to remove has at most one real child,
  //  so identify a dummy child and its sibling, which may or may not be a dummy
  const dummyChild = isDummy(getLeft(nodeToRemove)) ? getLeft(nodeToRemove) : getRight(nodeToRemove)
  const sibling = getSibling(dummyChild)
  display(`dummy child is ${dummyChild}, sibling is ${sibling}`)
  // the sibling will replace the node to be removed so
  //  - make sibling a child of the parent
  //  - delete the node to be removed
  // before we do any deletion and reconnection, we need to know
  //  - whether nodeToRemove is a left or right child of its parent
  //  - the color of nodeToRemove, so we know if to reolor or restructure

  // if the node has no real children we can simply remove it and its dummy children

  if ( isRoot(nodeToRemove) ) {
    if ( isDummy(sibling) ) {
      display("root has two dummy children, tree is now empty")
      deleteNode(nodeToRemove)
      deleteNode(dummyChild)
      deleteNode(sibling)
      display(`--- <- removeNodeRBT`)
      return
    }
    // if the root has a real child we make that the new root
    display(`removing root ${nodeToRemove} with real child ${sibling}`)
    deleteNode(nodeToRemove)
    deleteNode(dummyChild)
    makeBlack(sibling)
    display(`--- <- removeNodeRBT`)
    return
  }

  const parent = getParent(nodeToRemove)
  // before deleting anything, need to remember the state of affairs before deletion
  const leftChild = getLeft(parent)
  const rightChild = getRight(parent)
  const removeLeft = nodeToRemove === leftChild
  const removeRed = isRed(nodeToRemove)
  display(`parent is ${parent}, removeLeft is ${removeLeft}, removeRed is ${removeRed}`)
  deleteNode(nodeToRemove)
  deleteNode(dummyChild)
  addEdge(parent, sibling)
  if ( removeLeft ) {
    setChildren(parent, [sibling, rightChild])
  } else {
    setChildren(parent, [leftChild, sibling])
  }

  // the easy case is if either the removed node or the sibling replacement was/is red
  if ( removeRed || isRed(sibling) ) {
    makeBlack(sibling)
    display(`--- <- removeNodeRBT, made sibling ${sibling} black`)
    return
  }
  remedyDoubleBlack(sibling)
}

function remedyDoubleBlack(node) {
  // The three cases outlined in Goodrich and Tamassia depend on the  sibling of the sibling after the replacement
  const parent = getParent(node)
  const sibling = getSibling(node)
  display(`[[]] -> remedyDoubleBlack, node = ${node}, parent = ${parent}, sibling = ${sibling}`)
  const redChild = getRedChild(sibling)
  // Case 1: newSibling is black and has a red child => restructure
  if ( isBlack(sibling) && redChild !== undefined ) {
    display(`found red child ${redChild}`)
    clearDoubleBlack(node)
    const newParent = restructure(redChild, sibling, parent)
    makeRed(newParent)
    makeBlack(getLeft(newParent))
    makeBlack(getRight(newParent))
    display(`[[]] <- remedyDoubleBlack, sibling was black with a red child`)
    return
  }

  // Case 2: sibling is black and both of its children are black
  //  At this point a black sibling cannot have a red child - that was handled above
  if ( isBlack(sibling) ) {
    clearDoubleBlack(node)
    makeRed(sibling)
    if ( isRed(parent) ) {
      makeBlack(parent)
      display(`[[]] <- remedyDoubleBlack, both children of sibling are black, parent is red`)
      return
    }
    if ( isRoot(parent) ) {
      display(`[[]] <- remedyDoubleBlack, parent is the root`)
      return
    }
    makeDoubleBlack(parent)
    remedyDoubleBlack(parent)
    display(`[[]] <- remedied double black, parent was black`)
    return
  }

  // Case 3: sibling is red
  // Here we need to rotate so that the sibling becomes the new subtree root.
  // It will always be a single rotation, centered on the sibling
  if ( isLeftChild(sibling) ) {
    restructure(getLeft(sibling))
  } else {
    restructure(getRight(sibling))
  }
  makeBlack(sibling)
  makeRed(parent)
  remedyDoubleBlack(node)
  display(`[[]] <- remedied double black, sibling was red`)
}

/// --- END REMOVAL

/**
 * Main loop for adding/deleting nodes in a BST
 */
step(() => {
  setWeightsInside(true)
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
    display(`Deleting node with weight ${-weight}`)
    removeNodeRBT(getRoot(), -weight);  
  } else {
    running = false; 
  }
}

display("The tree is done; the algorithm is finished");
