// time at which each node is discovered
let discoveryTimes = {};
// time at which each node has finished being explored
let finishTimes = {};
// used as a stack for visited nodes
//  - push when visit to a node is finished
//  - pop when nodes are visited in reverse order for strong components phase
let finished = [];
// Number of steps taken
let time = 1;
// component of a node or edge
let element_component = {}

/**
 * rotation of colors to use for components
 * @todo can add more colors that are supported by Cytoscape
 */
let component_color = ['brown', 'blue', 'red', 'violet', 'green']

/**
 * sets the component of the element (node or edge) and colors it;
 *  the component is used as a label and displayed
 */
function color_component(element, component) {
    step(() => {
        display(`component for ${element} is ${component}`)
        let color_index = component % component_color.length
        color(element, component_color[color_index])
        highlight(element)
        label(element, component)
    })
}

function set_component(element, component) {
    element_component[element] = component
}

function get_component(element) {
    return element_component[element]
}

function has_component(element) {
    return element in element_component
}

setDirected(true)
step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    clearNodeWeights()
    clearEdgeHighlights();
    clearEdgeColors();
    clearEdgeLabels();
    clearEdgeWeights();
})

/********** Main algorithm starts here ************/

let unvisited = new Set(getNodes());
while ( unvisited.size > 0 ) {
    let start = promptNodeFrom("Enter start node:", unvisited);
    visit(start);
}

step(() => {
    clearEdgeLabels()
    clearNodeLabels()
    clearNodeMarks()
    clearEdgeHighlights()
    clearEdgeColors()
})

display("Start reverse dfs")
let component = 1
while ( finished.length > 0 ) {
    let node = finished.pop()
    if ( ! has_component(node) ) {
        reverse_visit(node, component)
        component++
    }
}

/********** vist functions ****************/

function visit(node) {
    display(`visit ${node}`);
    unvisited.delete(node);
    step(() => {
        discoveryTimes[node] = time++;
        mark(node);
        label(node, discoveryTimes[node]);
    });

	for ( let edge of outgoing(node) ) {
	    let nextNode = other(node, edge);
        display(`considering neighbor ${nextNode}`)
        if ( ! marked(nextNode) ) { // not yet visited
            step(() => {
                display(`node ${nextNode} has not been visited`)
                highlight(edge);
                color(edge, "blue");
                highlight(nextNode);
            })
            visit(nextNode);
        } else if ( finishTimes[nextNode] == null ) { // ancestor
            step(() => {
                label(edge, "B");
                color(edge, "red");
            })
        } else if ( finishTimes[nextNode] > discoveryTimes[node] ) { // descendant
            step(() => {
                label(edge, "F");
                color(edge, "green");
            })
        } else {
            step(() => {
                label(edge, "C");
                color(edge, "orange");
            })
        }
    }
    finishTimes[node] = time++;
    label(node, discoveryTimes[node] + "/" + finishTimes[node]);
    finished.push(node);
}

/**
 * visit the node and check its incoming rather than outgoing neighbors
 * component is an integer denoting the current component number:
 *  also used to decide on a color for the component
 * here, we no longer care about discovery/finish times or types of edges
 */
function reverse_visit(node, component) {
    // do animation first, logic later
    display(`reverse visiting node ${node}`)
    step(() => {
        color_component(node, component)
        for ( let in_edge of incoming(node) ) {
            display(`incoming edge is ${in_edge}`)
            let neighbor = other(node, in_edge)
            if ( ! has_component(neighbor) ) {
                color_component(neighbor, component)
                color_component(in_edge, component)
            }
            else if ( component == get_component(neighbor) ) {
                color_component(in_edge, component)
            }
        }
    })
    // separating logic from animation
    set_component(node, component)
    for ( let in_edge of incoming(node) ) {
        let neighbor = other(node, in_edge)
        if ( ! has_component(neighbor) ) {
            set_component(neighbor, component)
            reverse_visit(neighbor, component)
        }
    }
}
