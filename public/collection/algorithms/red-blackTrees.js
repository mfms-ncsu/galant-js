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


//CytoScapeInterface should handle dummy styling automatically in the future

setDirected(true);
let visit = 1;

// Looks for the root node by looking for inDegree of 0
function getRoot() {
  for (const x of getNodes()) {
    if (inDegree(x) === 0) {
      return x;
    }
  }
  return undefined;
}

//TODO: TEMP FIX. weight in thread.js is undefined, this is a NOT GOOD temp fix. Also breaks detecting adding duplicate nodes
// X MUST BE AN ID (STRING)
// function weight(x){
//   return x;
// }

function isLeaf(node) {
  return (outDegree(node) === 0);
}

function isRoot(node) {
  return (inDegree(node) === 0);
}

function children(node){
  return outgoingNodes(node);
}

function left(node){
  return children(node)[0];
}

function right(node){
  return children(node)[1];
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


// Main adding logic
// Uses same value k for id and weight
function addNodeBST(x, k) {

  // If empty, make new root
  if (x === undefined) {
    console.log("undefined root: ", getRoot());
    const newNode = addNode(0,0)
    setWeight(newNode, k);
    display(`Created root '${k}'`);
    return;
  }

  // Show the step to the user
  step(() => {
    mark(x);
    highlight(x);
    //label(x, "#" + visit++);
  });

  // Found duplicate node
  if (k === weight(x)) {
    display(`Node with key '${k}' already exists`);
    return;
  }

  //TODO: fix infinite loop
  // If leaf, attach two dummies (tree input will not contain dummies)
  // Do dummies count towards outgoing edges? How do I know if it is a leaf if it has dummy kids? 
  // How do I make sure there's only 1 layer of dummies? (adding too many already)
  if (isLeaf(x)) {
    
    addEdge(x, createDummy());
    addEdge(x, createDummy());
    if (k < weight(x)) {
      replaceDummy(x, left(x), k, "left")
    } else {
      replaceDummy(x, right(x), k, "right")
    } 
  }

  //check if leaf, is leaf, add 2 dummies, replace the correct one
  //if not a leaf, check which child is a dummy (should only be 1), either recurse or replace

  // At the end of the tree or recursive call
  if (k < weight(x)) {
    const L = left(x);
    if (L && getAttribute(L, "dummy")) { //end, replace dummy
      return replaceDummy(x, L, k, "left");
    } else {
      return addNodeBST(L, k);  //not end, recur
    }
  } else if (k > weight(x)) {
    const R = right(x);
    if (R && getAttribute(R, "dummy")) { //end, replace dummy
      return replaceDummy(x, R, k, "right");
    } else {
      return addNodeBST(R, k);  //not end, recur
    }
  }
  display("Error: BSTadd did not recur or add a node.");
}

//!promptBoolean("Is the tree done?")
while (true){
  step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    //clearNodeWeights();
    clearEdgeHighlights();
    clearEdgeColors();
    visit = 1;
  });

  let k = promptNumber("What is the weight (key) of the new node?");
  console.log("root: ", getRoot());
  addNodeBST(getRoot(), k);
}

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
  return getColor( node ) === "black";
}

/**
 * Returns true if the given position is red (it's property = 1)
 * 
 * @param p the position for which to determine if the color is red
 * @return true if the position's property/color is red
 */
function isRed( node ) {
  // return getBorderColor( node ) === "red"; // Update with border change
  return getColor( node ) === "red";
}

/**
 * Set the color of the given position to be black (property = 0)
 * 
 * @param p the position for which to make black
 */
function makeBlack( node ) {
  // setAttribute( borderColor( "black" ) ) // Something like this
  color( node, "black" );
  return;
}

/**
 * Set the color of the given position to be red (property = 1)
 * 
 * @param p the position for which to make red
 */
function makeRed( node ) {
  // setAttribute( borderColor( "red" ) ) // Something like this
  color( node, "red" );
  return;
}

