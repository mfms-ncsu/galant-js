/**
 * An animation of insertion sort
 */
const HORIZONTAL_GAP = 1;
const VERTICAL_GAP = 1;

let nodeIds = getNodes();

// line up the nodes
let i = 0; let j = 0
step(() => {
    for ( const nodeId of nodeIds) {
        setPosition(nodeId, i, j);
        i += HORIZONTAL_GAP;
    }
})

let firstElement = nodeIds.shift(); // remove first element
step(() => {
    setPosition(firstElement, 0, 2 * VERTICAL_GAP)
    setShape(firstElement, "star")
    color(firstElement, "yellow")
})
let sorted = [firstElement];

while ( nodeIds.length > 0 ) {
    let toInsert = nodeIds.shift()
    let index = sorted.length
    step(() => {
        display(`toInsert = ${toInsert}, weight = ${weight(toInsert)}`)
        setPosition(toInsert, index * HORIZONTAL_GAP, VERTICAL_GAP)
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
            incrementPosition(sorted[index], HORIZONTAL_GAP, 0)
            incrementPosition(toInsert, -HORIZONTAL_GAP, 0)
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
        incrementPosition(toInsert, 0, VERTICAL_GAP)
        setShape(toInsert, "star")
        color(toInsert, "yellow")
        display(`inserting: index = ${index}, weight = ${weight(toInsert)}`)
    })
}
display("Done: nodes are sorted by weight")

// for ( const nodeId of nodeIds) {
    // move it up by VERTICAL_GAP
    // insert it into sorted list (see below)
// }

// insert function, takes node and inserts it into sorted list, traversed in backwards order;
//      currentNode is current node in already sorted list
// while weight(node) < weight(currentNode)
//      move node left by HORIZONTAL_GAP
//      move currentNode right by HORIZONTAL_GAP
// move node down by VERTICAL_GAP
