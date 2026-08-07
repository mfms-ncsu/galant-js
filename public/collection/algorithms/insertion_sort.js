/**
 * An animation of insertion sort; use one of the example sorting graphs
 * or use them as models to create your own.
 */

setWeightsInside(true)

let nodeIds = getNodes();

// line up the nodes
let i = 0; let j = 0
step(() => {
    for ( const nodeId of nodeIds) {
        setPosition(nodeId, i, j);
        i++;
    }
})

let firstElement = nodeIds.shift(); // remove first element
step(() => {
    setPosition(firstElement, 0, 2)
    setShape(firstElement, "star")
    color(firstElement, "yellow")
})
let sorted = [firstElement];

while ( nodeIds.length > 0 ) {
    let toInsert = nodeIds.shift()
    let index = sorted.length
    step(() => {
        display(`toInsert = ${toInsert}, weight = ${weight(toInsert)}`)
        setPosition(toInsert, index, 1)
        setShape(toInsert, "vee")
        color(toInsert, "cyan")
    })
    while ( index > 0 && weight(toInsert) < weight(sorted[index - 1]) ) {
        index--;
        step(() => {
            color(sorted[index], "pink")
            setShape(sorted[index], "triangle")
        })
        step(() => {
            incrementPosition(sorted[index], 1, 0)
            incrementPosition(toInsert, -1, 0)
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
        incrementPosition(toInsert, 0, 1)
        setShape(toInsert, "star")
        color(toInsert, "yellow")
        display(`inserting: index = ${index}, weight = ${weight(toInsert)}`)
    })
}
display("Done: nodes are sorted by weight")

// for ( const nodeId of nodeIds) {
    // move it up by one unit
    // insert it into sorted list (see below)
// }

// insert function, takes node and inserts it into sorted list, traversed in backwards order;
//      currentNode is current node in already sorted list
// while weight(node) < weight(currentNode)
//      move node left by one unit
//      move currentNode right by one unit
// move node down by one unit
