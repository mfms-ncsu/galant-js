// Default node size when converting the radius of the node to Cytoscape
const nodeSize = 30;

/**
 * Helper function for predicateConverter which handles the directed and undirected objects.
 *
 * @param elements - the elements list to push newly created graph objects to.
 * @param edges - the list of directed or undirected.
 * @param isDirected - boolean True or False telling the function whether to include a `classes: ['directed']` clause in the graph object.
 *
 * @returns - The converted elements
 *
 * @author Andrew Watson
 * @author Noah Alexander
 * @author Rishabh Karwa
 */
function convertEdges(elements, edges, isDirected, edgeWeights, edgeLabels) {
    //Loops through all keys inside of the edges
    for (let id in edges) {
        //Gets the edge
        let edge = edges[id];

        //Specifies the format for a graph object to display edges
        let element = {
            data: {
                source: '',
                target: '',
                highlighted: false,
                label: '',
                weight: null,
            }
        }

        if (isDirected) {
            element.classes = ['directed'];
        }

        //Loops through all keys inside of the edge
        for (let key in edge) {
            //If the predicate for an edge has a weightm it gets added later to a label to be displayed. Ignore it for now.
            //Transfer all other key value pairs to the edge
            if (key !== 'weight' && key !== 'label' && edge[key] !== undefined) {
                element.data[key] = edge[key];
            }
        }

        const edgeLabelValues = [];

        if (edgeWeights && edge.weight) edgeLabelValues.push(edge.weight);
        if (edgeLabels && edge.label) edgeLabelValues.push(edge.label);
        element.data.label = edgeLabelValues.join('\n');

        console.log(element.data.label, edgeWeights, edgeLabels, edge.weight, edge.label);
        //Add the edge to the list of elements
        elements.push(element);

    }
}

/**
 * This method will take a specified predicate format and convert
 * it into a graph object that is in the format of a cytoscape
 * object
 *
 * @author Noah Alexander ngalexa2
 * @param {Object} predicate - the predicates that had been converted from a test file
 * @returns returns a graph object in the cytoscape format
 */
export default function predicateConverter(predicate, nodeWeights, nodeLabels, edgeWeights, edgeLabels) {
    //A predicate will have up to three objects, nodes, undirected edges, and directed edges
    let nodes = predicate.nodes;
    let edges = predicate.edges;

    //Holds all the formats for the graph
    let elements = [];

    //Loops through every key in the nodes dictionary
    for (let ident in nodes) {
        //Grabs the node object
        let node = nodes[ident];
        //Creates an object that is formatted to the graph display format
        let element = {
            data: {
                //All nodes will have an id and a parent identity filed
                id: ident,
                marked: false,
                highlighted: false,
                label: '',
                weight: null,
            },
            //All nodes will have a position
            position: {}

        }

        //Loop through all the keys in the node
        for (let key in node) {
            //x and y coordinates are held in a seperate dictionary in the element object
            if (key === 'x' || key === 'y') {
                element.position[key] = node[key];
            }
            else if (node[key] === "") {
                element.data[key] = "true";
            }
            else if ((key === 'weight' && (nodeWeights === null || nodeWeights)) || (key === 'label' && (nodeLabels === null || nodeLabels))) {
                //All other key value paris will transfer to the element object in the data
                element.data[key] = node[key];
            }
            else if (key !== 'weight' && key !== 'label') {
                element.data[key] = node[key];
            }
        }

        //Adds them to the list of elements
        elements.push(element);

    }


    //Convert the edges to graph elements.
    convertEdges(elements, edges, predicate.directed, edgeWeights, edgeLabels);
    return(elements);

}
