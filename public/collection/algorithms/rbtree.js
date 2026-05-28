/**
 * Makes the two children the left and right children of the parent, removing any existing edges
 */
function relink(parent, left, right) {
    deleteEdge(parent, getLeft(parent))
    deleteEdge(parent, getRight(parent))
    addEdge(parent, left)
    addEdge(parent, right)
    setChildren(parent, [left, right])
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
    relink(parents[1], parents[0], parents[2])
    relink(parents[0], subtrees[0], subtrees[1])
    relink(parents[2], subtrees[2], subtrees[3])
}

function restructure(child, parent, grandparent) {
    if ( child === getLeft(parent) && parent === getLeft(grandparent) ) {
        rotate([child, parent, grandparent], [getLeft(child), getRight(child), getRight(parent), getRight(grandparent)])
        return parent
    }
    if ( child === getRight(parent) && parent === getRight(grandparent) ) {
        rotate([grandparent, parent, child], [getLeft(grandparent), getLeft(parent), getLeft(child), getRight(child)])
        return parent
    }
    if ( child === getLeft(parent) && parent === getRight(grandparent) ) {
        rotate([grandparent, child, parent], [getLeft(grandparent), getLeft(child), getRight(child), getRight(parent)])
        return parent
    }
    if ( child === getRight(parent) && parent === getLeft(grandparent) ) {
        rotate([parent, child, grandparent], [getLeft(parent), getLeft(child), getRight(child), getRight(grandparent)])
        return parent
    }
}

/**
 * Main function that adds a node
 */
function addNodeRBT(subroot, newWeight) {
    if ( isDummy(subroot) ) {
        // replace subroot with a new red node newNode that has two dummy childen
        return newNode
    }
    let newChildSubroot
    if ( newWeight < weight(subroot) ) {
        newChildSubroot = addNodeRBT(getLeft(subroot), newWeight)
    } else {
        newChildSubroot = addNodeRBT(getRight(subroot), newWeight)
    }
    // if newChildSubroot is black, return the subroot
    // two possibilities
    //   - subroot is still black, so double red is impossible
    //   - subroot has turned red, so any double red will be detected up the line

    // if subroot is the root (re)color it black and return it

    // now we have a double red
    // newChildSubroot is red and subroot is red
    const sibling = sibling(subroot)
    if ( isBlack(sibling) ) {
        // do a restructure/recolor involving newChildSubroot, subroot, and parent(subroot)
        // see slide 6 of the lecture slides
        // then return the root of the restructured subtree
        //  - this skips a level, but the returned node will be black, so no problem
    }
    // now we deal with a red sibling
    // - see slide 8
    // recoloring will turn the parent red, which may cause a double red up the line
    // Note: if parent is the root, it can stay black
}