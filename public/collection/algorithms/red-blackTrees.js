/**
 * Red-Black TreeBuilder algorithm that prompts the user to add or remove nodes until user says to stop
 * Created by Garrett Brazawski ( gmbrazaw@ncsu.edu )
 * 
 * The user will be asked to give a positive integer to put in the tree.
 * This will create a new node with that weight and update the tree.
 * If the user puts in a negative integer, the program will try and 
 * remove the node with the positive value of that weight.
 */


//CytoScapeInterface should handle dummy styling automatically in the future

setDirected(true);
let visit = 1;

// TreeInterface will later replace these fns with their own, need them here for now
// Looks for the root node by looking for inDegree of 0
function getRoot() {
  for (const x of getNodes()) {
    if (inDegree(x) === 0) {
      return x;
    }
  }
  return undefined;
}

function isLeaf(node) {
  return (outDegree(node) === 0);
}

function isRoot(node) {
  return (inDegree(node) === 0);
}

function children(node){
  return outgoingNodes(node);
}

function numChildren( node ) {
  return outDegree( node );
}

//only 1 incoming node for each node, the parent (otherwise undefined if < (root) or > (cycle))
function parent(node){
  const incoming = incomingNodes(node);
  //display( `Parent: '${incoming[0]}'` );
  return incoming.length == 1 ? incoming[0] : undefined;
}

function left(node){
  // const w = weight( node );
  // return weight(getChildren(node)[0]) < w ? getChildren(node)[0] : getChildren(node)[1]
  return children(node)[0];
}

function right(node){
  // const w = weight( node );
  // return weight(getChildren(node)[0]) > w ? getChildren(node)[0] : getChildren(node)[1]
  return children(node)[1];
}

function sibling( node ) {
  const p = parent( node );

  // If the left child of the parent is the node, return the right child 
  // of the parent which would be the sibling of node
  // else return the left child which would be node's sibling
  return left( p ) == node ? right( p ) : left( p );
}

// Show the nodes being traced to the user
function accentNode(x){
  // For some reason only marking the root, so commented out for now
  step(() => {
    //mark(x);
    highlight(x);
  });
}

function cleanTree(){
  step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    clearEdgeHighlights();
    clearEdgeColors();
    hideAllNodeLabels();
  });
}

function createDummy(){
  const dummy = addNode(0,0)
  setShape(dummy, "square");
  color(dummy, "black");
  setSize(dummy, 20);
  setAttribute(dummy, "dummy", true);
  return dummy;
}

// Will make a node a dummy
function dummify( nodeId ){
  setAttribute(nodeId, "dummy", true);
  setAttribute(nodeId, "weight", undefined);
  return nodeId;
}

function replaceDummy(parent, dummy, k, side) {
  //DO not delete, just change to a normal node
  setWeight(dummy, k);
  setShape(dummy, "circle");
  color(dummy, "white");
  setSize(dummy, 35);
  setAttribute(dummy, "dummy", false);
  
  display(`Inserted '${k}' as ${side} child of '${weight(parent)}'`);
  return dummy;
}

/**
 * This function will add a node with the given weight 
 * to the node, but will remove the dummy it makes
 * @param {*} node the parent node
 * @param {*} w the new node weight
 */
function addLeftNoDummy( node, w ) {
  const newNode = addLeft( node, w );
  deleteNode( right( node ) );
  return newNode;
}

/**
 * This function will add a node with the given weight 
 * to the node, but will remove the dummy it makes
 * @param {*} node the parent node
 * @param {*} w the new node weight
 */
function addRightNoDummy( node, w ) {
  const newNode = addRight( node, w );
  deleteNode( left( node ) );
  return newNode;
}

//!promptBoolean("Is the tree done?")
// while (true){
//   step(() => {
//     clearNodeMarks();
//     clearNodeHighlights();
//     clearNodeLabels();
//     //clearNodeWeights();
//     clearEdgeHighlights();
//     clearEdgeColors();
//     visit = 1;
//   });

//   let k = promptNumber("What is the weight (key) of the new node?");
//   console.log("root: ", getRoot());
//   addNodeBST(getRoot(), k);
// }

//display("The tree is done; the algorithm is finished");

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
  // return getBorderColor( node ) === "black"; // Update with border change
  // return getColor( node ) === "black";

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
  // return getBorderColor( node ) === "red"; // Update with border change
  // return getColor( node ) === "red";

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

// Set the parentN as the parent of node
function setParent( node, parentN ) {
  // Check null
  if ( parentN === null ) {
    // Do nothing
    return;
  }

  display(`We now set the node '${parentN}' as the parent of '${node}'`);
  // Remove incoming edges ( old parent ) from child ( node )
  const parentEdge = incoming( node );
  if ( parentEdge != null && parentEdge[ 0 ] != null ) {
    deleteEdge( parentEdge[ 0 ] );
  }

  // Add new edge between node and parent
  addEdge( parentN, node );
}

