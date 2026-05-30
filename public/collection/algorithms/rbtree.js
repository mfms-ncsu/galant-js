// colors used for red and black nodes should not obscure the wieghts. so use lighter versions
const BLACK_COLOR = "gray"
const RED_COLOR = "pink"

function isRoot(node) {
    return getParent(node) === null || getParent(node) === undefined
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
 * Makes the two children the left and right children of the parent, removing any existing edges
 */
function relink(parent, left, right) {
    const leftOfParent = getLeft(parent)
    const rightOfParent = getRight(parent)
    console.log(`-> relink, parent = ${parent}, left = ${left}, right = ${right}, children = [${leftOfParent}, ${rightOfParent}]`)
    removeEdge(parent, leftOfParent)
    removeEdge(parent, rightOfParent)
    addEdge(parent, left)
    addEdge(parent, right)
    setChildren(parent, [left, right])
    console.log("<- relink")
}

/**
 * Performs a rotation based on subtrees and the parents of their roots
 * The end result has parents[1] as root of the final subtree,
 *  parents[0] and parents[2] as its children,
 *  subtrees[0] and subtrees[1] as children of parents[0],
 *  subtrees[2] and subtrees[3] as children of parents[2]
 * @returns the root of the rotated subtree, i.e., parents[1]
 */
function rotate(parents, subtrees) {
    console.log(`-> rotate, [${parents[0]}, ${parents[1]}, ${parents[2]}], [${subtrees[0]}, ${subtrees[1]}, ${subtrees[2]}, ${subtrees[3]}]`)
    relink(parents[1], parents[0], parents[2])
    relink(parents[0], subtrees[0], subtrees[1])
    relink(parents[2], subtrees[2], subtrees[3])
}

function restructure(child, parent, grandparent) {
    console.log(`-> restructure, child weight = ${weight(child)}, parent weight = ${weight(parent)}, grandparent weight = ${weight(grandparent)}`)
    if ( child === getLeft(parent) && parent === getLeft(grandparent) ) {
        rotate([child, parent, grandparent], [getLeft(child), getRight(child), getRight(parent), getRight(grandparent)])
        makeRed(grandparent)
        makeBlack(parent)
        makeRed(child)
        return parent
    }
    if ( child === getRight(parent) && parent === getRight(grandparent) ) {
        rotate([grandparent, parent, child], [getLeft(grandparent), getLeft(parent), getLeft(child), getRight(child)])
        makeRed(grandparent)
        makeBlack(parent)
        makeRed(child)
        return parent
    }
    if ( child === getLeft(parent) && parent === getRight(grandparent) ) {
        rotate([grandparent, child, parent], [getLeft(grandparent), getLeft(child), getRight(child), getRight(parent)])
        makeRed(grandparent)
        makeBlack(child)
        makeRed(parent)
        return parent
    }
    if ( child === getRight(parent) && parent === getLeft(grandparent) ) {
        rotate([parent, child, grandparent], [getLeft(parent), getLeft(child), getRight(child), getRight(grandparent)])
        makeRed(parent)
        makeBlack(child)
        makeRed(grandparent)
        return parent
    }
}

/**
 * Main function that adds a node
 */
function addNodeRBT(subroot, newWeight) {
    // empty tree
    if ( subroot === null || subroot === undefined ) {
        const newNode = addNode()
        console.log("empty tree, new node =", newNode)
        replaceLeaf(newNode, newWeight)
        makeBlack(newNode)
        return newNode
    }
    console.log(`+++++++-> addNodeRBT(${weight(subroot)}, ${newWeight})`)
    if ( isDummy(subroot) ) {
        const newNode = replaceLeaf(subroot, newWeight)
        return newNode
    }
    let newChildSubroot
    if ( newWeight < weight(subroot) ) {
        newChildSubroot = addNodeRBT(getLeft(subroot), newWeight)
    } else {
        newChildSubroot = addNodeRBT(getRight(subroot), newWeight)
    }

    console.log(`weight(newChildSubroot) = ${weight(newChildSubroot)}`)

    // subroot may have turned red during recoloring below
    // it's always safe to make the root black: black depth is still the same for all leaves
    if ( isRoot(subroot) ) {
        makeBlack(subroot)
        return subroot
    }

    // if newChildSubroot is black, return the subroot
    // two possibilities
    //   - subroot is still black, so double red is impossible
    //   - subroot has turned red, so any double red will be detected up the line
    // if subroot is still black it doesn't matter if newChildSubroot is red
    if ( isBlack(newChildSubroot) || isBlack(subroot) ) {
        return subroot
    }

    // now we have a double red
    // newChildSubroot is red and subroot is red
    const sibling = getSibling(subroot)
    if ( isBlack(sibling) ) {
        // do a restructure/recolor involving newChildSubroot, subroot, and parent(subroot)
        // see slide 6 of the lecture slides
        // then return the root of the restructured subtree
        //  - this skips a level, but the returned node will be black, so no problem
        restructure(newChildSubroot, subroot, getParent(subroot))
    }
    else { // sibling is red
        // now we deal with a red sibling
        // - see slide 8
        // recoloring will turn the parent red, which may cause a double red up the line
        // Note: if parent is the root, it can stay black; this case is dealt with up the line as well
        step(() => {
            makeBlack(subroot)
            makeBlack(sibling)
            makeRed(getParent(subroot))
        })
    }
    return subroot
}

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
    console.log(`Root = ${getRoot()}`)
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
