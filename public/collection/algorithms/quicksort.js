/**
 * An animation of Quicksort based on a project
 * submitted by Hayden Fuss, Solomon Yeh, and Jordan Connor
 * in CSC 316, Spring 2015.
 */

// Algorithm
//  function quicksort(list)
//      if list is empty or has one element, return list
//      pick a random pivot
//      let less = list of items < pivot
//      let equal = list of items = pivot (includes the pivot)
//      let greater = list of items > pivot
//      less = quicksort(less)
//      greater = quicksort(greater)
//      return append less, equal, greater

Algorithm.configure({
    controlNodePosition: true
})

const HORIZONTAL_GAP = 80;
const VERTICAL_GAP = 40;

/**
 * @return a random element of an array/list
 */
Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

/**
 * @return a list of weights of all the nodes in nodeList
 */
function weights(nodeList) {
    return nodeList.map((node) => weight(node))
}

function lineUpNodes(nodeList) {
    let level = 0; let index = 0
    step(() => {
        for ( const node of nodeIds ) {
    //      to avoid multiple steps, we need to do this "manually"
    //        placeNode(node, level, index, "white", "circle")
            setPosition(node, {x: HORIZONTAL_GAP * index, y: 2 * level * VERTICAL_GAP})
            color(node, "white")
            setShape(node, "circle")
            index++;
        }
    })
}

function placeNode(node, level, index, desiredColor, shape) {
    step(()=> {
//        display(`-> placeNode: ${node}, ${level}, ${index}`)
        setPosition(node, {x: HORIZONTAL_GAP * index, y: 2 * level * VERTICAL_GAP})
        color(node, desiredColor)
        setShape(node, shape)
    })
}

function placePivot(pivot, level, index) {
    step(() => {
//        display(`-> placePivot: ${pivot}, ${level}, ${index}`)
        setPosition(pivot, {x: HORIZONTAL_GAP * index, y: (2 * level - 1) * VERTICAL_GAP})
        color(pivot, "black")
        setShape(pivot, "triangle")
    })
}

function moveToSorted(node) {
    step(() => {
//        display(`-> moveToSorted: ${node}`)
        incrementPosition(node, {x: 0, y: -2 * VERTICAL_GAP})
        color(node, "yellow")
        setShape(node, "star")
    })
}

function quicksort(list, left, right, depth) {
    display(`-> [${weights(list)}], left = ${left}, right = ${right}, depth = ${depth}`)
    if ( list.length == 0 ) return list
    if ( list.length == 1 ) {
        step(() => {
            color(list[0], "yellow")
            setShape(list[0], "star")
        })
        return list
    }
    let pivot = list.random()
    display("  pivot = " + weight(pivot))
    placePivot(pivot, depth, right)
    let less = []
    let greater = []
    let equal = []
    let lessEnd = left
    let greaterEnd = right
    // partition
    for ( let node of list ) {
        if ( weight(node) < weight(pivot) ) {
            less.push(node)
            placeNode(node, depth, lessEnd, "red", "trapezoid")
            lessEnd++
        }
        else if ( weight(node) > weight(pivot) ) {
            greater.push(node)
            placeNode(node, depth, greaterEnd, "blue", "rhomboid")
            greaterEnd--;
        }
        else if ( node != pivot ) {
            equal.push(node)
            step(() => {
                color(node, "black")
                setShape(node, "triangle")
            })
        }
    }
    display("  less    = " + weights(less))
    display("  equal   = " + weights(equal))
    display("  greater = " + weights(greater))
    equal.push(pivot)
    for ( let node of equal ) {
        placeNode(node, depth, lessEnd, "yellow", "star")
        lessEnd++
    }
    less = quicksort(less, left, left + less.length - 1, depth + 1)
    greater = quicksort(greater, lessEnd, right, depth + 1)
    display("  less (sorted)    = " + weights(less))
    display("  greater (sorted) = " + weights(greater))

    list = less.concat(equal).concat(greater)
    for ( let node of list ) {
        moveToSorted(node)
    }
    display(`<- [${weights(list)}]`)
    return list
}

let nodeIds = getNodes();

step(() => {
    showAllNodeWeights();
    clearNodeColors();
    clearNodeShapes();
})

lineUpNodes(nodeIds)
quicksort(nodeIds, 0, nodeIds.length - 1, 1);