// Set the child as a left child of node
function setLeft( node, child ) {
  display(`We now set the node ('${child}') as the left child of '${node}'`);

  // Grab child weight
  const childWeight = weight( child );
  const colorAttribute = getAttribute( child, 'borderColor' );

  // Grab left and right children of child
  const leftC = left( child );
  const rightC = right( child );

  // Remove child ( and all edges associated );
  deleteNode( child );

  // Add the child as a left child of node
  const newChild = addLeft( node, childWeight );
  // Add the old color back to the node
  setAttribute( newChild, 'borderColor', colorAttribute );

  // Add the old children back
  // * Check if we need to recursion 
  // if the left and right children dont 
  // get put back problem ( if so, maybe 
  // add a dummy if one of them dont exist ) *
  if ( leftC ) {
    addEdge( newChild, leftC );
    //setLeft( newChild, leftC );
  }

  if ( rightC ) {
    addEdge( newChild, rightC );
    //setRight( newChild, rightC );
  }

  // This will help update relinking
  return newChild;
}

// Set the child as a right child of node
function setRight( node, child ) {
  display(`We now set the node ('${child}') as the right child of '${node}'`);

  // Grab child weight
  const childWeight = weight( child );
  const colorAttribute = getAttribute( child, 'borderColor' );

  // Grab left and right children of child
  const leftC = left( child );
  const rightC = right( child );

  // Remove child ( and all edges associated );
  deleteNode( child );

  // Add the child as a right child of node
  const newChild = addRight( node, childWeight );
  // Add the old color back to the node
  setAttribute( newChild, 'borderColor', colorAttribute );

  // Add the old children back
  // * Check if we need to recursion 
  // if the left and right children dont 
  // get put back problem ( if so, maybe 
  // add a dummy if one of them dont exist ) *
  if ( leftC ) {
    addEdge( newChild, leftC );
    //setLeft( newChild, leftC );
  }

  if ( rightC ) {
    addEdge( newChild, rightC );
    //setRight( newChild, rightC );
  }

  // This will help update relinking
  return newChild;
}

// Set this node as the root
// shouldRemove is used if we need to update the parent edge
function setRoot( node, shouldRemove ) {
  // Remove incoming edges
  if ( shouldRemove ) {
    const parentEdge = incoming( node );
    if ( parentEdge != null && parentEdge[ 0 ] != null ) {
      deleteEdge( parentEdge[ 0 ] );
    }
  }
}

// *****************************
// BalanceableBinaryTree Methods
// *****************************

/**
 * Relink two positions to create a parent-child relationship
 * 
 * @param parentN       the position that will become the parent of the child
 * @param child         the position that will be come a child of the parent
 * @param makeLeftChild indicates whether the child should be a left child
 *                      (true) or not (false)
 * @param dummy         if the child should be a dummy
 * @param w             the weight of the child
 * @param color         the color of the child
 */
function relink( parentN, child, makeLeftChild, dummy, w, color ) {
  // Check if the node is a dummy, if it is we dont have to change it
  if ( dummy ) {
    // Remove the child
    deleteNode( child );

    return;
  } else {
    // Grab the new other node
    let node = undefined;

    if ( makeLeftChild ) {
      // Grab the left child to change
      node = left( parentN );
    } else {
      // Grab the right child to change
      node = right( parentN );
    }

    // Grab the children of the old node
    const childLeft = left( child );
    const childRight = right( child );

    // Undummify
    setAttribute( node, 'dummy', false );
    setBorderWidth( node, 5 );
    setWeight( node, w );
    setAttribute( node, 'borderColor', color );

    // Remove the child
    deleteNode( child );

    // Add old children back onto new node
    if ( childLeft != undefined && childRight != undefined ) {
      addEdge( node, childLeft );
      addEdge( node, childRight );
    }
  }
}

// /**
//  * Helper to rotate, rotates if grandparent dosent 
//  * exist and node is parents left child
//  * @param {*} node node we are rotating around the parent
//  * @param {*} parentN parent of node
//  */
// function rotateL( node, parentN ) {
//   // Assuming all arent null
//   // Grab all nodes involved
//   let parentLeft = left( parentN );
//   let parentRight = right( parentN );
//   let nodeLeft = left( node );
//   let nodeRight = right( node );

//   // For this rotate, we grab nodeRight's children ( since we delete nodeRight )
//   let nodeRightLeft = left( nodeRight );
//   let nodeRightRight = right( nodeRight );

