/**
 * Red-Black TreeBuilder algorithm that prompts the user to add or remove nodes until user says to stop
 * Created by Garrett Brazawski ( gmbrazaw@ncsu.edu )
 * 
 * The user will be asked to give a positive integer to put in the tree.
 * This will create a new node with that weight and update the tree.
 * If the user puts in a negative integer, the program will try and 
 * remove the node with the positive value of that weight.
 */


setDirected(true);
let visit = 1;

// this should be added to Thread.js and TreeInterface.js
function isRoot(node) {
  return (inDegree(node) === 0);
}

// this should be added to Thread.js and TreeInterface.js
function numChildren( node ) {
  return outDegree( node );
}

// this should be added to Thread.js and TreeInterface.js
function getSibling( node ) {
  const p = getParent( node );

  // If the left child of the parent is the node, return the right child 
  // of the parent which would be the sibling of node
  // else return the left child which would be node's sibling
  return getLeft( p ) === node ? getRight( p ) : getLeft( p );
}

function cleanTree(){
  step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    clearEdgeHighlights();
    clearEdgeColors();
    hideAllNodeLabels();
    hideAllNodeWeights();
    for ( const node of getNodes() ) {
      setAttribute(node, "weightInNode", true);
    }
  });
}

function addLeftInsideWeight(nodeId, w) {
  const newNode = addLeft(nodeId, w);
  setAttribute(newNode, "weightInNode", true);
  hideWeight(newNode);
  return newNode;
}

function addRightInsideWeight(nodeId, w) {
  const newNode = addRight(nodeId, w);
  setAttribute(newNode, "weightInNode", true);
  hideWeight(newNode);
  return newNode;
}

// used when adding the root node
function addNodeInsideWeight(w) {
  const newNode = addNode(0, w);
  setAttribute(newNode, "weightInNode", true);
  hideWeight(newNode);
  return newNode;
}

// Will make a node a dummy
function dummify( nodeId ) {
  step(() => {
    setAttribute(nodeId, "dummy", true);
    setAttribute(nodeId, "weight", undefined);
    if ( numChildren( nodeId ) > 0 ){
      for ( const child of getChildren( nodeId ) ) {
        deleteNode(child);
      }
    }
  });
  return nodeId;
}

// **********************
// RED BLACK TREE METHODS
// **********************

function isInternal( node ) {
	return numChildren( node ) > 0;
}

/**
 * Returns true if the given position is black (it's property = 0)
 * 
 * @param p the position for which to determine if the color is black
 * @return true if the position's property/color is black
 */
function isBlack( node ) {
  // First we need to check if it is a dummy, 
  // if it is it should have a grey border but be black
  if ( isLeaf( node ) ) {
    return true;
  }

  return getAttribute( node, "borderColor" ) === "black";
}

/**
 * Returns true if the given position is red (it's property = 1)
 * 
 * @param p the position for which to determine if the color is red
 * @return true if the position's property/color is red
 */
function isRed( node ) {
  // First we need to check if it is a dummy, 
  // if it is it should have a grey border but be black ( never red )
  if ( isLeaf( node ) ) {
    return false;
  }

  return getAttribute( node, "borderColor" ) === "red";
}

/**
 * Set the color of the given position to be black (property = 0)
 * 
 * @param p the position for which to make black
 */
function makeBlack( node ) {
  // setAttribute( borderColor( "black" ) ) // Something like this
  step(() => {
    setBorderWidth( node, 5 );
    setAttribute( node, "borderColor", "black" );
  });
  // color( node, "black" );
  return;
}

/**
 * Set the color of the given position to be red (property = 1)
 * 
 * @param node the position for which to make red
 */
function makeRed( node ) {
  // setAttribute( borderColor( "red" ) ) // Something like this
  step(() => {
    setBorderWidth( node, 5 );
    setAttribute( node, "borderColor", "red" );
  });
  // color( node, "red" );
  return;
}

/**
 * Relink two nodes to create a parent-child relationship
 * 
 * @param parentN       the node that will become the parent
 * @param child         the current left or right child node to be relinked
 * @param makeLeftChild indicates whether the new child should be a left child
 *                      (true) or not (false)
 * @param dummy         true if the child should be a dummy
 * @param w             the weight of the child
 * @param color         the color of the child
 */
function relink(parentN, child, makeLeftChild, dummy, w, color) {
  // Check if the child should be a dummy; if so, just remove it 
  if ( dummy ) {
    // Remove the child
    deleteNode(child);
    display(`Removed dummy node during relink operation`);
    return;
  } else {
    // Grab the new other node
    let node = undefined;

    if ( makeLeftChild ) {
      // Grab the left child to change
      node = getLeft(parentN);
    } else {
      // Grab the right child to change
      node = getRight(parentN);
    }

    // Grab the grandchildren of the parent to be
    const childLeft = getLeft(child);
    const childRight = getRight(child);

    // Undummify
    setAttribute(node, 'dummy', false);
    highlight(node);
    setWeight(node, w);
    setAttribute(node, 'borderColor', color);

    // Remove the child - the grandchildren will be added as chikdren of the new node
    deleteNode(child);

    // Add grandchildren back onto new node
    if ( childLeft != undefined && childRight != undefined ) {
      addEdge(node, childLeft);
      addEdge(node, childRight);
    }
  }
}

