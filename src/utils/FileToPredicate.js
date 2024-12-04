import NodeObject from "pages/GraphView/utils/NodeObject";
import EdgeObject from "pages/GraphView/utils/EdgeObject";
import Graph from "utils/Graph"

/**
 * This function parses input graph text into predicates
 * 
 * @param {string} graphText - The text from the input graph text file
 * @param {function} handleError - error handler to propagate messages to user
 * 
 * @returns a dictionary object with keys called nodes, directed_edges, and edges
 * 
 * @author Rishab Karwa
 * @author Andrew Watson
 * @author Andrew Lanning
 * @author Ethan Godwin
 */
export function parseText(graphText) {
    let graph = new Graph([], [], false, "");

    var lines = graphText.split('\n')
    for (var line = 0; line < lines.length; line++) {
        let current_line = lines[line].trim()
        //if the line is a comment or tag line in one of the standard graph formats
        // or if the line is empty, just skip it.
        if (current_line[0] === '/' || current_line[0] === '#'
            || current_line[0] === 'c' || current_line[0] === 'g'
            || current_line[0] === 't' || current_line[0] === '-'
            || current_line.length === 0) {
            //this does nothing since we're skipping.
        }
        //this is a node
        else if (current_line[0] === 'n') {
            nodeParser(current_line, graph.nodes)
        }
        //this is an edge
        else if (current_line[0] === 'e') {
            edgeParser(current_line, graph.edges, (s, t) => graph.createEdgeId(s, t));
        }
        else if (current_line === 'directed') {
            graph.directed = true;
        }
        //if it starts with something else then they screwed up so break.
        else {
            throw Error("Input file had an invalid line on line " + (line + 1))
        }
    }

    return graph;
}

/**
 * This function parses a given string for a node predicate
 * @author rskarwa
 * @param {string} node_string - the line of the node predicate
 * @param {NodeObject[]} nodeList - the list of all the current nodes
 */
function nodeParser(node_string, nodeList) {
    //trim the end whitespace
    var trimmed = node_string.trimEnd()
    //split string to an array using whitespace as a delimiter
    var all_values = trimmed.split(/\s+/)
    //keys and values of all values of the node
    var boolean_attrs = ['invisibleLabel', 'invisibleWeight', 'invisible', 'highlighted', 'marked']
    let newNode = new NodeObject(undefined);
    let parsedIds = [];
    //console.log("all values: ", all_values);

    if(all_values.length < 4) {
        throw new Error("Invalid node format, missing information");
    }
    //Setting node id
    if(parsedIds.includes(all_values[1])) {
        throw Error(`Duplicate node ID: '${newNode.id}'`);
    }
    //Setting node x pos
    newNode.id = all_values[1];
    if(!isNumeric(all_values[2])) {
        throw Error(`x position is NaN: ${all_values[2]}`);
    }
    newNode.x = parseFloat(all_values[2]);
    //Setting node y pos
    if(!isNumeric(all_values[3])) {
        throw Error(`y position is NaN: ${all_values[3]}`);
    }
    newNode.y = parseFloat(all_values[3]);
    let enteredAttributes = [];
    for(var i = 4; i < all_values.length; i++) {
        if(isNumeric(all_values[4]) && newNode.weight === undefined) {
            newNode.weight = parseFloat(all_values[4]);
        }    
        if(all_values[i].includes(":")) {
            let attr_name = all_values[i].split(":")[0];
            let attr_value = all_values[i].split(":")[1];
            if(enteredAttributes.includes(attr_name)) {
                throw Error(`Duplicate attribute entry: ${attr_name}`);
            }
            //Users can not set values for boolean attributes
            if(boolean_attrs.includes(attr_name) && attr_value !== '') {
                throw Error(`Cannot set value for boolean attributes: '${attr_name}:${attr_value}'`)
            }
            if(attr_name === 'color') {
                if(!isColor(attr_value)) {
                    throw Error(`Invalid color: ${attr_value}`);
                }
                newNode.setColor(attr_value);
            } else if(attr_name === 'shape') {
                let shapes = ['ellipse', 'triangle', 'round-triangle', 'rectangle', 'round-rectangle', 'bottom-round-rectangle', 'cut-rectangle', 'barrel', 'rhomboid', 'right-rhomboid', 'diamond', 'square', 
                    'round-diamond', 'pentagon', 'round-pentagon', 'hexagon', 'round-hexagon', 'concave-hexagon', 'heptagon', 'round-heptagon', 'octagon', 'round-octagon', 'star', 'tag', 'round-tag', 'vee'];
                if(!shapes.includes(attr_value.toLowerCase())) {
                    throw new Error(`Invalid shape: ${attr_value}`);
                }
                newNode.shape = attr_value;
            /**
             *  For any other attribute specified in the file, add it without an error check.
             *  This should be enough to allow an arbitrary attribute to be specified and added.
             * 
             *  Uses the flexibility of javascript objects to dynamically create fields and assign values.
             */
            } else if(attr_name !== undefined && attr_value !== undefined) {
                Object.defineProperty(newNode, attr_name, {
                    value: attr_value,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });
            }
            enteredAttributes.push(attr_name);
        }
    }
    //one last error check: nodes need values for id, x, and y at the minimum
    if (newNode.id === undefined || newNode.x === undefined || newNode.y === undefined) {
        throw Error(`Incorrect node format, ID: '${newNode.id}'`);
    }
    //go ahead store this node predicate among all nodes in the node_map

    nodeList.push(newNode);
    
}