//   // Grab other node child weight and color
//   let nodeChildOtherIsDummy = getAttribute( nodeLeft, "dummy" );
//   const nodeLeftWeight = weight( nodeLeft );
//   const nodeLeftColor = getAttribute( nodeLeft, 'borderColor' );

//   // Grab other parent child weight and color
//   let parentChildOtherIsDummy = getAttribute( parentRight, "dummy" );
//   const parentRightWeight = weight( parentRight );
//   const parentRightColor = getAttribute( parentRight, 'borderColor' );

//   // Remove nodeRight
//   let nodeChildIsDummy = getAttribute( nodeRight, "dummy" );
//   const nodeRightWeight = weight( nodeRight );
//   const nodeRightColor = getAttribute( nodeRight, 'borderColor' );
//   deleteNode( nodeRight );

//   // Grab and remove any updated edges
//   deleteEdge( getEdgeBetween( node, nodeLeft ) );
//   deleteEdge( getEdgeBetween( parentN, parentRight ) );

//   // DONT Remove node ( it will become the root )
//   // const nodeWeight = weight( node );
//   // const nodeColor = getAttribute( node, 'borderColor' );
//   // deleteNode( node );

//   // Remove parent
//   const parentWeight = weight( parentN );
//   const parentColor = getAttribute( parentN, 'borderColor' );
//   deleteNode( parentN );

//   // Make node the root
//   // let newNode = addNode( 0, 0 );
//   // setWeight( newNode, nodeWeight );
//   // setAttribute( newNode, 'borderColor', nodeColor );

//   // Add parent back onto node
//   let newParent = addRight( node, parentWeight );
//   setAttribute( newParent, 'borderColor', parentColor );

//   // Add nodeRight back onto parent
//   let newNodeRight = addLeft( newParent, nodeRightWeight );
//   if ( nodeChildIsDummy ) {
//     dummify( newNodeRight );
//   } else {
//     setAttribute( newNodeRight, 'borderColor', nodeRightColor );
//   }

//   // Add all the edges back ( relink )
//   relink( node, nodeLeft, true, nodeChildOtherIsDummy, nodeLeftWeight, nodeLeftColor );
//   relink( newParent, parentRight, false, parentChildOtherIsDummy, parentRightWeight, parentRightColor );

//   // Check for no children off of nodeRight
//   if ( nodeRightLeft != undefined && nodeRightRight != undefined ) {
//     addEdge( newNodeRight, nodeRightLeft );
//     addEdge( newNodeRight, nodeRightRight );
//   }

//   return node;
// }

/**
 * Helper to rotate, rotates if grandparent dosent 
 * exist and node is parents left child
 * @param {*} node node we are rotating around the parent
 * @param {*} parentN parent of node
 */
