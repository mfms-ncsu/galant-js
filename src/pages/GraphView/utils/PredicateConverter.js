import Graph from "utils/Graph";
import EdgeObject from "./EdgeObject";

// Default node size when converting the radius of the node to Cytoscape
const nodeSize = 30;

/**
 * Helper function for predicateConverter which handles the directed and undirected objects.
 *
 * @param elements - the elements list to push newly created graph objects to.
 * @param {EdgeObject[]} edges the list of edges in the graph 
 * @param isDirected - boolean True or False telling the function whether to include a `classes: ['directed']` clause in the graph object.
 *
 * @returns - The converted elements
 *
 * @author Andrew Watson
 * @author Noah Alexander
 * @author Rishabh Karwa
 * @author Andrew Lanning
 */
function convertEdges(predicate, elements, edges, isDirected, edgeWeights, edgeLabels) {
    if (!edges || edges.length === 0) return;
    //Loops through all keys inside of the edges dictionary and gets all the pieces
    edges.forEach((edge) => {
        let element = {
            data: {}
        };
        // Go through each "attribute" in the object and assign a matching name and value key-pair to data
        Object.entries(edge).forEach(([name, value]) => {
            element.data[name] = value;
        });
  
        if (isDirected) {
            element.classes = ['directed'];
        }

        // Makes a list of edgeLabels and their values
        const edgeLabelValues = [];

        // Checks if there is an edge object and weight. Pushes it onto the list if there is. 
        if (edgeWeights && predicate.getEdgeObject(edge).weight) edgeLabelValues.push(predicate.getEdgeObject(edge).weight);

        // Same as previous but with a label 
        if (edgeLabels && predicate.getEdgeObject(edge).labelx) edgeLabelValues.push(predicate.getEdgeObject(edge).label);

        //Joins the label and pushes this element onto the list
        element.data.label = edgeLabelValues.join('\n');
        elements.push(element);
    });
}

/**
 * This method will take a specified predicate format and convert
 * it into a graph object that is in the format of a cytoscape
 * object
 *
 * @author Noah Alexander ngalexa2
 * @param {Graph} predicate - the predicates that had been converted from a test file
 * @returns returns a graph object in the cytoscape format
 */
export default function predicateConverter(predicate, nodeWeights, nodeLabels, edgeWeights, edgeLabels) {
    //A predicate will have up to three objects, nodes, undirected edges, and directed edges
    let nodes = predicate.nodes || [];
    let edges = predicate.edges || [];

    //Holds all the formats for the graph
    let elements = [];

    //Loops through every key in the nodes list
    nodes.forEach((node) => {
        let element = {
            data: {},
            //All nodes will have a position
            position: { x: node.x, y: node.y }

        }
        // Go through each "attribute" in the object and assign a matching name and value key-pair to data
        Object.entries(node).forEach(([name, value]) => {
            //Position is already set so ignore x and y
            if(name !== 'x' && name !== 'y') {
                element.data[name] = value;
            }
        });
        //Adds them to the list of elements
        elements.push(element);

    });
    //Convert the edges to graph elements.
    
    convertEdges(predicate, elements, edges, predicate.directed, edgeWeights, edgeLabels);
    return(elements);

}