/**
 * This function parses a given string for an undirected edge predicate
 * @author rskarwa
 * @param {string} edge_string - the line of the undirected edge predicate
 * @param {dictionary} edge_map - the map of all the current undirected edges
 * @param {int} edge_id - the current id of the undirected edge
 */
function edgeParser(edge_string, edgeList, createEdgeId) {
    //trim the end whitespace
    var trimmed = edge_string.trimEnd()
    //split string to an array using whitespace as a delimiter
    var all_values = trimmed.split(/\s+/)
    //keys and values of all values of the edge
    var booleanAttrs = ['shouldBeInvisible', 'invisibleLabel', 'invisibleWeight', 'invisible', 'highlighted']
    let newEdge = new EdgeObject();
    let parsedIds = [];
    if(all_values.length < 3) {
        throw Error(`Invalid edge, missing arguments`);
    }
    let id = `${all_values[1]} ${all_values[2]}`;
    if(parsedIds.includes(id)) {
        throw Error(`Duplicate node ID: '${newEdge.id}'`);
    }
    newEdge.source = all_values[1];
    newEdge.target = all_values[2];
    newEdge.setId(newEdge.source, newEdge.target);
    let enteredAttributes = [];
    for(let i = 3; i < all_values.length; i++) {
        if (newEdge.weight === undefined && isNumeric(all_values[i])) {
            newEdge.setWeight(parseFloat(all_values[i]));
        }
        if(all_values[i].includes(':')) {
            let attr_name = all_values[i].split(":")[0];
            let attr_value = all_values[i].split(":")[1];
            if(enteredAttributes.includes(attr_name)) {
                throw Error(`Duplicate attribute entry: ${attr_name}`);
            }
            //Users can not set values for boolean attributes
            if(booleanAttrs.includes(attr_name) && attr_value !== '') {
                throw Error(`Cannot set value for boolean attributes: '${attr_name}:${attr_value}'`)
            }  
            //Check if color is valid before adding
            if(attr_name === 'color') {
                if(!isColor(attr_value)) {
                    throw Error(`Invalid color: '${attr_value}'`);
                }
                newEdge.setColor(attr_value);
            /**
             *  For any other attribute specified in the file, add it without an error check.
             *  This should be enough to allow an arbitrary attribute to be specified and added.
             * 
             *  Uses the flexibility of javascript objects to dynamically create fields and assign values.
             */
            } else if(attr_name !== undefined && attr_value !== undefined) {
                Object.defineProperty(newEdge, attr_name, {
                    value: attr_value,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });
            }
            enteredAttributes.push(attr_name);
        }
    }
    //go ahead store this edge predicate among all edges in the edge_map
    edgeList.push(newEdge);
}


/**
 * This function checks if a string is floating number
 * @author from https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
 * @param {string} str - The string to check
 * @returns true or false 
 */
function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!    
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

/**
 * This function checks if a string is a valid CSS color, allows common color strings i.e. red, and rgb hex codes.
 * @author from https://stackoverflow.com/questions/48484767/javascript-check-if-string-is-valid-css-color
 * @param {string} strColor - The color to check
 * @returns true or false
 */
function isColor(strColor){
    var s = new Option().style;
    s.color = strColor;
    return s.color !== '';
}