/**
 * Resolves a double-red condition in a red-black tree where a red position has
 * a red child
 * 
 * @param p the position that may have a red parent
 */
function resolveRed( node ) {

  // Position<Entry<K, V>> node = p;
  // Position<Entry<K, V>> parent = parent(p);
  // if (isRed(parent)) {
  //   Position<Entry<K, V>> uncle = sibling(parent);
  //   // CASE 1: the uncle (sibling of the parent) is black
  //   if (isBlack(uncle)) {
  //     Position<Entry<K, V>> middle = restructure(node);
  //     makeBlack(middle);
  //     makeRed(left(middle));
  //     makeRed(right(middle));
  //   } else {
  //     // CASE 2: the uncle (sibling of the parent) is red
  //     makeBlack(parent);
  //     makeBlack(uncle);
  //     Position<Entry<K, V>> grandparent = parent(parent);
  //     if (!isRoot(grandparent)) {
  //       makeRed(grandparent);
  //       resolveRed(grandparent);
  //     }
  //   }
  // }

  let parent = parent( node );

  if ( isRed( parent ) ) {
    let uncle = sibling( parent );
    // CASE 1: the uncle (sibling of the parent) is black
    if ( isBlack( uncle ) ) {
      // Restructure and re-color children
      let middle = restructure( node );
      makeBlack( middle );
      makeRed( left( middle ) );
      makeRed( right( middle ) );
    } else {
      // CASE 2: the uncle (sibling of the parent) is red
      makeBlack( parent );
      makeBlack( uncle );
      let grandparent = parent( parent );
      if ( !isRoot( grandparent ) ) {
        makeRed( grandparent );
        resolveRed( grandparent );
      }
    }
  }
}

/**
 * Resolves the double-black condition where the black-depths of the sentinel
 * leaves are no longer equal.
 * 
 * @param p the position at which the double-black condition is located
 */
