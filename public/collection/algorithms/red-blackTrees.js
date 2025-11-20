/**
 * BinaryTreeBuilder algorithm that prompts the user to add or remove nodes until user says to stop
 * Based on Bryan's Binary Search, peer programmed with Andrew
 * 
 * Q1 is the tree done, yes = stop
 * Q2 Do you want to add a node, yes = add
 * Q3 Do you want to delete a node, yes = delete
 * Q4 If adding, what is the weight, if removing, what is the id (id is 1st/big #, weight is 4th/lil #)
 * Maybe need to do error checking (might be done already in thread.js)
 * If adding, get the parent via binary tree search (adding the first node/root may be a special case)
 * If deleting, use right successor (leaf is easy, handle cases for deleteing a parent, root may be a special case)
 * Do add/delete
 * Loop
 */

// const { getNodeText } = require("@testing-library/react");


//CytoScapeInterface should handle dummy styling automatically in the future

setDirected(true);
let visit = 1;

//TODO: TEMP FIX. weight in thread.js is undefined, this is a NOT GOOD temp fix. Also breaks detecting adding duplicate nodes
// X MUST BE AN ID (STRING)
// function weight(x){
//   return x;
// }

//-----------------TreeInterface will later replace these fns with their own, need them here for now-------------------
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
  return children(node)[0];
}

