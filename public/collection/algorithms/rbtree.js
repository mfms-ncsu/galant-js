/**
 * Makes the two children the left and right children of the parent, removing any existing edges
 * @todo make parent a leaf a special case in the rotation functions, of which there need to be several
 */
function relink(parent, left, right) {
    deleteEdge(parent, getLeft(parent))
    deleteEdge(parent, getRight(parent))
    if ( ! isLeaf(parent) ) {
        addEdge(parent, left)
        setChildren(parent, [left, right])
    }
    if ( right !== undefined && right !== null ) {
        addEdge(parent, right)
        setChildren(parent, [left, right])
    }
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

/**
 * Helper to rotate if grandparent doesn't 
 * exist and node is parent's left child
 * @param {*} node node we are rotating around the parent
 * @param {*} parent parent of node
 */
function rotateL(node, parent) {
}

// @todo Create a function that handles all the rotation variations, based on relationships between a node, its parent and its grandparent