function rotateL( node, parentN ) {
  // Assuming all arent null
  // Grab all nodes involved
  let parentLeft = left( parentN );
  let parentRight = right( parentN );
  let nodeLeft = left( node );
  let nodeRight = right( node );

  // For this rotate, we grab nodeRight's children ( since we delete nodeRight )
  let nodeRightLeft = left( nodeRight );
  let nodeRightRight = right( nodeRight );

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

  // Grab and remove any updated edges
  deleteEdge( getEdgeBetween( node, nodeLeft ) );
  deleteEdge( getEdgeBetween( parentN, parentRight ) );

  // Remove node ( it will become the root )
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Make node the root
  let newNode = addNode( 0, 0 );
  setWeight( newNode, nodeWeight );
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add parent back onto node
  let newParent = addRight( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add nodeRight back onto parent
  let newNodeRight = addLeft( newParent, nodeRightWeight );
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

// /**
//  * Helper to rotate, rotates if grandparent dosent 
//  * exist and node is parents right child
//  * @param {*} node node we are rotating around the parent
//  * @param {*} parentN parent of node
//  */
// function rotateR( node, parentN ) {
//   // Assuming all arent null
//   // Grab all nodes involved
//   let parentLeft = left( parentN );
//   let parentRight = right( parentN );
//   let nodeLeft = left( node );
//   let nodeRight = right( node );

//   // For this rotate, we grab nodeLeft's children ( since we delete nodeLeft )
//   let nodeLeftLeft = left( nodeLeft );
//   let nodeLeftRight = right( nodeLeft );

//   // Grab other node child weight and color
//   let nodeChildOtherIsDummy = getAttribute( nodeRight, "dummy" );
//   const nodeRightWeight = weight( nodeRight );
//   const nodeRightColor = getAttribute( nodeRight, 'borderColor' );

//   // Grab other parent child weight and color
//   let parentChildOtherIsDummy = getAttribute( parentLeft, "dummy" );
//   const parentLeftWeight = weight( parentLeft );
//   const parentLeftColor = getAttribute( parentLeft, 'borderColor' );

//   // Remove nodeLeft
//   let nodeChildIsDummy = getAttribute( nodeLeft, "dummy" );
//   const nodeLeftWeight = weight( nodeLeft );
//   const nodeLeftColor = getAttribute( nodeLeft, 'borderColor' );
//   deleteNode( nodeLeft );

//   // Grab and remove any updated edges
//   deleteEdge( getEdgeBetween( node, nodeRight ) );
//   deleteEdge( getEdgeBetween( parentN, parentLeft ) );

//   // DONT Remove node ( it will become the root )
//   // const nodeWeight = weight( node );
//   // const nodeColor = getAttribute( node, 'borderColor' );
//   // deleteNode( node );

//   // Remove parent
//   const parentWeight = weight( parentN );
//   const parentColor = getAttribute( parentN, 'borderColor' );
//   deleteNode( parentN );

//   // Make node the root
//   // let newNode = addNode( 0, 0 );
//   // setWeight( newNode, nodeWeight );
//   // setAttribute( newNode, 'borderColor', nodeColor );

//   // Add parent back onto node
//   let newParent = addLeft( node, parentWeight );
//   setAttribute( newParent, 'borderColor', parentColor );

//   // Add nodeLeft back onto parent
//   let newNodeLeft = addRight( newParent, nodeLeftWeight );
//   if ( nodeChildIsDummy ) {
//     dummify( newNodeLeft );
//   } else {
//     setAttribute( newNodeLeft, 'borderColor', nodeLeftColor );
//   }

//   // Add all the edges back ( relink )
//   relink( node, nodeRight, false, nodeChildOtherIsDummy, nodeRightWeight, nodeRightColor );
//   relink( newParent, parentLeft, true, parentChildOtherIsDummy, parentLeftWeight, parentLeftColor );

//   // Check for no children off of nodeLeft
//   if ( nodeLeftLeft != undefined && nodeLeftRight != undefined ) {
//     addEdge( newNodeLeft, nodeLeftLeft );
//     addEdge( newNodeLeft, nodeLeftRight );
//   }

//   return node;
// }

/**
 * Helper to rotate, rotates if grandparent dosent 
 * exist and node is parents right child
 * @param {*} node node we are rotating around the parent
 * @param {*} parentN parent of node
 */
function rotateR( node, parentN ) {
  // Assuming all arent null
  // Grab all nodes involved
  let parentLeft = left( parentN );
  let parentRight = right( parentN );
  let nodeLeft = left( node );
  let nodeRight = right( node );

  // For this rotate, we grab nodeLeft's children ( since we delete nodeLeft )
  let nodeLeftLeft = left( nodeLeft );
  let nodeLeftRight = right( nodeLeft );

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

  // Grab and remove any updated edges
  deleteEdge( getEdgeBetween( node, nodeRight ) );
  deleteEdge( getEdgeBetween( parentN, parentLeft ) );

  // Remove node ( it will become the root )
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Make node the root
  let newNode = addNode( 0, 0 );
  setWeight( newNode, nodeWeight );
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add parent back onto node
  let newParent = addLeft( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add nodeLeft back onto parent
  let newNodeLeft = addRight( newParent, nodeLeftWeight );
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
  let grandparentLeft = left( grandparent );
  let grandparentRight = right( grandparent );
  let parentLeft = left( parentN );
  let parentRight = right( parentN );
  let nodeLeft = left( node );
  let nodeRight = right( node );

  // For this rotate, we grab nodeRight's children ( since we delete nodeRight )
  let nodeRightLeft = left( nodeRight );
  let nodeRightRight = right( nodeRight );

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

  // Grab and remove any updated edges
  deleteEdge( getEdgeBetween( node, nodeLeft ) );
  deleteEdge( getEdgeBetween( parentN, parentRight ) );
  deleteEdge( getEdgeBetween( grandparent, grandparentRight ) );

  // Remove node
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Add node back onto grandparent
  let newNode = addLeft( grandparent, nodeWeight );
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add parent back onto node
  let newParent = addRight( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add nodeRight back onto parent
  let newNodeRight = addLeft( newParent, nodeRightWeight );
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
  let grandparentLeft = left( grandparent );
  let grandparentRight = right( grandparent );
  let parentLeft = left( parentN );
  let parentRight = right( parentN );
  let nodeLeft = left( node );
  let nodeRight = right( node );

  // For this rotate, we grab nodeLeft's children ( since we delete nodeLeft )
  let nodeLeftLeft = left( nodeLeft );
  let nodeLeftRight = right( nodeLeft );

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

  // Grab and remove any updated edges
  deleteEdge( getEdgeBetween( node, nodeRight ) );
  deleteEdge( getEdgeBetween( parentN, parentLeft ) );
  deleteEdge( getEdgeBetween( grandparent, grandparentLeft ) );

  // Remove node
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Add node back onto grandparent
  let newNode = addRight( grandparent, nodeWeight );
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add parent back onto node
  let newParent = addLeft( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add nodeLeft back onto parent
  let newNodeLeft = addRight( newParent, nodeLeftWeight );
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
  let grandparentLeft = left( grandparent );
  let grandparentRight = right( grandparent );
  let parentLeft = left( parentN );
  let parentRight = right( parentN );
  let nodeLeft = left( node );
  let nodeRight = right( node );

  // For this rotate, we grab nodeLeft's children ( since we delete nodeLeft )
  let nodeLeftLeft = left( nodeLeft );
  let nodeLeftRight = right( nodeLeft );

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

  // Grab and remove any updated edges
  deleteEdge( getEdgeBetween( node, nodeRight ) );
  deleteEdge( getEdgeBetween( parentN, parentLeft ) );
  deleteEdge( getEdgeBetween( grandparent, grandparentRight ) );

  // Remove node
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Add node back onto grandparent
  let newNode = addLeft( grandparent, nodeWeight );
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add parent back onto node
  let newParent = addLeft( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add nodeLeft back onto parent
  let newNodeLeft = addRight( newParent, nodeLeftWeight );
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
  let grandparentLeft = left( grandparent );
  let grandparentRight = right( grandparent );
  let parentLeft = left( parentN );
  let parentRight = right( parentN );
  let nodeLeft = left( node );
  let nodeRight = right( node );

  // For this rotate, we grab nodeRight's children ( since we delete nodeRight )
  let nodeRightLeft = left( nodeRight );
  let nodeRightRight = right( nodeRight );

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

  // Grab and remove any updated edges
  deleteEdge( getEdgeBetween( node, nodeLeft ) );
  deleteEdge( getEdgeBetween( parentN, parentRight ) );
  deleteEdge( getEdgeBetween( grandparent, grandparentLeft ) );

  // Remove node
  const nodeWeight = weight( node );
  const nodeColor = getAttribute( node, 'borderColor' );
  deleteNode( node );

  // Remove parent
  const parentWeight = weight( parentN );
  const parentColor = getAttribute( parentN, 'borderColor' );
  deleteNode( parentN );

  // Add node back onto grandparent
  let newNode = addRight( grandparent, nodeWeight );
  setAttribute( newNode, 'borderColor', nodeColor );

  // Add parent back onto node
  let newParent = addRight( newNode, parentWeight );
  setAttribute( newParent, 'borderColor', parentColor );

  // Add nodeRight back onto parent
  let newNodeRight = addLeft( newParent, nodeRightWeight );
  if ( nodeChildIsDummy ) {
    dummify( newNodeRight );
  } else {
    setAttribute( newNodeRight, 'borderColor', nodeRightColor );
  }

  // Add all the edges back ( relink )
  relink( grandparent, grandparentLeft, true, grandparentLeftWeight, grandparentLeftColor );
  relink( newNode, nodeLeft, true, nodeLeftWeight, nodeLeftColor );
  relink( newParent, parentRight, false, parentRightWeight, parentRightColor );

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

  let parentN = parent( node );
  let grandparent = parent( parentN );

  display(`Rotate: We will rotate node '${node}' around its parent '${parentN}'...`);
  // display(`...and if needed, the grandparent will refer to node '${node}' as its child`);

  // Will be used to update the node IDs that were updated
  let newNodeId = undefined;

  step(() => {

    // Get all nodes involved
    //let grandparentParent = parent( grandparent );
    let grandparentLeft = null;
    let grandparentRight = null;
    let parentLeft = left( parentN );
    let parentRight = right( parentN );
    let nodeLeft = left( node );
    let nodeRight = right( node );

    if ( grandparent != undefined ) {
      // Update the children
      grandparentLeft = left( grandparent );
      grandparentRight = right( grandparent );
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

  let parentN = parent( node );
  let grandparent = parent( parentN );

  if ( (node === left( parentN ) && parentN === left( grandparent ) ) || 
      ( node === right( parentN ) && parentN === right( grandparent ) ) ) {
      // rotate the parent around the grandparent
      display(`Restructure: If the parent ('${parentN}') is the same side child as node ('${node}') is to parent...`);
      display(`...then we rotate the parent ('${parentN}') around the grandparent ('${grandparent}')`);
      const newParentID = rotate( parentN );
      return newParentID;
  } else {
      // rotate the node around the parent twice
      display(`Restructure: If the parent ('${parentN}') is not the same side child as node ('${node}') is to parent...`);
      display(`...then we rotate the node ('${node}') around the parent ('${parentN}') twice`);
      const newNodeID = rotate( node );
      const newNodeID2 = rotate( newNodeID );
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

  let parentN = parent( node );

  if ( isRed( parentN ) ) {

    display(`We violate the Red Property with a red parent!`)

    let uncle = sibling( parentN );
    // CASE 1: the uncle (sibling of the parent) is black
    if ( isBlack( uncle ) ) {
      display(`CASE 1: The uncle ('${uncle}') (sibling of the parent) is black`);
      // Restructure and re-color children
      display(`So we preform trinode restructuring on the node, parent, and grandparent`);
      let middle = restructure( node );
      display(`Then we make the middle node (new parent) black and the two children red`);
      makeBlack( middle );
      makeRed( left( middle ) );
      makeRed( right( middle ) );
    } else {
      // CASE 2: the uncle (sibling of the parent) is red
      display(`CASE 2: The uncle ('${uncle}') (sibling of the parent) is red`);
      display(`So we make the parent node ('${parentN}') and uncle ('${uncle}') black`);
      makeBlack( parentN );
      makeBlack( uncle );
      let grandparent = parent( parentN );
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

  let parentN = parent( node );
  let sibling = sibling( node );
  
  if ( isBlack( sibling ) ) {
    // CASE 1: trinode restructuring
    if ( isRed( left( sibling ) ) || isRed( right( sibling ) ) ) {
      let temp = null;
      if ( isRed( left( sibling ) ) ) {
        temp = left( sibling );
      } else {
        temp = right( sibling );
      }

      // Updated for restructure
      const isRedParent = isRed( parentN );

      let middle = restructure( temp );
      if ( isRedParent ) {
        makeRed( middle );
      } else {
        makeBlack( middle );
      }
      makeBlack( left( middle ) );
      makeBlack( right( middle ) );
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

    let isSiblingLeftChild = ( sibling === left( parentN ) );
    let newSibling = rotate( sibling );
    let newNode = undefined;

    // Grab new node after rotate
    if ( isSiblingLeftChild ) {
      newNode = right( right( newSibling ) );
    } else {
      newNode = left( left( newSibling ) );
    }

    // Update with new node
    remedyDoubleBlack( newNode );
  }


}

//-----------------UNIQUE BST FNS-------------------

// Call this on the left child of the subtree root
function findInOrderPredecessor(currentNode){
  // While there is a real right child, go right
  while( right(currentNode) && getAttribute(right(currentNode), "dummy") != true ){
    
    // If a real right child exists, recur
    return findInOrderPredecessor(right(currentNode));
  }

  // If I have no real right child, I am the predecessor
  display(`Found predecessor at '${currentNode}'`)
  return currentNode
}

// Call this on the right child of the subtree rotty
function findInOrderSuccessor(currentNode){
  // While there is a real left child, go left
  while( left(currentNode) && getAttribute(left(currentNode), "dummy") != true ){
    
    // If a real left child exists, recur
    return findInOrderSuccessor(left(currentNode));
  }
  display(`Found successor at '${currentNode}'`)
  return currentNode
}

// Show the nodes being traced to the user
function accentNode(x){
  // For some reason only marking the root, so commented out for now
  step(() => {
    //mark(x);
    highlight(x);
  });
}

// @Override
// public V get(K key) {
//     Position<Entry<K, V>> p = lookUp(tree.root(), key);
//     // actionOnAccess is a "hook" for our AVL, Splay, and Red-Black Trees to use
//     actionOnAccess(p);
//     if (isLeaf(p)) {
//         return null;
//     }
//     return p.getElement().getValue();
// }

/**
 * To preserve the property of having all sentinel leaves, expandLeaf converts a
 * sentinel leaf into a position with an entry, then adds 2 new sentinel
 * children to the position
 * 
 * @param dum     the position in the tree to update to store the provided entry
 * @param weight the entry to store in the provided position of the tree
 */
function expandLeaf( dum, weight ) {
    // This method is used to add dummy/sentinel left and right children as leaves
    // initially, dum is a dummy/sentinel node,
    // so replace the null entry with the new actual entry
    let newNode = set( dum, weight );

    display(`Add sentinel leafs to keep Leaf Property!`);
    // Then add new dummy/sentinel children
    // step(()=>{
    //   dummify( addLeft( newNode, undefined ) );
    //   dummify( addRight( newNode, undefined ) );
    // });
    step(() =>{
      dummify( addLeft( newNode, undefined ) );
    });
    
}

/**
 * This will be the method where we change/create nodes
 */
function put( w ) {
    // Create the new map entry
    // Entry<K, V> newEntry = new MapEntry<K, V>(key, value);

    // Get the last node visited when looking for the key
    const newNode = lookUp( getRoot(), w );

    // Check for no root
    if ( newNode === undefined ) {
      // Add root
      const newN = addNode(0,0);
      // const newN = addNodeIdAttrs( w, 0, 0, null );
      
      setWeight( newN, w );
      display(`Created root '${w}'`);
      expandLeaf( newN, w);

      // display(`SWAP!`);
      // swapID( newN, w );

      display( `Check rules after addition of node '${newN}'` );
      actionOnInsert( newN );
      return newN;
    }

    // Check for same weight
    if ( weight( newNode ) === w ) {
      // Display error
      display(`Node with weight '${w}' already exists!`);
      return null;
    }

    // If the last node visited is a dummy/sentinel node
    if ( isLeaf( newNode ) ) {
      expandLeaf( newNode, w);

      // actionOnInsert is a "hook" for our AVL, Splay, and Red-Black Trees to use
      display( `Check rules after addition of node '${newNode}'` );
      actionOnInsert( newNode );
      return undefined;
    } else {
      display(`ERROR, SHOULDNT REACH!`);
      // This is for if we are updating a weight for a node which we dont need to do
      const ogWeight = weight( newNode );
      set( newNode, w);
      // actionOnAccess is a "hook" for our AVL, Splay, and Red-Black Trees to use
      actionOnAccess( newNode );
      return ogWeight;
    }
}

/**
 * This will be the method where we remove nodes
 */
function remove( w ) {
    // Get the node with the given weight
    let node = lookUp( getRoot(), w );

    // Do a root check...
    if ( isRoot( node ) ) {
      if ( left( node ) != undefined ) {
        deleteNode( left( node ) );
      }
      if ( right( node ) != undefined ) {
        deleteNode( right( node ) );
      }
      deleteNode( node );
    }

    // If node is a dummy/sentinel node
    if ( isLeaf( node ) ) {
        // actionOnAccess is a "hook" for our AVL, Splay, and Red-Black Trees to use
        actionOnAccess( node );
        display(`Node with weight '${w}' dosen't exists!`);
        return undefined;
    } else {
        const ogWeight = weight( node );
        // If the node has two children (that are not dummy/sentinel nodes)
        if ( isInternal( left( node ) ) && isInternal( right( node ) ) ) {
            // Replace with the inorder successor
            let replacement = findInOrderSuccessor( right( node ) );
            set( node, weight( replacement ) );
            // Move the reference node to the replacement node in the right subtree
            node = replacement;
        }
        // Get the dummy/sentinel node (in case the node has an actual entry as a
        // child)...
        const leaf = ( isLeaf( left( node ) ) ? left( node ) : right( node ) );
        // ... then get its sibling (will be another sentinel or an actual entry node)
        const sib = sibling( leaf );
        // Remove the leaf NODE (this is your LinkedBinaryTree remove method)
        removeBT( leaf );
        // Remove the NODE (this is your LinkedBinaryTree remove method)
        // which will "promote" the sib node to replace node
        removeBT( node );
        // actionOnDelete is a "hook" for our AVL, Splay, and Red-Black Trees to use
        display( `Check rules after deletion of node '${node}'` );
        actionOnDelete( sib );
        return ogWeight;
    }
}

function removeBT( node ) {
		if ( numChildren( node ) == 2 ) {
			display(`The node ('${node}')has two children!`);
      return undefined;
		}
		// Get parent and child node if there is one
		const parentNode = parent( node );
		let childNode = null;
		if ( left( node ) != undefined ) {
			childNode = left( node );
		} else if ( right( node ) != undefined ) {
			childNode = right( node );
		}
		// Else leave child null

		if ( childNode != null ) {
			if ( isRoot( node ) ) {// If the parent is null
        setRoot( childNode, true );
				setParent( childNode, null );
			} else if ( left( parentNode ) != undefined && left( parentNode ) === node ) {// If node if the left child of parent
        // Grab all nodes involved and delete their edges and reattach in order
        const parentLeft = left( parentNode );
        const parentRight = right( parentNode );

        let parentLeftEdge = null;
        let parentRightEdge = null;

        if ( parentLeft != undefined ) {
          parentLeftEdge = getEdgeBetween( parentNode, parentLeft );
        }
        if ( parentRight != undefined ) {
          parentRightEdge = getEdgeBetween( parentNode, parentRight );
        }

        if ( parentLeftEdge != null ) {
          deleteEdge( parentLeftEdge );
        }
        if ( parentRightEdge != null ) {
          deleteEdge( parentRightEdge );
        }

        // Add edges back in order
        relink( parentNode, childNode, true );
        relink( parentNode, parentRight, false );
        // relink( parentNode, childNode, true );

        // Remove the node
        deleteNode( node );
			} else if (right( parentNode ) != undefined && right( parentNode ) === node ) {// If node if the right child of parent
        // Grab all nodes involved and delete their edges and reattach in order
        const parentRight = right( parentNode );

        let parentRightEdge = null;

        if ( parentRight != undefined ) {
          parentRightEdge = getEdgeBetween( parentNode, parentRight );
        }

        if ( parentRightEdge != null ) {
          deleteEdge( parentRightEdge );
        }

        // Add edges back in order
        relink( parentNode, childNode, false );

        // Remove the node
        deleteNode( node );
			}
		} else {
			if ( isRoot( node ) ) {
        if ( left( node ) != undefined ) {
          deleteNode( left( node ) );
        }
        if ( right( node ) != undefined ) {
          deleteNode( right( node ) );
        }
        deleteNode( node );
				// root = null;
			} else if ( left( parentNode ) != undefined && left( parentNode ) === node ) {
				// parentNode.setLeft(null);
        deleteNode( node );
			} else if ( right( parentNode ) != undefined && right( parentNode ) === node ) {
				// parentNode.setRight(null);
        deleteNode( node );
			}
		}

		return undefined;
	}

// Will update the node with new weight
function set( node, newWeight ) {
  const oldValue = weight( node ); // If dummy it should be null/undefined

  if ( oldValue === undefined ) {
    display(`Replace sentinel leaf with new node!`);
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
    setShape(dummy, "circle");
    color(dummy, "white");
    setSize(dummy, 35);
    setAttribute(dummy, "dummy", false);
  });
}

function lookUp( node, w ) {
  // Check for undefined node
  if ( node === undefined || node === null ) {
    return undefined;
  }

  display(`Weight of '${node}': '${weight( node )}'`);

  if ( weight( node ) === undefined ) {
    // It is a dummy we can change ( leaf )
    return node;
  } else if ( weight( node ) > w ) {
    // Check leftChild
    // display(`Left child of '${node}' being checked!`);
    return lookUp( getLeft( node ), w );
  } else if ( weight( node ) < w ) {
    // Check rightChild
    // display(`Right child of '${node}' being checked!`);
    return lookUp( getRight( node ), w );
  } else {
    // They have the same weight!
    // display(`Node with weight '${w}' already exists!`);
    // Give the node with this weight
    return node;
  }
}

/**
 * For a RedBlack tree, we must check that the newly inserted
 * position has not created a double-red condition (i.e., the newly created
 * position is red and has a red parent)
 */
function actionOnInsert( node ) {
  if ( !isRoot( node ) ) {
    display(`Make new nodes red`)
    makeRed( node );
    resolveRed( node );
  } else {
    display(`If its a root node, make it black`)
    // If its a root node, make it black
    makeBlack( node );
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
    let sib = sibling( node );
    if ( isInternal( sib ) && ( isBlack( sib ) || isInternal( left( sib ) ) ) ) {
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

// const promptString = "Red-Black Trees\n"
//                      + "---------------\n"
//                      + "Choices:\n"
//                      + "0 - End Program\n"
//                      + "1 - Find Node\n"
//                      + "2 - Add Node\n"
//                      + "3 - Remove Node\n"
//                      + "---------------";

const promptString = "Red-Black Trees: \n"
                   + "Input the weight with its operation where \n"
                   + "\'+\'w - Adds a node with the weight \'w\' and \n"
                   + "\'-\'w - Delete a node with the weight \'w\' and then \n"
                   + "0 - Exits the program \n";

while ( true ) {
  cleanTree();

  // // const weight = promptNumber( "What is the weight and operation (weight is a number, +/- for add/delete, ex. -5 or +3) (0 to stop)" );
  // const weight = promptNumber( promptString );
  // if ( weight > 0 ){
  //   addNodeBST( getRoot(), weight );
  // } else if ( weight < 0 ){
  //   deleteNodeBST( getRoot(), - weight ); 
  // } else {    
  //   break;
  // }

  /*
  Look to add maybe a -weight for delete and a weight for either finding it 
  (if it exists) or adding the new weight if it is not found
  */
  const inWeight = promptNumber( promptString );

  if ( inWeight > 0 ) {

    put( inWeight );
    display(`Successfully updated the tree with a new node with the weight '${inWeight}'!`);

  } else if ( inWeight < 0 ) {
    
    const oldWeight = remove( -inWeight );
    if ( oldWeight != undefined ) {
      display(`Successfully updated the tree without the removed node with the weight '${oldWeight}'!`);
    }

  } else if ( inWeight == 0 ) {

    break;

  } else {  

    display( "That is not a valid selection!" );

  }
}

//cleanTree();

display( "The algorithm has finished" );