/**
 * Helper to rotate, rotates if grandparent doesn't 
 * exist and node is parents left child
 * @param {*} node node we are rotating around the parent
 * @param {*} parentN parent of node
 */
function rotateL(node, parentN) {
  // Assuming all aren't null
  // Grab all nodes involved; don't need the left child
  let parentRight = getRight( parentN );
  let nodeLeft = getLeft( node );
  let nodeRight = getRight( node );

  // For this rotate, we grab nodeRight's children ( since we delete nodeRight )
  let nodeRightLeft = getLeft( nodeRight );
  let nodeRightRight = getRight( nodeRight );

  // Grab other node child weight and color
  let nodeChildOtherIsDummy = getAttribute( nodeLeft, "dummy" );
  const nodeLeftWeight = weight( nodeLeft );
  const nodeLeftColor = getAttribute( nodeLeft, 'borderColor' );

  // Grab other parent child weight and color
  let parentChildOtherIsDummy = getAttribute( parentRight, "dummy" );
  const parentRightWeight = weight( parentRight );
  const parentRightColor = getAttribute( parentRight, 'borderColor' );

  // Remove nodeRight
  let nodeChildIsDummy = getAttribute( nodeRight, "dummy" );
  const nodeRightWeight = weight( nodeRight );
  const nodeRightColor = getAttribute( nodeRight, 'borderColor' );
  deleteNode( nodeRight );

  // Remove node ( it will become the root )
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Make node the root
  let newNode = addNodeInsideWeight(nodeWeight);
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add original parent as right child of the new root
  let newParent = addRightInsideWeight( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add original right child as left child of the new root
  let newNodeRight = addLeftInsideWeight( newParent, nodeRightWeight );
  if ( nodeChildIsDummy ) {
    dummify( newNodeRight );
  } else {
    setAttribute( newNodeRight, 'borderColor', nodeRightColor );
  }

  // Add all the edges back ( relink )
  relink( newNode, nodeLeft, true, nodeChildOtherIsDummy, nodeLeftWeight, nodeLeftColor );
  relink( newParent, parentRight, false, parentChildOtherIsDummy, parentRightWeight, parentRightColor );

  // Check for no children off of nodeRight
  if ( nodeRightLeft != undefined && nodeRightRight != undefined ) {
    addEdge( newNodeRight, nodeRightLeft );
    addEdge( newNodeRight, nodeRightRight );
  }

  return newNode;
}

/**
 * Helper to rotate, rotates if grandparent doesn't 
 * exist and node is parents right child
 * @param {*} node node we are rotating around the parent
 * @param {*} parentN parent of node
 */
function rotateR( node, parentN ) {
  // Assuming all arent null
  // Grab all nodes involved: dont' need the right child
  let parentLeft = getLeft( parentN );
  let nodeLeft = getLeft( node );
  let nodeRight = getRight( node );

  // For this rotate, we grab nodeLeft's children ( since we delete nodeLeft )
  let nodeLeftLeft = getLeft( nodeLeft );
  let nodeLeftRight = getRight( nodeLeft );

  // Grab other node child weight and color
  let nodeChildOtherIsDummy = getAttribute( nodeRight, "dummy" );
  const nodeRightWeight = weight( nodeRight );
  const nodeRightColor = getAttribute( nodeRight, 'borderColor' );

  // Grab other parent child weight and color
  let parentChildOtherIsDummy = getAttribute( parentLeft, "dummy" );
  const parentLeftWeight = weight( parentLeft );
  const parentLeftColor = getAttribute( parentLeft, 'borderColor' );

  // Remove nodeLeft
  let nodeChildIsDummy = getAttribute( nodeLeft, "dummy" );
  const nodeLeftWeight = weight( nodeLeft );
  const nodeLeftColor = getAttribute( nodeLeft, 'borderColor' );
  deleteNode( nodeLeft );

  // Remove node ( it will become the root )
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Make node the root
  let newNode = addNodeInsideWeight(nodeWeight);
  setAttribute( newNode, 'borderColor', nodeColor );

  // Make original parent left child of new root
  let newParent = addLeftInsideWeight( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Make original left child the right child of new root
  let newNodeLeft = addRightInsideWeight( newParent, nodeLeftWeight );
  if ( nodeChildIsDummy ) {
    dummify( newNodeLeft );
  } else {
    setAttribute( newNodeLeft, 'borderColor', nodeLeftColor );
  }

  // Add all the edges back ( relink )
  relink( newNode, nodeRight, false, nodeChildOtherIsDummy, nodeRightWeight, nodeRightColor );
  relink( newParent, parentLeft, true, parentChildOtherIsDummy, parentLeftWeight, parentLeftColor );

  // Check for no children off of nodeLeft
  if ( nodeLeftLeft != undefined && nodeLeftRight != undefined ) {
    addEdge( newNodeLeft, nodeLeftLeft );
    addEdge( newNodeLeft, nodeLeftRight );
  }

  return newNode;
}

/**
 * Helper to rotate, rotates if node layout is left -> left
 * @param {*} node node we are rotating around the parent
 * @param {*} parentN parent of node
 * @param {*} grandparent grandparent of node ( parent of parentN )
 */
function rotateLL( node, parentN, grandparent ) {
  // Assuming all arent null
  // Grab all nodes involved
  let grandparentLeft = getLeft( grandparent );
  let grandparentRight = getRight( grandparent );
  let parentLeft = getLeft( parentN );
  let parentRight = getRight( parentN );
  let nodeLeft = getLeft( node );
  let nodeRight = getRight( node );

  // For this rotate, we grab nodeRight's children ( since we delete nodeRight )
  let nodeRightLeft = getLeft( nodeRight );
  let nodeRightRight = getRight( nodeRight );

  // Grab other node child weight and color
  let nodeChildOtherIsDummy = getAttribute( nodeLeft, "dummy" );
  const nodeLeftWeight = weight( nodeLeft );
  const nodeLeftColor = getAttribute( nodeLeft, 'borderColor' );

  // Grab other parent child weight and color
  let parentChildOtherIsDummy = getAttribute( parentRight, "dummy" );
  const parentRightWeight = weight( parentRight );
  const parentRightColor = getAttribute( parentRight, 'borderColor' );

  // Grab other grandparent child weight and color
  let grandparentChildOtherIsDummy = getAttribute( grandparentRight, "dummy" );
  const grandparentRightWeight = weight( grandparentRight );
  const grandparentRightColor = getAttribute( grandparentRight, 'borderColor' );

  // Remove nodeRight
  let nodeChildIsDummy = getAttribute( nodeRight, "dummy" );
  const nodeRightWeight = weight( nodeRight );
  const nodeRightColor = getAttribute( nodeRight, 'borderColor' );
  deleteNode( nodeRight );

  // Remove node
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Grab and remove any updated edges
  deleteEdge( getEdgeBetween( grandparent, grandparentRight ) );

  // Add node back onto grandparent
  let newNode = addLeftInsideWeight( grandparent, nodeWeight );
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add parent back onto node
  let newParent = addRightInsideWeight( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add nodeRight back onto parent
  let newNodeRight = addLeftInsideWeight( newParent, nodeRightWeight );
  if ( nodeChildIsDummy ) {
    dummify( newNodeRight );
  } else {
    setAttribute( newNodeRight, 'borderColor', nodeRightColor );
  }

  // Add all the edges back ( relink )
  relink( grandparent, grandparentRight, false, grandparentChildOtherIsDummy, grandparentRightWeight, grandparentRightColor );
  relink( newNode, nodeLeft, true, nodeChildOtherIsDummy, nodeLeftWeight, nodeLeftColor );
  relink( newParent, parentRight, false, parentChildOtherIsDummy, parentRightWeight, parentRightColor );

  // Check for no children off of nodeRight
  if ( nodeRightLeft != undefined && nodeRightRight != undefined ) {
    addEdge( newNodeRight, nodeRightLeft );
    addEdge( newNodeRight, nodeRightRight );
  }

  return newNode;
}

/**
 * Helper to rotate, rotates if node layout is right -> right
 * @param {*} node node we are rotating around the parent
 * @param {*} parentN parent of node
 * @param {*} grandparent grandparent of node ( parent of parentN )
 */
function rotateRR( node, parentN, grandparent ) {
  // Assuming all arent null
  // Grab all nodes involved
  let grandparentLeft = getLeft( grandparent );
  let grandparentRight = getRight( grandparent );
  let parentLeft = getLeft( parentN );
  let parentRight = getRight( parentN );
  let nodeLeft = getLeft( node );
  let nodeRight = getRight( node );

  // For this rotate, we grab nodeLeft's children ( since we delete nodeLeft )
  let nodeLeftLeft = getLeft( nodeLeft );
  let nodeLeftRight = getRight( nodeLeft );

  // Grab other node child weight and color
  let nodeChildOtherIsDummy = getAttribute( nodeRight, "dummy" );
  const nodeRightWeight = weight( nodeRight );
  const nodeRightColor = getAttribute( nodeRight, 'borderColor' );

  // Grab other parent child weight and color
  let parentChildOtherIsDummy = getAttribute( parentLeft, "dummy" );
  const parentLeftWeight = weight( parentLeft );
  const parentLeftColor = getAttribute( parentLeft, 'borderColor' );

  // Grab other grandparent child weight and color
  let grandparentChildOtherIsDummy = getAttribute( grandparentLeft, "dummy" );
  const grandparentLeftWeight = weight( grandparentLeft );
  const grandparentLeftColor = getAttribute( grandparentLeft, 'borderColor' );

  // Remove nodeLeft
  let nodeChildIsDummy = getAttribute( nodeLeft, "dummy" );
  const nodeLeftWeight = weight( nodeLeft );
  const nodeLeftColor = getAttribute( nodeLeft, 'borderColor' );
  deleteNode( nodeLeft );

  // Remove node
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Grab and remove any updated edges
  deleteEdge( getEdgeBetween( grandparent, grandparentLeft ) );

  // Add node back onto grandparent
  let newNode = addRightInsideWeight( grandparent, nodeWeight );
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add parent back onto node
  let newParent = addLeftInsideWeight( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add nodeLeft back onto parent
  let newNodeLeft = addRightInsideWeight( newParent, nodeLeftWeight );
  if ( nodeChildIsDummy ) {
    dummify( newNodeLeft );
  } else {
    setAttribute( newNodeLeft, 'borderColor', nodeLeftColor );
  }

  // Add all the edges back ( relink )
  relink( grandparent, grandparentLeft, true, grandparentChildOtherIsDummy, grandparentLeftWeight, grandparentLeftColor );
  relink( newNode, nodeRight, false, nodeChildOtherIsDummy, nodeRightWeight, nodeRightColor );
  relink( newParent, parentLeft, true, parentChildOtherIsDummy, parentLeftWeight, parentLeftColor );

  // Check for no children off of nodeLeft
  if ( nodeLeftLeft != undefined && nodeLeftRight != undefined ) {
    addEdge( newNodeLeft, nodeLeftLeft );
    addEdge( newNodeLeft, nodeLeftRight );
  }

  return newNode;
}

/**
 * Helper to rotate, rotates if node layout is left -> right
 * @param {*} node node we are rotating around the parent
 * @param {*} parentN parent of node
 * @param {*} grandparent grandparent of node ( parent of parentN )
 */
function rotateLR( node, parentN, grandparent ) {
  // Assuming all arent null
  // Grab all nodes involved
  let grandparentLeft = getLeft( grandparent );
  let grandparentRight = getRight( grandparent );
  let parentLeft = getLeft( parentN );
  let parentRight = getRight( parentN );
  let nodeLeft = getLeft( node );
  let nodeRight = getRight( node );

  // For this rotate, we grab nodeLeft's children ( since we delete nodeLeft )
  let nodeLeftLeft = getLeft( nodeLeft );
  let nodeLeftRight = getRight( nodeLeft );

  // Grab other node child weight and color
  let nodeChildOtherIsDummy = getAttribute( nodeRight, "dummy" );
  const nodeRightWeight = weight( nodeRight );
  const nodeRightColor = getAttribute( nodeRight, 'borderColor' );

  // Grab other parent child weight and color
  let parentChildOtherIsDummy = getAttribute( parentLeft, "dummy" );
  const parentLeftWeight = weight( parentLeft );
  const parentLeftColor = getAttribute( parentLeft, 'borderColor' );

  // Grab other grandparent child weight and color
  let grandparentChildOtherIsDummy = getAttribute( grandparentRight, "dummy" );
  const grandparentRightWeight = weight( grandparentRight );
  const grandparentRightColor = getAttribute( grandparentRight, 'borderColor' );
  
  // Remove nodeLeft
  let nodeChildIsDummy = getAttribute( nodeLeft, "dummy" );
  const nodeLeftWeight = weight( nodeLeft );
  const nodeLeftColor = getAttribute( nodeLeft, 'borderColor' );
  deleteNode( nodeLeft );

  // Remove node
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Grab and remove any updated edges
  deleteEdge( getEdgeBetween( grandparent, grandparentRight ) );

  // Add node back onto grandparent
  let newNode = addLeftInsideWeight( grandparent, nodeWeight );
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add parent back onto node
  let newParent = addLeftInsideWeight( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add nodeLeft back onto parent
  let newNodeLeft = addRightInsideWeight( newParent, nodeLeftWeight );
  if ( nodeChildIsDummy ) {
    dummify( newNodeLeft );
  } else {
    setAttribute( newNodeLeft, 'borderColor', nodeLeftColor );
  }

  // Add all the edges back ( relink )
  relink( grandparent, grandparentRight, false, grandparentChildOtherIsDummy, grandparentRightWeight, grandparentRightColor );
  relink( newNode, nodeRight, false, nodeChildOtherIsDummy, nodeRightWeight, nodeRightColor );
  relink( newParent, parentLeft, true, parentChildOtherIsDummy, parentLeftWeight, parentLeftColor );

  // Check for no children off of nodeLeft
  if ( nodeLeftLeft != undefined && nodeLeftRight != undefined ) {
    addEdge( newNodeLeft, nodeLeftLeft );
    addEdge( newNodeLeft, nodeLeftRight );
  }

  return newNode;
}

/**
 * Helper to rotate, rotates if node layout is right -> left
 * @param {*} node node we are rotating around the parent
 * @param {*} parentN parent of node
 * @param {*} grandparent grandparent of node ( parent of parentN )
 */
function rotateRL( node, parentN, grandparent ) {
  // Assuming all arent null
  // Grab all nodes involved
  let grandparentLeft = getLeft( grandparent );
  let grandparentRight = getRight( grandparent );
  let parentLeft = getLeft( parentN );
  let parentRight = getRight( parentN );
  let nodeLeft = getLeft( node );
  let nodeRight = getRight( node );

  // For this rotate, we grab nodeRight's children ( since we delete nodeRight )
  let nodeRightLeft = getLeft( nodeRight );
  let nodeRightRight = getRight( nodeRight );

  // Grab other node child weight and color
  let nodeChildOtherIsDummy = getAttribute( nodeLeft, "dummy" );
  const nodeLeftWeight = weight( nodeLeft );
  const nodeLeftColor = getAttribute( nodeLeft, 'borderColor' );

  // Grab other parent child weight and color
  let parentChildOtherIsDummy = getAttribute( parentRight, "dummy" );
  const parentRightWeight = weight( parentRight );
  const parentRightColor = getAttribute( parentRight, 'borderColor' );

  // Grab other grandparent child weight and color
  let grandparentChildOtherIsDummy = getAttribute( grandparentLeft, "dummy" );
  const grandparentLeftWeight = weight( grandparentLeft );
  const grandparentLeftColor = getAttribute( grandparentLeft, 'borderColor' );

  // Remove nodeRight
  let nodeChildIsDummy = getAttribute( nodeRight, "dummy" );
  const nodeRightWeight = weight( nodeRight );
  const nodeRightColor = getAttribute( nodeRight, 'borderColor' );
  deleteNode( nodeRight );

  // Remove node
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Grab and remove any updated edges
  deleteEdge( getEdgeBetween( grandparent, grandparentLeft ) );

  

  // Add node back onto grandparent
  let newNode = addRightInsideWeight( grandparent, nodeWeight );
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add parent back onto node
  let newParent = addRightInsideWeight( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add nodeRight back onto parent
  let newNodeRight = addLeftInsideWeight( newParent, nodeRightWeight );
  if ( nodeChildIsDummy ) {
    dummify( newNodeRight );
  } else {
    setAttribute( newNodeRight, 'borderColor', nodeRightColor );
  }

  // Add all the edges back ( relink )
  relink( grandparent, grandparentLeft, true, grandparentChildOtherIsDummy, grandparentLeftWeight, grandparentLeftColor );
  relink( newNode, nodeLeft, true, nodeChildOtherIsDummy,nodeLeftWeight, nodeLeftColor );
  relink( newParent, parentRight, false, parentChildOtherIsDummy, parentRightWeight, parentRightColor );

  // Check for no children off of nodeRight
  if ( nodeRightLeft != undefined && nodeRightRight != undefined ) {
    addEdge( newNodeRight, nodeRightLeft );
    addEdge( newNodeRight, nodeRightRight );
  }

  return newNode;
}

/**
 * Performs a single rotation of a position, p, around it's parent. If
 * necessary, the grandparent must be updated to now refer to p as its child; p
 * must be updated to indicate its parent is now its child
 * 
 * @param node the position to rotate around its parent
 * @returns the updated node ID
 */
function rotate( node ) {

  let parentN = getParent( node );
  let grandparent = getParent( parentN );

  display(`Rotate: We will rotate node '${node}' around its parent '${parentN}'...`);

  // Will be used to update the node IDs that were updated
  let newNodeId = undefined;

  step(() => {

    // Get all nodes involved
    //let grandparentParent = getParent( grandparent );
    let grandparentLeft = null;
    let grandparentRight = null;
    let parentLeft = getLeft( parentN );
    let parentRight = getRight( parentN );
    let nodeLeft = getLeft( node );
    let nodeRight = getRight( node );

    if ( grandparent != undefined ) {
      // Update the children
      grandparentLeft = getLeft( grandparent );
      grandparentRight = getRight( grandparent );
    }

    // Now check and rotate nodes
    if ( grandparent === undefined ) {
      if ( node === parentLeft ) {
        // Preform a Left rotate ( make node the root )
        newNodeId = rotateL( node, parentN );
      } else {
        // Preform a Right rotate ( make node the root )
        newNodeId = rotateR( node, parentN );
      }
    } else if ( parentN === grandparentLeft ) {
      if ( node === parentLeft ) {
        // Preform a Left -> Left rotate
        newNodeId = rotateLL( node, parentN, grandparent );
      } else {
        // Preform a Left -> Right rotate
        newNodeId = rotateLR( node, parentN, grandparent );
      }
    }
    else {
      if ( node === parentLeft ) {
        // Preform a Right -> Left rotate
        newNodeId = rotateRL( node, parentN, grandparent );
      } else {
        // Preform a Right -> Right rotate
        newNodeId = rotateRR( node, parentN, grandparent );
      }
    }
    });

  return newNodeId;

}

/**
 * Performs a trinode restructuring and returns the position at its final,
 * rotated position.
 * 
 * @param node the position that represents x in a trinode restructuring of x, its
 *          parent y, and its grandparent z
 * @return the position at its final, rotated position
 */
function restructure( node ) {

  let parentN = getParent( node );
  let grandparent = getParent( parentN );

  step(() => {
    // for some reason only the grandparent gets marked
    // the other nodes end up getting deleted and replaced later
    // but it's not clear why they're not getting marked here
    console.log("restructuring", node, parentN, grandparent);
    mark(node);
    mark(parentN);
    mark(grandparent);
  });

  if ( (node === getLeft( parentN ) && parentN === getLeft( grandparent ) ) || 
      ( node === getRight( parentN ) && parentN === getRight( grandparent ) ) ) {
      // rotate the parent around the grandparent
      display(`Restructure: If the parent ('${parentN}') is the same side child as node ('${node}') is to parent...`);
      display(`...then we rotate the parent ('${parentN}') around the grandparent ('${grandparent}')`);
      const newParentID = rotate( parentN );
      // step(() => {
      //   unmark(node);
      //   unmark(parentN);
      //   unmark(grandparent);
      // });
      return newParentID;
  } else {
      // rotate the node around the parent twice
      display(`Restructure: If the parent ('${parentN}') is not the same side child as node ('${node}') is to parent...`);
      display(`...then we rotate the node ('${node}') around the parent ('${parentN}') twice`);
      const newNodeID = rotate( node );
      const newNodeID2 = rotate( newNodeID );
      // step(() => {
      //   unmark(node);
      //   unmark(parentN);
      //   unmark(grandparent);
      // });
      return newNodeID2;
  }
}

// *******************
// Tree Action Methods
// *******************

/**
 * Resolves a double-red condition in a red-black tree where a red position has
 * a red child
 * 
 * @param node the position that may have a red parent
 */
function resolveRed( node ) {

  display(`We check the Red Property`)

  let parentN = getParent( node );

  if ( isRed( parentN ) ) {

    display(`We violate the Red Property with a red parent!`)

    let uncle = getSibling( parentN );
    // CASE 1: the uncle (sibling of the parent) is black
    if ( isBlack( uncle ) ) {
      display(`CASE 1: The uncle ('${uncle}') (sibling of the parent) is black`);
      // Restructure and re-color children
      display(`So we preform trinode restructuring on the node, parent, and grandparent`);
      let middle = restructure( node );
      display(`Then we make the middle node (new parent) black and the two children red`);
      makeBlack( middle );
      makeRed( getLeft( middle ) );
      makeRed( getRight( middle ) );
    } else {
      // CASE 2: the uncle (sibling of the parent) is red
      display(`CASE 2: The uncle ('${uncle}') (sibling of the parent) is red`);
      display(`So we make the parent node ('${parentN}') and uncle ('${uncle}') black`);
      makeBlack( parentN );
      makeBlack( uncle );
      let grandparent = getParent( parentN );
      display(`Then if the grandparent ('${grandparent}') isn't a root, make it red...`);
      if ( !isRoot( grandparent ) ) {
        makeRed( grandparent );
        display(`... and propogate the Red Property check up`);
        resolveRed( grandparent );
      }
    }
  } else {
    display(`We have a black parent so we satisfy the Red Property`)
  }
}

/**
 * Resolves the double-black condition where the black-depths of the sentinel
 * leaves are no longer equal.
 * 
 * @param p the position at which the double-black condition is located
 */
function remedyDoubleBlack( node ) {

  let parentN = getParent( node );
  let sibling = getSibling( node );
  
  if ( isBlack( sibling ) ) {
    // CASE 1: trinode restructuring
    if ( isRed( getLeft( sibling ) ) || isRed( getRight( sibling ) ) ) {
      let temp = null;
      if ( isRed( getLeft( sibling ) ) ) {
        temp = getLeft( sibling );
      } else {
        temp = getRight( sibling );
      }

      // Updated for restructure
      const isRedParent = isRed( parentN );

      let middle = restructure( temp );
      if ( isRedParent ) {
        makeRed( middle );
      } else {
        makeBlack( middle );
      }
      makeBlack( getLeft( middle ) );
      makeBlack( getRight( middle ) );
    } else {
      // CASE 2: recoloring
      makeRed( sibling );
      if ( isRed( parentN ) ) {
        makeBlack( parentN );
      } else if ( !isRoot( parentN ) ) {
        remedyDoubleBlack( parentN );
      }
    }
  } else {
    // CASE 3: Rotate
    // Need to check for updated node after rotate
    // So change colors before we rotate to make things easier
    makeBlack( sibling );
    makeRed( parentN );

    let isSiblingLeftChild = ( sibling === getLeft( parentN ) );
    let newSibling = rotate( sibling );
    let newNode = undefined;

    // Grab new node after rotate
    if ( isSiblingLeftChild ) {
      newNode = getRight( getRight( newSibling ) );
    } else {
      newNode = getLeft( getLeft( newSibling ) );
    }

    // Update with new node
    remedyDoubleBlack( newNode );
  }


}

//-----------------UNIQUE BST FNS-------------------

// Call this on the left child of the subtree root
function findInOrderPredecessor(currentNode) {
  mark(currentNode)
  if ( getAttribute(getRight(currentNode), "dummy") ) {
    display(`No real right child, so predecessor is '${weight(currentNode)}'`)
    return currentNode
  }
  // If a real right child exists, recur
  unmark(currentNode)
  return findInOrderPredecessor(getRight(currentNode));
}

/**
 * To preserve the property of having all sentinel leaves, expandLeaf converts a
 * sentinel leaf into a position with an entry, then adds two new sentinel
 * children to the position
 * 
 * @param sentinel the dummy node to be replaced
 * @param weight   the weight of the replacement node
 */
function expandLeaf(sentinel, weight) {
    // This method is used to add dummy/sentinel left and right children as leaves
    // initially, dum is a dummy/sentinel node,
    // so replace the null entry with the new actual entry
  let newNode = set(sentinel, weight);
  step(() =>{
    display(`Add sentinel leaves to keep Leaf Property!`);
    dummify(addLeft( newNode, undefined ));
  });
}

/**
 * Adds a new node with the given weight to the tree
 * 
 * @param w the weight of the new node
 * @returns true if the node was added, false if a node with the same weight exists
 */
function put(w) {
    const newNode = lookUp(getRoot(), w);

    // if there is no root, add one
    if ( newNode === undefined ) {
      // Add root
      const newN = addNodeInsideWeight(w);
      display(`Created root ${w}`);
      expandLeaf(newN, w);
      actionOnInsert(newN);
      return true;
    }

    // Check for same weight
    if ( weight(newNode) === w ) {
      // Display error
      display(`Node with weight ${w} already exists!`);
      return false;
    }

    // If the last node visited is a dummy/sentinel node, replace it
    if ( isLeaf(newNode) ) {
      expandLeaf(newNode, w);
      actionOnInsert(newNode);
      return true;
    } else {
      display(`ERROR, SHOULDNT REACH!`);
      return null;
    }
}

/**
 * Helper to replace a node's weight with that of its in-order predecessor
 * @param {*} node node whose weight will be replaced
 */
function replaceWithInOrderPredecessor(node) {
  display(`Node with weight ${weight(node)} has two real children: remove its in-order predecessor`);
  const predecessor = findInOrderPredecessor(getLeft(node));
  const newWeight = weight(predecessor);
  // find and remove the predecessor -- its weight will replace node's weight
  remove(predecessor);
  step(() => {
    display(`Replace weight of "deleted" node with predecessor weight ${newWeight}`);
    setWeight(node, newWeight);
  });
}

/**
 * Removes the given node from the tree
 * Called after looking up the node to remove
 * 
 * @param node the node to remove
 */
function remove(node) {
    //-----------------------------------------------------------
    // CASE 1: Removing the ROOT of the tree
    //-----------------------------------------------------------
    // Subcase 1a: root has no children 
    // Subcase 1b: root has one red child
    // Subcase 1c: root has two children
    if ( node === getRoot() ) {
      // If root has no children
      if ( getAttribute(getLeft(node), "dummy") && getAttribute(getRight(node), "dummy") ) {
        dummify(node);
      // Root has real left child only: delete root and promote left child
      } else if ( ! getAttribute(getLeft(node), "dummy") && getAttribute(getRight(node), "dummy") ) {
        setAttribute(getLeft(node), "borderColor", "black");
        deleteNode(getRight(node));
        deleteNode(node);
      // Root has real right child only: delete root and promote right child
      } else if ( getAttribute(getLeft(node), "dummy") && ! getAttribute(getRight(node), "dummy") ) {
        setAttribute(getRight(node), "borderColor", "black");
        deleteNode(getLeft(node));
        deleteNode(node);
      // If the root has two real children
      } else {
        replaceWithInOrderPredecessor(node);
      }
      return;
    }

    //-----------------------------------------------------------
    // CASE 2: Node has TWO REAL CHILDREN (both non-dummy)
    //-----------------------------------------------------------
    // Copy in order predecessor's weight into node, then remove predecessor
    if ( ! getAttribute(getLeft(node), "dummy" ) && ! getAttribute(getRight(node), "dummy") ) {
      replaceWithInOrderPredecessor(node);
      return;
    }

    //-----------------------------------------------------------
    // CASE 3: Removing a RED LEAF node
    //-----------------------------------------------------------
    // Dummify the node, deleting its dummy children
    if( getAttribute(node, "borderColor") === "red" && getAttribute(getLeft(node), "dummy") && getAttribute(getRight(node), "dummy") ) {
      display(`node with weight ${weight(node)} is a leaf, so make it a dummy node`);
      dummify(node);
      return;
    }

    //-----------------------------------------------------------
    // CASE 4: Removing a BLACK node with ONE RED CHILD
    //-----------------------------------------------------------
    // Replace node with child, recolor child BLACK
    if( getAttribute(node, "borderColor") === "black" ) {
      let child = null;
      // Determine which child is red
      if( !getAttribute(getLeft(node), "dummy") && getAttribute(getLeft(node), "borderColor") === "red" ){
        child = getLeft(node);
      } else if ( ! getAttribute(getRight(node), "dummy") && getAttribute(getRight(node), "borderColor") === "red" ){
        child = getRight(node);
      }

      // If the node has a single real child that is red
      if ( child != null ) {
        setWeight(node, weight(child));
        dummify(child);
        return;
      }
    }


    //-----------------------------------------------------------
    // CASE 5: Removing a BLACK node with ONE BLACK CHILD (dummy or real)
    //-----------------------------------------------------------
    // If the node is black and has a single black child
    if( getAttribute(node, "borderColor") === "black" && numChildren(node) === 1 && getAttribute(getLeft(node), "borderColor") === "black" ) {
      const child = getLeft(node);
      relink(getParent(node), getLeft(node), getLeft(getParent(node)) === node, false, weight(getLeft(node), "black"));
      remedyDoubleBlack( child );
      return;
    }

    //-----------------------------------------------------------
    // CASE 6: Removing a BLACK LEAF (dummy sibling situation)
    //-----------------------------------------------------------
    // If the node is black and has two dummy children
    if( getAttribute(node, "borderColor") === "black" && getAttribute(getLeft(node), "dummy") && getAttribute(getRight(node), "dummy") ){
      dummify(node);
      remedyDoubleBlack( node );
      return;
    }
}

/**
 * Deletes the node with the given weight from the tree
 * 
 * @param weight the weight of the node to delete
 * @returns true if deletion was successful, false otherwise
 */
function deleteWeight(weight) {
  const node = lookUp(getRoot(), weight);
  if( node == null || ( getAttribute(node, "dummy") === true ) ){
    display(`Node with weight ${weight} does not exist!`);
    return false;
  }
  remove(node);
  return true
}

// Will update the node with new weight
function set( node, newWeight ) {
  const oldValue = weight( node ); // If dummy it should be null/undefined

  if ( oldValue === undefined ) {
    display(`Replace sentinel leaf with new node`);
    unDummy( node, newWeight );
  } else {
    setWeight( node, newWeight );
  }

  // return oldValue;
  return node;
}

function unDummy( dummy, weight ) {
  //DO not delete, just change to a normal node
  step(() => {
    setWeight(dummy, weight);
    uncolor(dummy);
    setAttribute(dummy, "dummy", false);
  });
}

function lookUp(node, w) {
  // Check for undefined node
  if ( node === undefined || node === null ) {
    return undefined;
  }

  if ( getAttribute( node, "dummy")) {
    // this is a dummy/sentinel node
    display(`Reached a sentinel leaf; node with weight ${w} does not exist`);
    return node;
  }
  step(() => {
    mark(node);
    display(`Comparing with node of weight ${weight( node )}`);
  });
  unmark(node);
  if ( weight(node) > w ) {
    return lookUp(getLeft(node), w);
  } else if ( weight(node) < w ) {
    return lookUp(getRight(node), w);
  } else {
    display(`Found node with weight ${w}`);
    return node;
  }
}

/**
 * For a red/black tree, any newly inserted node is made red unless it is the
 * root node. After insertion, we must check that the newly created tree
 * position has not created a double-red condition (i.e., the newly created
 * position is red and has a red parent)
 */
function actionOnInsert(node) {
  if ( ! isRoot(node) ) {
    display(`Make new non-root nodes red`)
    makeRed(node);
    resolveRed( node );
  } else {
    display(`If it's the root node, make it black`)
    makeBlack(node);
  }
}

/**
 * For a RedBlack tree, we must check that the removed position
 * has not created a double-black condition (i.e., a situation in which the
 * black-depth property of the tree is violated)
 */
function actionOnDelete( node ) {
  if ( isRed( node ) ) {
    makeBlack( node );
  } else if ( !isRoot( node ) ) {
    let sib = getSibling( node );
    if ( isInternal( sib ) && ( isBlack( sib ) || isInternal( getLeft( sib ) ) ) ) {
      remedyDoubleBlack( node );
    }
  }
}

/**
 * A method hook that is executed whenever a tree position is accessed
 * 
 * @param node node that should be acted upon
 */
function actionOnAccess( node ) {
    // Do nothing for BST
}

// for some reason the new lines don't work in prompt
// and it appears that all white space is replaced with a single space
const promptString =
 "Red-Black Trees: Input weight \'w\' with the following interpretation: \n"
  + " \'(+)w\' adds a node with weight w;   \n"
  + " \'-w\' deletes a node with weight w;  \n"
  + "  and 0 exits the program, leaving the current tree intact \n";
console.log(`prompt = ${promptString}`);

while ( true ) {
  cleanTree();

  // Prompt user for weight input
  // Positive weight to add, negative weight to delete, 0 to exit
  const inWeight = promptNumber(promptString);

  if ( inWeight > 0 ) {
    if ( put(inWeight) ) {
      display(`Successfully added a new node whose weight is ${inWeight}`);
    }
  } else if ( inWeight < 0 ) {
    if ( deleteWeight(-inWeight) ) {
      display(`Successfully removed the node whose weight is ${oldWeight}`);
    }
  } else if ( inWeight == 0 ) {
    // stop algorithm if user inputs 0
    break;
  } else {
    // should not reach here  
    display( "That is not a valid selection!" );
  }
}
display( "The algorithm has finished" );