function right(node){
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

// A loaded tree does not have dummies. Should add them at the start.
// Uses up IDs. is that ok???
function dummifyTree(node) {
  if (!node){
    return;
  } 
  // Skip if node is a dummy
  if (getAttribute(node, "dummy")){
    return;
  }
  // If leaf, add two dummies
  if (children(node).length === 0) {
    addEdge(node, createDummy());
    addEdge(node, createDummy());
    return;
  }
  // Otherwise, recursive call on each child
  dummifyTree(left(node));
  dummifyTree(right(node));
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
 * @param parentN        the position that will become the parent of the child
 * @param child         the position that will be come a child of the parent
 * @param makeLeftChild indicates whether the child should be a left child
 *                      (true) or not (false)
 */
function relink( parentN,  child, makeLeftChild ) {
  // makeLeftChild was used earlier but rotate 
  // was updated to fit left and right edge adding
  // still convinent to see when in rotate()
  // addEdge( parentN, child );

  // setParent( child, parentN );
  if ( makeLeftChild ) {
    return setLeft( parentN, child );
  } else {
    return setRight( parentN, child );
  }
}

/**
 * Performs a single rotation of a position, p, around it's parent. If
 * necessary, the grandparent must be updated to now refer to p as its child; p
 * must be updated to indicate its parent is now its child
 * 
 * @param node the position to rotate around its parent
 */
function rotate( node ) {

  let parentN = parent( node );
  let grandparent = parent( parentN );

  display(`Rotate: We will rotate node '${node}' around its parent '${parentN}'...`);
  // display(`...and if needed, the grandparent will refer to node '${node}' as its child`);

  step(() => {

    // Get all nodes involved
    //let grandparentParent = parent( grandparent );
    let grandparentLeft = null;
    let grandparentRight = null;
    let parentLeft = left( parentN );
    let parentRight = right( parentN );
    let nodeLeft = left( node );
    let nodeRight = right( node );


    let grandparentLeftEdge = null;
    let grandparentRightEdge = null;
    // const parentParentEdge = getEdgeBetween( grandparent, parentN );
    const parentLeftEdge = getEdgeBetween( parentN, parentLeft );
    const parentRightEdge = getEdgeBetween( parentN, parentRight );
    // const nodeParentEdge = getEdgeBetween( parentN, node );
    const nodeLeftEdge = getEdgeBetween( node, nodeLeft );
    const nodeRightEdge = getEdgeBetween( node, nodeRight );

    if ( grandparent != undefined ) {
      // Update the children
      grandparentLeft = left( grandparent );
      grandparentRight = right( grandparent );

      // Update edges
      grandparentLeftEdge = getEdgeBetween( grandparent, grandparentLeft );
      grandparentRightEdge = getEdgeBetween( grandparent, grandparentRight );
    }


    // Now check and rotate nodes
    if ( grandparent === undefined ) { // Check NULL
      setRoot( node, false );
      setParent( node, null );
    } else {
      if ( parentN === left( grandparent ) ) {
        // Here we have to delete both left and 
        // right edges and put them back into order
        // deleteEdge( grandparentRightEdge );
        // deleteEdge( grandparentLeftEdge );

        relink( grandparent, node, true );
        relink( grandparent, grandparentRight, false );
        // relink( grandparent, node, true );
      } else {
        // We can reattach node without grandparents left child
        // deleteEdge( grandparentRightEdge );

        relink( grandparent, grandparentLeft, true );
        relink( grandparent, node, false );
      }
    }

    if ( node === parentLeft ) {
      // Delete all edges involved
      // deleteEdge( parentLeftEdge );
      // deleteEdge( parentRightEdge );

      // deleteEdge( nodeRightEdge );

      // And add all edges back left to right, top to bottom, for each node
      // Make sure to check for left edges first then right
      relink( node, parentN, false );

      relink( parentN, nodeRight, true );
      relink( parentN, parentRight, false );
      // relink( parentN, nodeRight, true );
    } else {
      // Delete all edges involved
      // deleteEdge( parentRightEdge );

      // deleteEdge( nodeLeftEdge );
      // deleteEdge( nodeRightEdge );

      // And add all edges back left to right, top to bottom, for each node
      // Make sure to check for left edges first then right
      relink( node, parentN, true );
      relink( node, nodeRight, false );
      // relink( node, parentN, true );

      relink( parentN, nodeLeft, false );
    }

  });

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
      rotate( parentN );
      return parentN;
  } else {
      // rotate the node around the parent twice
      display(`Restructure: If the parent ('${parentN}') is not the same side child as node ('${node}') is to parent...`);
      display(`...then we rotate the node ('${node}') around the parent ('${parentN}') twice`);
      rotate( node );
      rotate( node );
      return node;
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

  let parent = parent( node );
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

      let middle = restructure( temp );
      if ( isRed( parent ) ) {
        makeRed( middle );
      } else {
        makeBlack( middle );
      }
      makeBlack( left( middle ) );
      makeBlack( right( middle ) );
    } else {
      // CASE 2: recoloring
      makeRed( sibling );
      if ( isRed( parent ) ) {
        makeBlack( parent );
      } else if ( !isRoot( parent ) ) {
        remedyDoubleBlack( parent );
      }
    }
  } else {
    // CASE 3: Rotate
    rotate( sibling );
    makeBlack( sibling );
    makeRed( parent );
    remedyDoubleBlack( node );
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

function createDummy(){
  const dummy = addNode(0,0)
  setShape(dummy, "square");
  color(dummy, "black");
  setSize(dummy, 20);
  setAttribute(dummy, "dummy", true);
  return dummy;
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
    // addLeft( newNode, createDummy() );
    // addRight( newNode, createDummy() );
    step(()=>{
      addEdge( newNode, createDummy() );
      addEdge( newNode, createDummy() );
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

function lookUp( root, w ) {
  // Check for undefined node/root
  if ( root === undefined || root === null ) {
    return undefined;
  }

  if ( weight( root ) === undefined ) {
    // It is a dummy we can change ( leaf )
    return root;
  } else if ( weight( root ) > w ) {
    // Check leftChild
    // display(`Left child of '${root}' being checked!`);
    return lookUp( getLeft( root ), w );
  } else if ( weight( root ) < w ) {
    // Check rightChild
    // display(`Right child of '${root}' being checked!`);
    return lookUp( getRight( root ), w );
  } else {
    // They have the same weight!
    // display(`Node with weight '${weight}' already exists!`);
    // Give the node with this weight
    return root;
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

const promptString = "Red-Black Trees\n"
                     + "---------------\n"
                     + "Choices:\n"
                     + "0 - End Program\n"
                     + "1 - Find Node\n"
                     + "2 - Add Node\n"
                     + "3 - Remove Node\n"
                     + "---------------";

// const promptString = "Red-Black Trees\n" 
//                    + "---------------\n"
//                    + "Input the weight with its operation:\n"
//                    + "\'+\'w - Add node with weight \'w\'\n"
//                    + "\'-\'w - Delete node with weight \'w\'\n"
//                    + "0 - Exit Program\n"
//                    + "---------------\n";

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
  const choice = promptNumber( promptString );

  if ( choice == 1 ) {

    const inWeight = promptNumber( "What is the weight of the node we are finding?" );

  } else if ( choice == 2 ) {

    const inWeight = promptNumber( "What is the weight of the new node?" );
    // // let node = addNodeBST( getRoot(), weight );

    // // Red-Black Trees
    // if ( node ) {
    //   display( `Check rules after addition of node '${node}'` );
    //   actionOnInsert( node );
    // }

    put( inWeight );
    display(`Successfully updated the tree with a new node with the weight '${inWeight}'!`);

  } else if ( choice == 3 ) {

    const inWeight = prompt( "What is the weight of the node we are deleting" );    
    // deleteNodeBST( getRoot(), weight );
    const oldWeight = remove( inWeight );
    if ( oldWeight != undefined ) {
      display(`Successfully updated the tree without the removed node with the weight '${oldWeight}'!`);
    }

  } else if ( choice == 0 ) {

    break;

  } else {  

    display( "That is not a valid selection!" );

  }
}

//cleanTree();

display( "The algorithm has finished" );