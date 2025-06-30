/**
 * This is a simple guide illustrating some common API calls used in algorithm animation programs.
 * Programs are written in JavaScript. You can usually implement an algorithm in JavaScript
 * and add animation effects using API calls.
 * For more details, see the examples and the User Guide at
 * https://docs.google.com/document/d/1FEi-RJ97UxsDuxHQrGmyOUanNWrWdq84NKicSdswGDY/view
 */

// Assume the graph has node "1" and edge "1,2" - weighted_7 is an example.
// Any string can be used as a node Id; an edge id is a string of the form "node1,node2".
// If the graph is undirected, the edge "1,2" is the same as "2,1".
let node = "1";
let edge = "1,2";

// Some common API calls for algorithm animation programs:
color(node, "yellow");  // Change the color of a node to yellow
setWeight(edge, 5);     // Set the weight of an edge to 5
label(node, "A");    // Set the label of a node to "A"
highlight(edge);        // Highlight an edge, i.e., make it thicker

// Do something for each outgoing edge from a given node
for ( let edge of outgoing(node) ) {
    // Do something with the edge, for example:
    highlight(edge);  // Highlight the edge
    // Do something with the other end of the edge
    let otherNode = other(node, edge);
    color(otherNode, "blue");       // Change the color of the other end node to blue
}

// Specify that a set of animation effects should be executed in a single step, i.e., simultaneously
step(() => {
    color(node, "green");                       // Change the color of a node to green
    setShape(node, "star");                     // Change the shape of a node to a star
    display(`Node ${node} has been visited`);   // Display a message
});

// Apply an effect to all nodes in the graph, typically at the start of an algorithm
// Similar API calls exist for other attributes and for edges.
hideAllNodeWeights();
