/**
 * Helper function for predicateConverter which handles the directed and undirected objects.
 * 
 * @author Andrew Watson awatson5
 * @author Noah Alexander ngalexa2
 * 
 * @param elements - the elements list to push newly created graph objects to.
 * @param edges - the list of directed or undirected.
 * @param isDirected - boolean True or False telling the function whether to include a `classes: ['directed']` clause in the graph object.
 */
function convertEdges(elements, edges, isDirected) {
    //Loops through all keys inside of the edges
    for (let id in edges) {
        //Gets the edge
        let edge = edges[id];

        //Specifies the format for a graph object to display edges
        let element = {
            data: {
                source: '',
                destination: '',
                label: '',
                highlighted: false,
                color: 'black'
            }
        }

        if (isDirected) {
            element.classes = ['directed'];
        }

        //Loops through all keys inside of the edge
        for (let key in edge) {
            //If the predicate for an edge has a weightm it gets added later to a label to be displayed. Ignore it for now.
            //Transfer all other key value pairs to the edge
            if (key !== 'weight' && key !== 'label') {
                element.data[key] = edge[key];
            }
        }

        //Addes the weight and labeled combined in the labeled field
        //If there is only one or the other then that is only added
        if (edge.weight && edge.label) {
            element.data.label = edge.weight + '\n' + edge.label;
        }
        else if (edge.weight) {
            element.data.label = String(edge.weight);
        }
        else if (edge.label) {
            element.data.label = edge.label;
        }
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
export default function predicateConverter(predicate) {
    //A predicate will have up to three objects, nodes, undirected edges, and directed edges
    let nodes = predicate['node'];
    let undirected = predicate['undirected'];
    let directed = predicate['directed'];

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
                label: '',
                highlighted: false,
                weight: null,
                color: 'black'
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
            else {
                //All other key value paris will transfer to the element object in the data
                element.data[key] = node[key];
            }
        }
        
        //Adds them to the list of elements
        elements.push(element);

    }
    
    //Convert the edges to graph elements.
    convertEdges(elements, undirected, false);
    convertEdges(elements, directed, true);
    
    return(elements);

}
