/**
Implementation of red/black trees, as described in the Goodrich, Tamassia and Goldwasser text,
among others. Start with empty.tree or rb-example.tree (for deletion)
 */

// colors used for red and black nodes should not obscure the weights. so use lighter versions
// also use heavy border for black nodes
const BLACK_COLOR = "gray"
const RED_COLOR = "pink"
const HEAVY_BORDER_WIDTH = 7

function accentNode(node) {
  label(node, "V")
}

function unaccent(node) {
  unlabel(node)
}

/**
 * Removes accents from all nodes on the path from node to root
 */
function unaccentPath(node) {
  step(() => {
    while ( node !== undefined && node !== null ) {
      unaccent(node)
      node = getParent(node)
    }
  })
}

function isRoot(node) {
    return getParent(node) === null || getParent(node) === undefined
}

function isLeftChild(node) {
  if ( isRoot(node) ) {
    return undefined
  }
  const parent = getParent(node)
  return getLeft(parent) === node
}

function makeBlack(node) {
  step(() => {
    color(node, BLACK_COLOR)
    setBorderWidth(node, HEAVY_BORDER_WIDTH)
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
  setEdgeWidth(parentEdge, HEAVY_BORDER_WIDTH)
}

function clearDoubleBlack (node) {
  const parentEdge = getEdgeBetween(getParent(node), node)
  clearEdgeWidth(parentEdge)
}

function makeDoubleRed(node) {
  const parentEdge = getEdgeBetween(getParent(node), node)
  step(() => {
    setEdgeWidth(parentEdge, HEAVY_BORDER_WIDTH)
    color(parentEdge, "red")
  })
}

function clearDoubleRed(node) {
  const parentEdge = getEdgeBetween(getParent(node), node)
  step(() => {
    clearEdgeWidth(parentEdge)
    color(parentEdge, "black")
  })
}

/**
 * @returns a new (newly created) dummy node
 */
function createDummy() {
  const dummy = addNode()
  setAttribute(dummy, "dummy", true);
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
  if ( isRoot(node) ) {
    throw new Error(`getSibling called on node with ${node}, weight ${weight(node)}, no parent`);
  }
  const parent = getParent(node);
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
  deleteEdge(node, getRight(node))
  deleteEdge(node, getLeft(node))
}

/**
 * Functions relink(), rotate() and restructure are based on
 * Goodrich, Tamassia and Goldwasser, Sixth Edition, p.478
 */

/**
 * Connects the parent to two children and ensures they are displayed in the correct order
 * Caution: this function is to be used only if neither child is already connected to the parent
 * @param parent the parent to be
 * @param left the left child to be
 * @param right the right child to be
 */
function relink(parent, left, right) {
  console.log(`||| -> relink, parent = ${parent}, left = ${left}, right = ${right}`)
  addEdge(parent, left)
  addEdge(parent, right)
  setChildren(parent, [left, right])
  console.log("||| <- relink")
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
  console.log(`()() -> rotate, [${parents[0]}, ${parents[1]}, ${parents[2]}], [${subtrees[0]}, ${subtrees[1]}, ${subtrees[2]}, ${subtrees[3]}]`)
  // important to remove all edges prior to relinking;
  // otherwise cycles arise or some nodes end up with two parents
  disconnectChildren(parents[0])
  disconnectChildren(parents[1])
  disconnectChildren(parents[2])
  // now reconnect parents and subtrees in the desired order
  relink(parents[1], parents[0], parents[2])
  relink(parents[0], subtrees[0], subtrees[1])
  relink(parents[2], subtrees[2], subtrees[3])
  console.log("()() <- rotate")
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
  // this will be the root of the subtree after restructure
  let newSubtreeRoot
  step(() => {
    console.log(`restructure, node ${weight(child)}, parent ${weight(parent)}, grandparent ${weight(grandparent)}`)

    // If the greatgrandparent exists, need to disconnect before restructuring to avoid confusion
    // Also need to save important information that will get lost after restructure
    const grandparentIsRoot = isRoot(grandparent)
    // the following will be needed only if grandparent is not currently the root
    const greatgrandparent = getParent(grandparent)
    const grandparentIsLeftChild = grandparentIsRoot ? undefined : isLeftChild(grandparent)
    const leftOfGreatgrandparent = grandparentIsRoot ? undefined : getLeft(greatgrandparent)
    const rightOfGreatgrandparent = grandparentIsRoot ? undefined : getRight(greatgrandparent)
    if ( ! grandparentIsRoot ) {
      deleteEdge(greatgrandparent, grandparent)
    }
    if ( child === getLeft(parent) && parent === getLeft(grandparent) ) {
      rotate([child, parent, grandparent], [getLeft(child), getRight(child), getRight(parent), getRight(grandparent)])
      newSubtreeRoot = parent
    }
    else if ( child === getRight(parent) && parent === getRight(grandparent) ) {
      rotate([grandparent, parent, child], [getLeft(grandparent), getLeft(parent), getLeft(child), getRight(child)])
      newSubtreeRoot = parent
    }
    else if ( child === getLeft(parent) && parent === getRight(grandparent) ) {
      rotate([grandparent, child, parent], [getLeft(grandparent), getLeft(child), getRight(child), getRight(parent)])
      newSubtreeRoot = child
    }
    else if ( child === getRight(parent) && parent === getLeft(grandparent) ) {
      rotate([parent, child, grandparent], [getLeft(parent), getLeft(child), getRight(child), getRight(grandparent)])
      newSubtreeRoot = child
    }
    if ( ! grandparentIsRoot ) {
      addEdge(greatgrandparent, newSubtreeRoot)
      if ( grandparentIsLeftChild ) {
        setChildren(greatgrandparent, [newSubtreeRoot, rightOfGreatgrandparent])
      } else {
        setChildren(greatgrandparent, [leftOfGreatgrandparent, newSubtreeRoot])
      }
    }
  })
  return newSubtreeRoot
}

/// +++ ADDITION

/**
 * Main function that adds a node
 * @param subroot root of subtree where the search continues
 * @param newWeight weight of the node to be added
 * First adds a new red node and calls on resolveRed to handle a possible double red
 * unless, of course, the tree is empty, in which case a new black root is created
 */
function addNodeRBT(subroot, newWeight) {
  // empty tree, create a new root
  if ( subroot === null || subroot === undefined ) {
    step(() => {
      const newNode = addNode()
      display("Empty tree, creating a new root")
      replaceLeaf(newNode, newWeight)
      makeBlack(newNode)
    })
    return true
  }

  if ( isDummy(subroot) ) {
    // reached an external leaf
    let newNode
    step(() => {
      newNode = replaceLeaf(subroot, newWeight)
      display(`Added new (red) node, now need to check for and possibly handle double red`)
    })
    resolveRed(newNode)
  } else {
    // otherwise keep looking
    if ( newWeight < weight(subroot) ) {
      addNodeRBT(getLeft(subroot), newWeight)
    } else if ( newWeight > weight(subroot) ) {
      addNodeRBT(getRight(subroot), newWeight)
    } else {
      // weights are equal
      display(`A node with key ${newWeight} already exists`)
    }
  }
}

/**
 * Remedies any potential double red between the node and its parent
 */
function resolveRed(node) {
  const parent = getParent(node)
  // only case we need to handle is a red parent
  if ( isBlack(parent) ) {
    display(`node has black parent, so no double red`)
    return
  }

  // Now we have a double red - both subroot and its parent are red
  const uncle = getSibling(parent)
  step(() => {
    makeDoubleRed(node)
    display(`Double red at node with key ${weight(node)}, uncle with key = ${weight(uncle)}`)
  })

  if ( isBlack(uncle) ) {
    // Do a restructure/recolor involving subroot, parent, and grandparent
    //   - see slide 6 of the lecture slides.
    // This is the end of the line - the subroot of the restructured subtree is black
    // Since subtree root may change during restructuring, the grandparent may have a different child.
    // We need to know which child is replaced unless the parent is the root, i.e., has no parent.
    clearDoubleRed(node)
    display(`black uncle -> restructure and recolor`)
    const newSubroot = restructure(node)
    step(() => {
      makeBlack(newSubroot)
      makeRed(getLeft(newSubroot))
      makeRed(getRight(newSubroot))
      display(`Retructuring and recoloring has occurred, done`)
    })
  } else {
    // Now we deal with a red uncle
    // - see slide 8
    // Recoloring will turn the parent red, which may cause a double red up the line
    // Note: If parent is the root, it can stay black; this case is dealt with up the line as well
    const grandparent = getParent(parent)
    display(`red uncle -> recolor`)
    step(() => {
      makeBlack(parent)
      makeBlack(uncle)
      if ( ! isRoot(grandparent) ) {
        makeRed(grandparent)
        display(`Grandparent has turned red, so not done`)
      } else {
        display(`Grandparent is root, done`)
      }
      clearDoubleRed(node)
    })
    if ( ! isRoot(grandparent) ) {
      resolveRed(grandparent)
    }
  }
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
    currentNode = findInOrderPredecessor(getRight(currentNode));
  }

  // If I have no real right child, I am the predecessor
  step(() => {
    display(`Found predecessor at node with key ${weight(currentNode)}`)
    unaccentPath(currentNode)
  })
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
  step(() => {
    display(`Looking for node with key ${weightToRemove} to remove`)
    accentNode(subroot);
  })

  // Couldn't find node we are trying to delete, error
  if ( isDummy(subroot) ) {
    display(`Could not find node with key ${weightToRemove}`);
    unaccentPath(subroot)
    return null;
  }

  //Not a leaf, and weight(x) not k, keep searching
  if ( weightToRemove < weight(subroot) ) {
    return findNodeToRemove(getLeft(subroot), weightToRemove);    
  } else if ( weightToRemove > weight(subroot) ) {
    return findNodeToRemove(getRight(subroot), weightToRemove);
  }

  // found the node with the given weight

  if ( ! hasTwoRealChildren(subroot) ) {
    step(() => {
      display(`found node to remove, has at least one dummy child, so remove directly`)
     unaccentPath(subroot)
    })
    return subroot;
  }

  // Has two real children, need to replace x with in-order predecessor

  // Find in-order predecessor, remember color of subroot for later
  const subrootWasRed = isRed(subroot)
  step(() => {
    display("Looking for in-order predecessor")
    color(subroot, "black")
  })
  const predecessor = findInOrderPredecessor(getLeft(subroot));

  // Replace deleted node weight with in-order predecessor weight
  const predWeight = weight(predecessor);
  step(() => {
    setWeight(subroot, predWeight);
    if ( subrootWasRed ) {
      makeRed(subroot)
    } else {
      makeBlack(subroot)
    }
    color(predecessor, "black");
  })
  display(`Found predecessor with key ${predWeight}`)
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

function remedyDoubleBlack(node) {
  // The three cases outlined in Goodrich and Tamassia depend on the sibling of the replacement after the replacement
  const parent = getParent(node)
  const sibling = getSibling(node)
  console.log(`[[]] -> remedyDoubleBlack, node = ${node}, parent = ${parent}, sibling = ${sibling}`)
  // Case 1: newSibling is black and has a red child => restructure
  const redChild = getRedChild(sibling)
  if ( isBlack(sibling) && redChild !== undefined ) {
    step(() => {
      display(`Found red child of sibling with key ${weight(redChild)}, so restructure`)
      clearDoubleBlack(node)
    })
    const newParent = restructure(redChild)
    step(() => {
      makeRed(newParent)
      makeBlack(getLeft(newParent))
      makeBlack(getRight(newParent))
    })
    console.log(`[[]] <- remedyDoubleBlack, sibling was black with a red child`)
    return
  }

  // Case 2: sibling is black and both of its children are black
  //  At this point a black sibling cannot have a red child - that was handled above
  if ( isBlack(sibling) ) {
    // information for later; parent will turn black later in this case;
    // the recursive call outside the step should not happen unless parent was black 
    const parentWasRed = isRed(parent)
    step(() => {
      clearDoubleBlack(node)
      makeRed(sibling)
      if ( isRed(parent) ) {
        display(`black sibling and parent is red: make parent black and sibling red`)
        makeBlack(parent)
      }
      else if ( ! isRoot(parent) ) {
        makeDoubleBlack(parent)
        display(`black sibling and parent is neither red nor the root, continue looking to remedy double black`)
      } else {
        display(`black sibling and parent is root, no need to do anything`)
      }
    })
    if ( ! parentWasRed && ! isRoot(parent) ) {
      remedyDoubleBlack(parent)
    }
    console.log(`[[]] <- remedied double black, parent was black`)
    return
  }

  // Case 3: sibling is red
  // Here we need to rotate so that the sibling becomes the new subtree root.
  // It will always be a single rotation, centered on the sibling
  display(`Red sibling: rotate sibling upward and continue looking for double black`)
  step(() => {
    if ( isLeftChild(sibling) ) {
      restructure(getLeft(sibling))
    } else {
      restructure(getRight(sibling))
    }
    makeBlack(sibling)
    makeRed(parent)
  })
  remedyDoubleBlack(node)
  console.log(`[[]] <- remedied double black, sibling was red`)
}

/**
 * Removes the node that has the given weight and adjust coloring and and/or restructure as needed
 * @param root the root of the tree
 * @param weightToRemove weight of the node to be removed
 */
function removeNodeRBT(root, weightToRemove) {
  display(`Removing node with key ${weightToRemove}`)
  // first identify the actual node to remove, which may be the one holding the inorder predecessor
  const nodeToRemove = findNodeToRemove(root, weightToRemove)
  if ( nodeToRemove === null ) {
    display(`no node with key ${weightToRemove} exists in the tree`)
    return
  }

  // then remove it and iteratively, bottom-up recolor and/or restructure as needed

  // the node to remove has at most one real child,
  //  so identify a dummy child and its sibling, which may or may not be a dummy
  const dummyChild = isDummy(getLeft(nodeToRemove)) ? getLeft(nodeToRemove) : getRight(nodeToRemove)
  const replacement = getSibling(dummyChild)
//  display(`dummy child is ${dummyChild}, sibling is ${sibling}`)
  // the replacement will replace the node to be removed so
  //  - make replacement a child of the parent
  //  - delete the node to be removed
  // before we do any deletion and reconnection, we need to know
  //  - whether nodeToRemove is a left or right child of its parent
  //  - the color of nodeToRemove, so we know if to reolor or restructure


  // if the removed node was the root
  //   - it's the only non-dummy node, so the tree is now empty 
  if ( isRoot(nodeToRemove) ) {
    if ( isDummy(replacement) ) {
      step(() => {
        display("root has two dummy children, tree is now empty")
        deleteNode(nodeToRemove)
        deleteNode(dummyChild)
        deleteNode(replacement)
      })
      return
    }
    // if the root has a real child we make that the new root
    // and color it black
    // black height property is preserved because there is no other branch
    step(() => {
      display(`Replacing root with node that has key ${weight(sibling)}`)
      deleteNode(nodeToRemove)
      deleteNode(dummyChild)
      makeBlack(replacement)
    })
    return
  }

  const parent = getParent(nodeToRemove)
  // before deleting anything, need to remember the state of affairs before deletion
  const leftChild = getLeft(parent)
  const rightChild = getRight(parent)
  const removedLeft = nodeToRemove === leftChild
  step(() => {
    display(`Replacing deleted node with node that has key ${weight(replacement)}`)
    deleteNode(nodeToRemove)
    deleteNode(dummyChild)
    addEdge(parent, replacement)
    if ( removedLeft ) {
      setChildren(parent, [replacement, rightChild])
    } else {
      setChildren(parent, [leftChild, replacement])
    }
  })

  // one easy case is if the replacememt is red
  if ( isRed(replacement) ) {
    step(() => {
      display(`Easy case: replacement is red, so make it black`)
      makeBlack(replacement)
    })
    return
  }

  const sibling = getSibling(replacement)

  // if sibling is a dummy its subtree has black depth 1
  // this means the replacement subtree will have black depth at least that  
  if ( isDummy(sibling) ) {
    display(`replacement is black and its sibling is a dummy, no need to do anything`)
    return
  }

  // if sibling is red and has a dummy child its subtree has black depth 1
  // note: if either child is dummy, the other must be as well
  if ( isRed(sibling) && isDummy(getLeft(sibling)) ) {
    display(`replacement is black, its sibling is red and has a dummy child, no need to do anything`)
    return
  }

  step(() => {
    display(`Double black situation, need to fix`)
    makeDoubleBlack(replacement)
  })
  remedyDoubleBlack(replacement)
}

/// --- END REMOVAL

/**
 * Main loop for adding/deleting nodes in a BST
 */
step(() => {
  setWeightsInside(true)
  setDirected(true)
  clearNodeLabels()
})
let running = true;
display("Red/black tree animation. To add nodes, give positive numbers; to remove, negative and to stop 0")
while ( running ) {
  const weight = promptNumber("Add (> 0), remove (< 0) or stop (0)")
  if (weight > 0) {
    display(`Adding node with key ${weight}`)
    addNodeRBT(getRoot(), weight);
  } else if (weight < 0) {
    display(`Deleting node with key ${-weight}`)
    removeNodeRBT(getRoot(), -weight);  
  } else {
    running = false; 
  }
}

display("The tree is done; the algorithm is finished");