function remedyDoubleBlack( node ) {

  // Position<Entry<K, V>> node = p;
  // Position<Entry<K, V>> parent = parent(p);
  // Position<Entry<K, V>> sibling = sibling(node);
  
  // if (isBlack(sibling)) {
  //   // CASE 1: trinode restructuring
  //   if (isRed(left(sibling)) || isRed(right(sibling))) {
  //     Position<Entry<K, V>> temp = null;
  //     if (isRed(left(sibling))) {
  //       temp = left(sibling);
  //     } else {
  //       temp = right(sibling);
  //     }
  //     Position<Entry<K, V>> middle = restructure(temp);
  //     if (isRed(parent)) {
  //       makeRed(middle);
  //     } else {
  //       makeBlack(middle);
  //     }
  //     makeBlack(left(middle));
  //     makeBlack(right(middle));
  //   } else {
  //     // CASE 2: recoloring
  //     makeRed(sibling);
  //     if (isRed(parent)) {
  //       makeBlack(parent);
  //     } else if (!isRoot(parent)) {
  //       remedyDoubleBlack(parent);
  //     }
  //   }
  // } else {
  //   // CASE 3: Rotate
  //   rotate(sibling);
  //   makeBlack(sibling);
  //   makeRed(parent);
  //   remedyDoubleBlack(node);
  // }

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

/**
 * {@inheritDoc} For a RedBlack tree, we must check that the newly inserted
 * position has not created a double-red condition (i.e., the newly created
 * position is red and has a red parent)
 */
function actionOnInsert( node ) {
  // if (!isRoot(p)) {
  //   makeRed(p);
  //   resolveRed(p);
  // }

  if ( !isRoot( node ) ) {
    makeRed( node );
    resolveRed( node );
  }
}

/**
 * {@inheritDoc} For a RedBlack tree, we must check that the removed position
 * has not created a double-black condition (i.e., a situation in which the
 * black-depth property of the tree is violated)
 */
function actionOnDelete( node ) {
  // if (isRed(p)) {
  //   makeBlack(p);
  // } else if (!isRoot(p)) {
  //   Position<Entry<K, V>> sib = sibling(p);
  //   if (isInternal(sib) && (isBlack(sib) || isInternal(left(sib)))) {
  //     remedyDoubleBlack(p);
  //   }
  // }

  if ( isRed( node ) ) {
    makeBlack( node );
  } else if ( !isRoot( node )) {
    let sib = sibling( node );
    if ( isInternal( sib ) && ( isBlack( sib ) || isInternal( left( sib ) ) ) ) {
      remedyDoubleBlack( node );
    }
  }
}

// *****************************
// BalanceableBinaryTree Methods
// *****************************

/**
 * Relink two positions to create a parent-child relationship
 * 
 * @param parent        the position that will become the parent of the child
 * @param child         the position that will be come a child of the parent
 * @param makeLeftChild indicates whether the child should be a left child
 *                      (true) or not (false)
 */
function relink( parent,  child, makeLeftChild ) {
  child.setParent( parent );
  if ( makeLeftChild ) {
      parent.setLeft( child );
  } else {
      parent.setRight( child );
  }
}

/**
 * Performs a single rotation of a position, p, around it's parent. If
 * necessary, the grandparent must be updated to now refer to p as its child; p
 * must be updated to indicate its parent is now its child
 * 
 * @param p the position to rotate around its parent
 */
function rotate( node ) {

  // Track the three nodes involved in the rotation
  // BinaryTreeNode<Entry<K, V>> node = validate(p);
  // BinaryTreeNode<Entry<K, V>> parent = node.getParent();
  // BinaryTreeNode<Entry<K, V>> grandparent = parent.getParent();

  // if (grandparent == null) {
  //   setRoot(node);
  //   node.setParent(null);
  // } else {
  //   if (parent == left(grandparent)) {
  //     relink(grandparent, node, true);
  //   } else {
  //     relink(grandparent, node, false);
  //   }
  // }

  // if (node == left(parent)) {
  //   relink(parent, node.getRight(), true);
  //   relink(node, parent, false);
  // } else {
  //   relink(parent, node.getLeft(), false);
  //   relink(node, parent, true);
  // }

  let parent = node.getParent();
  let grandparent = parent.getParent();

  if ( grandparent == null ) {
    setRoot( node );
    node.setParent( null );
  } else {
    if ( parent == left( grandparent ) ) {
      relink( grandparent, node, true );
    } else {
      relink( grandparent, node, false );
    }
  }

  if ( node == left( parent ) ) {
    relink( parent, node.getRight(), true );
    relink( node, parent, false );
  } else {
    relink( parent, node.getLeft(), false );
    relink( node, parent, true );
  }

}

/**
 * Performs a trinode restructuring and returns the position at its final,
 * rotated position.
 * 
 * @param x the position that represents x in a trinode restructuring of x, its
 *          parent y, and its grandparent z
 * @return the position at its final, rotated position
 */
function restructure( node ) {
  
  // Track the three nodes involved in the restructuring
  //Position<Entry<K, V>> node = x;
  // Position<Entry<K, V>> parent = parent(x);
  // Position<Entry<K, V>> grandparent = parent(parent);

  // if ((x == left(parent) && parent == left(grandparent)) || 
  //     (x == right(parent) && parent == right(grandparent))) {
  //     // rotate the parent around the grandparent
  //     rotate(parent);
  //     return parent;
  // } else {
  //     // rotate the node around the parent twice
  //     rotate(x);
  //     rotate(x);
  //     return x;
  // }

  let parent = parent( node );
  let grandparent = parent( parent );

  if ( (node == left( parent ) && parent == left( grandparent ) ) || 
      ( nodd == right( parent ) && parent == right( grandparent ) ) ) {
      // rotate the parent around the grandparent
      rotate( parent );
      return parent;
  } else {
      // rotate the node around the parent twice
      rotate( node );
      rotate( node );
      return node;
  }
}

// *******************
// Tree Action Methods
// *******************

function addNodeBST(x, k) {

  // If empty, make new root
  if (x === undefined) {
    const newNode = addNode(0,0)
    setWeight(newNode, k);
    display(`Created root '${k}'`);
    return;
  }

  accentNode(x);

  // Found duplicate node
  if (k === weight(x)) {
    display(`Node with key '${k}' already exists`);
    return;
  }

  // If a leaf, then add 2 dummy nodes
  if (isLeaf(x)) {    
    step(()=>{
      addEdge(x, createDummy());
      addEdge(x, createDummy());
    });
    step(()=>{
      if (k < weight(x)) {
        convertDummy(x, left(x), k, "left")
      } else {
        convertDummy(x, right(x), k, "right")
      } 
    });
    return;
  }

  // At the end of the tree or recursive call
  if (k < weight(x)) {
    const L = left(x);
    if (L && getAttribute(L, "dummy")) { //end, replace dummy
      return convertDummy(x, L, k, "left");
    } else {
      return addNodeBST(L, k);  //not end, recur
    }
  } else if (k > weight(x)) {
    const R = right(x);
    if (R && getAttribute(R, "dummy")) { //end, replace dummy
      return convertDummy(x, R, k, "right");
    } else {
      return addNodeBST(R, k);  //not end, recur
    }
  }
  display("Error: BSTadd did not recur or add a node.");
}


function deleteNodeHelper(p, x){
  const k = weight(x);
  if (p){
    addEdge(p, createDummy());
    deleteEdge(getEdgeBetween(p, x))
  }
  deleteNode(x);
  display(`Successully deleted: '${k}'`);
}

function deleteNodeBST(x, k) {
  // Couldn't find node we are trying to delete, error
  if (x === undefined || getAttribute(x, "dummy") || (isLeaf(x) && k != weight(x))){
    display(`Could not find node '${k}' to delete`);
    return;
  }

  accentNode(x);

  //Not a leaf, and not == k, keep searching
  if (k < weight(x)) {
    return deleteNodeBST(left(x), k);    
  } else if (k > weight(x)) {
    return deleteNodeBST(right(x), k);
  }

  //If we get here, k must equal weight(x???
  display(`'${k}' FOUND, deleting`);

  const p = parent(x);
  const L = left(x);
  const R = right(x);
  const leftDum = L && getAttribute(L, "dummy");
  const rightDum = R && getAttribute(R, "dummy");
  let S = null;
    if (p) {
        S = left(p) === x ? right(p) : left(p);
    }
  const sibDum = S && getAttribute(S, "dummy");

  //CASE 1: DELETE A LEAF
  if (isLeaf(x)){
    //if sibling is a dummy, delete this and the sibling, otherwise turn this to a dummmy
    if (sibDum){
      deleteNode(x);
      deleteNode(S);
      display(`Deleted leaf '${k}' and its dummy sibling`);
      return;
    } else {
      deleteNodeHelper(p, x);
      display(`Successully deleted: '${k}'`);
      return;
    }
  }

  //CASE 2: DELETE WITH 2 CHILDREN
  if (!leftDum && !rightDum){
    // Find in-order predecessor
    let predecessor = findInOrderPredecessor(L);
    // Replace deleted node weight with in-order predecessor weight
    let predWeight = weight(predecessor);

    // Call delete on in-order predecessor
    deleteNodeBST(x, predWeight);
    setWeight(x, predWeight);
  } 
  //1 of each

  //CASE 3: DELETE WITH 1 CHILD
  else if (!rightDum){
    if (p){      

      // Replace this node's weight with its only child and store its children
      setWeight(x, weight(R));
      const newChildren = children(R);

      // Delete both children
      children(x).forEach( (child) => {
          display(`Deleting edge between '${weight(x)}' and '${weight(child)}'`);
          deleteEdge(getEdgeBetween(x, child));
          deleteNode(child);
      });

      // Reattach new children
      newChildren.forEach((child) => {
          addEdge(x, child);
      });
      
    }
  } else {
    if (p){

      // Replace this node's weight with its only child and store its children
      setWeight(x, weight(L));
      let newChildren = children(L);

      // Delete both children
      children(x).forEach((child) => {
        display(`Deleting edge between '${weight(x)}' and '${weight(child)}'`);
        deleteEdge(getEdgeBetween(x, child));
        deleteNode(child);
      });

      // Reattach new children
      newChildren.forEach((child) => { 
          addEdge(x, child);
      });
    }
  }

  //deleteNode(x);
  display(`Successully deleted: '${k}'`);
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

// /**
//  * This will be the method where we change/create nodes
//  */
// public V put(K key, V value) {
//     // Create the new map entry
//     Entry<K, V> newEntry = new MapEntry<K, V>(key, value);

//     // Get the last node visited when looking for the key
//     Position<Entry<K, V>> p = lookUp(root(), key);

//     // If the last node visited is a dummy/sentinel node
//     if (isLeaf(p)) {
//         expandLeaf(p, newEntry);
//         // actionOnInsert is a "hook" for our AVL, Splay, and Red-Black Trees to use
//         actionOnInsert(p);
//         return null;
//     } else {
//         V original = p.getElement().getValue();
//         set(p, newEntry);
//         // actionOnAccess is a "hook" for our AVL, Splay, and Red-Black Trees to use
//         actionOnAccess(p);
//         return original;
//     }
// }

// public V remove(K key) {
//     // Get the last node visited when looking for the key
//     Position<Entry<K, V>> p = lookUp(root(), key);

//     // If p is a dummy/sentinel node
//     if ( isLeaf(p) ) {
//         // actionOnAccess is a "hook" for our AVL, Splay, and Red-Black Trees to use
//         actionOnAccess(p);
//         return null;
//     } else {
//         V original = p.getElement().getValue();
//         // If the node has two children (that are not dummy/sentinel nodes)
//         if (isInternal(left(p)) && isInternal(right(p))) {
//             // Replace with the inorder successor
//             Position<Entry<K, V>> replacement = treeMin(right(p));
//             set(p, replacement.getElement());
//             // Move the reference p to the replacement node in the right subtree
//             p = replacement;
//         }
//         // Get the dummy/sentinel node (in case the node has an actual entry as a
//         // child)...
//         Position<Entry<K, V>> leaf = (isLeaf(left(p)) ? left(p) : right(p));
//         // ... then get its sibling (will be another sentinel or an actual entry node)
//         Position<Entry<K, V>> sib = sibling(leaf);
//         // Remove the leaf NODE (this is your LinkedBinaryTree remove method)
//         remove(leaf);
//         // Remove the NODE (this is your LinkedBinaryTree remove method)
//         // which will "promote" the sib node to replace p
//         remove(p);
//         // actionOnDelete is a "hook" for our AVL, Splay, and Red-Black Trees to use
//         actionOnDelete(sib);
//         return original;
//     }
// }

/**
 * For a RedBlack tree, we must check that the newly inserted
 * position has not created a double-red condition (i.e., the newly created
 * position is red and has a red parent)
 */
function actionOnInsert( node ) {
  if ( !isRoot( node ) ) {
    makeRed( node );
    resolveRed( node );
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
                     + "---------------\n";

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

    const weight = promptNumber( "What is the weight of the node we are finding?" );

  } else if ( choice == 2 ) {

    const weight = promptNumber( "What is the weight of the new node?" );
    addNodeBST( getRoot(), weight );

  } else if ( choice == 3 ) {

    const weight = prompt( "What is the weight of the node we are deleting" );    
    deleteNodeBST( getRoot(), weight );

  } else if ( choice == 0 ) {

    break;

  } else {  

    display( "That is not a valid selection!" );

  }
}

display( "The algorithm has finished" );