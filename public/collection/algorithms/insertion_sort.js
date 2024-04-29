Algorithm.configure({
    controlNodePosition: true
})

const HORIZONTAL_GAP = 100;
const VERTICAL_GAP = 50;

let nodeIds = getNodes();
showAllNodeWeights();

// line up the nodes
let i = 0; let j = 0
step(() => {
    for (const nodeId of nodeIds) {
        let initialPosition = {x: i, y: j};
        setPosition(nodeId, initialPosition);
        i += HORIZONTAL_GAP;
    }
})

let firstElement = nodeIds.shift(); // remove first element
step(() => {
    setPosition(firstElement, {x: 0, y: 2 * VERTICAL_GAP})
    setShape(firstElement, "star")
    color(firstElement, "yellow")
})
let sorted = [firstElement];

while ( nodeIds.length > 0 ) {
    let toInsert = nodeIds.shift()
    let index = sorted.length
    step(() => {
        display(`toInsert = ${toInsert}, weight = ${weight(toInsert)}`)
        setPosition(toInsert, {x: index * HORIZONTAL_GAP, y: VERTICAL_GAP})
        setShape(toInsert, "vee")
        color(toInsert, "blue")
    })
    while ( index > 0 && weight(toInsert) < weight(sorted[index - 1]) ) {
        index--;
        step(() => {
            color(sorted[index], "red")
            setShape(sorted[index], "triangle")
        })
        step(() => {
            incrementPosition(sorted[index], {x: HORIZONTAL_GAP, y: 0})
            incrementPosition(toInsert, {x: -HORIZONTAL_GAP, y: 0})
            color(sorted[index], "yellow")
            setShape(sorted[index], "star")
        })
    }
    if ( index < sorted.length ) { 
        step(() => {
            color(sorted[index], "yellow")
            setShape(sorted[index], "star")
        })
    }
    sorted.splice(index, 0, toInsert)
    step(() => {
        incrementPosition(toInsert, {x: 0, y: VERTICAL_GAP})
        setShape(toInsert, "star")
        color(toInsert, "yellow")
        display(`inserting: index = ${index}, weight = ${weight(toInsert)}`)
    })
}

// for (const nodeId of nodeIds) {
    // move it up by VERTICAL_GAP
    // insert it into sorted list (see below)
// }

// insert function, takes node and inserts it into sorted list, traversed in backwards order;
//      currentNode is current node in already sorted list
// while weight(node) < weight(currentNode)
//      move node left by HORIZONTAL_GAP
//      move currentNode right by HORIZONTAL_GAP
// move node down by VERTICAL_GAP