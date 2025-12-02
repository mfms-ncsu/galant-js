/**
* Allows the user to create a BST just with prompting.
* They will be prompted to enter a number -->
*    - If the number is positive, it is added to the tree
*    - If the number is negative, it is deleted from the tree
*    - If the number is 0, the algorithm stops
*/


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
    clearEdgeHighlights();
    clearEdgeColors();
  });
}

//-----------------UNIQUE BST FNS-------------------

// Call this on the left child of the subtree root
function findInOrderPredecessor(currentNode){
  // While there is a real right child, go right
  mark(currentNode)
  while( getRight(currentNode) && getAttribute(getRight(currentNode), "dummy") != true ){
    
    // If a real right child exists, recur
    return findInOrderPredecessor(getRight(currentNode));
  }

  // If I have no real right child, I am the predecessor
  display(`Found predecessor at '${weight(currentNode)}'`)
  return currentNode
}


function dummify( nodeId ){
  setAttribute(nodeId, "dummy", true);
  setAttribute(nodeId, "weight", undefined);
  return nodeId;
}

function undummify( nodeId, weight ){
  setAttribute(nodeId, "dummy", false);
  setAttribute(nodeId, "weight", weight);
  display(`Successfully added node '${weight}'`)
  return nodeId;
}

function createDummy(){
  const dummy = addNode(0,0)
  setAttribute(dummy, "dummy", true);
  return dummy;
}

//-----------------ADD/DELETE-------------------
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
      if (k < weight(x)) {
        addLeft( x, k);
        dummify(addRight(x, undefined));
      } else {
        addRight(x, k);
        dummify(addLeft(x, undefined));
      } 
      display(`Successfully added node '${k}'`)
    });
    return;
  }

  // At the end of the tree or recursive call
  if (k < weight(x)) {
    const L = getLeft(x);
    if (L && getAttribute(L, "dummy")) { //end, replace dummy
      return undummify(L, k);
    } else {
      return addNodeBST(L, k);  //not end, recur
    }
  } else if (k > weight(x)) {
    const R = getRight(x);
    if (R && getAttribute(R, "dummy")) { //end, replace dummy
      return undummify(R, k);
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

function deleteNodeBST(x, k, hideDisplay) {
  // Couldn't find node we are trying to delete, error
  if (x === undefined || getAttribute(x, "dummy") || (isLeaf(x) && k != weight(x))){
    if( !hideDisplay ){
      display(`Could not find node '${k}' to delete`);
    }
    return;
  }

  accentNode(x);

  //Not a leaf, and not == k, keep searching
  if (k < weight(x)) {
    return deleteNodeBST(getLeft(x), k, hideDisplay);    
  } else if (k > weight(x)) {
    return deleteNodeBST(getRight(x), k, hideDisplay);
  }

  const p = getParent(x);
  const L = getLeft(x);
  const R = getRight(x);
  const leftDum = L && getAttribute(L, "dummy");
  const rightDum = R && getAttribute(R, "dummy");
  let S = null;
    if (p) {
        S = getLeft(p) === x ? getRight(p) : getLeft(p);
    }
  const sibDum = S && getAttribute(S, "dummy");

  //CASE 1: DELETE A LEAF
  if (isLeaf(x)){
    //if sibling is a dummy, delete this and the sibling, otherwise turn this to a dummmy
    if (sibDum){
      deleteNode(x);
      deleteNode(S);
      if( !hideDisplay ){
        display(`Deleted leaf '${k}' and its dummy sibling`);
      }
      return;
    } else if( getRoot() != x ){
      dummify(x);
      if( !hideDisplay ){
        display(`Successully deleted: '${k}'`);
      }
      return;
    }else{
      deleteNode(x);
      if( !hideDisplay ){
        display(`Successully deleted: '${k}'`);
      }
    }
  }

  //CASE 2: DELETE WITH 2 CHILDREN
  else if (!leftDum && !rightDum){

    // Find in-order predecessor
    let predecessor = findInOrderPredecessor(L);

    // Replace deleted node weight with in-order predecessor weight
    step(() =>{
      let predWeight = weight(predecessor);
      // Call delete on in-order predecessor
      deleteNodeBST(x, predWeight, true);
      setWeight(x, predWeight);
      if( !hideDisplay ){
        display(`Successully deleted: '${k}'`)
      }
    });
  } 

  //CASE 3: DELETE WITH 1 CHILD
  else if (!rightDum){
    if (p){      

      // Replace this node's weight with its only child and store its children
      setWeight(x, weight(R));
      const newChildren = getChildren(R);

      // Delete both children
      step(() => {
        getChildren(x).forEach( (child) => {
            deleteNode(child);
        });
      });

      // Reattach new children
      step(() => {
        newChildren.forEach((child) => {
            addEdge(x, child);
        });
      });
      
    }else{
      step(() => {
        deleteNode(L);
        deleteNode(x);
      });
    }
  } else {
    if (p){

      // Replace this node's weight with its only child and store its children
      setWeight(x, weight(L));
      let newChildren = getChildren(L);
      // Delete both children
      step(() => {
        getChildren(x).forEach((child) => {
          deleteNode(child);
        });
      });

      // Reattach new children
      step(() => {
        newChildren.forEach((child) => { 
          addEdge(x, child);
        });
      });
    }else{
      step(() => {
        deleteNode(R);
        deleteNode(x);
      });
    }
  }

  if( !hideDisplay ){
    display(`Successully deleted: '${k}'`);
  }
}

// Cannot store values <= 0
setDirected(true);
let running = true;
while (running){
  cleanTree();
  const weight = promptNumber("What is the weight and operation (weight is a number, +/- for add/delete, ex. -5 or +3) (0 to stop)")

  if (weight > 0){
    addNodeBST(getRoot(), weight);
  } else if (weight < 0){
    deleteNodeBST(getRoot(), -weight);  
  } else {    
    running = false; 
  }
}

display("The tree is done; the algorithm is finished");
