import Graph from "backend/Graph/Graph"

/**
 * This function parses input graph text into predicates
 * 
 * @param {string} graphText - The text from the input graph text file
 * @param {function} handleError - error handler to propagate messages to user
 * 
 * @returns a dictionary object with keys called nodes, directed_edges, and undirected_edges
 * 
 * @author Rishab Karwa
 * @author Andrew Watson
 */
export function parseText(graphText) {
    //remove any previous values that the graph may have
    var graph = {}

    //ids and dictionaries to store nodes adwnd edges
    var node_map = {}
    var directed_edge_map = {}
    var undirected_edge_map = {}
    var edge_id = 0

    var lines = graphText.split('\n')
    for (var line = 0; line < lines.length; line++) {
        let current_line = lines[line].trim()
        //if the line starts with / or # it is a comment so skip it. Or if the line is empty, just skip it.
        if (current_line[0] === '/' || current_line[0] === '#' || current_line.length === 0) {
            //this does nothing since we're skipping.
        }
        //this is a node
        else if (current_line[0] === 'n') {
            nodeParser(current_line, node_map)
        }
        //this is an undirected edge
        else if (current_line[0] === 'e') {
            edge_id += 1
            edgeParser(current_line, undirected_edge_map, edge_id)
        }
        //this is a directed edge
        else if (current_line[0] === 'd') {
            edge_id += 1
            edgeParser(current_line, directed_edge_map, edge_id)
        }
        //if it starts with something else then they screwed up so break.
        else {
            throw Error("Input file had an invalid line on line " + (line + 1))
        }
    }

    //ensure that all entered source and targets for edges are valid node ids
    checkEdgeAnchors(node_map, directed_edge_map)
    checkEdgeAnchors(node_map, undirected_edge_map)

    // if we get to here, then there are no errors. So combine everything into one object and return it
    return new Graph(node_map, directed_edge_map, undirected_edge_map, "");
}

/**
 * This function checks that all created edges only reference node ids that exist in the given node_map
 * @author ysherma
 * @param {map} nodes - The map of nodes whose keys are their IDs and values are their attributes
 * @param {map} edges - The map of edges whose keys are their IDs and values are their attributes
 */
function checkEdgeAnchors(nodes, edges) {
    for (var key in edges) {
        if (!(edges[key].source in nodes)) {
            throw Error(`Source does not match a node ID: ${edges[key].source}`)
        }
        if (!(edges[key].target in nodes)) {
            throw Error(`Target does not match a node ID: ${edges[key].target}`)
        }
    }
}

/**
 * This function parses a given string for a node predicate
 * @author rskarwa
 * @param {string} node_string - the line of the node predicate
 * @param {dictionary} node_map - the map of all the current nodes
 */
function nodeParser(node_string, node_map) {
    //the id of the node
    var node_id = false
    //trim the end whitespace
    var trimmed = node_string.trimEnd()
    //split values to an array in the string by removing whitespace in middle
    var all_values = trimmed.substring(2).split(" ")
    //keys and values of all values of the node
    var keys = ['weight', 'x', 'y']
    var boolean_keys = ['highlighted', 'marked']
    var values = [null]

    for (var i = 0; i < all_values.length; i++) {
        //id value
        if (node_id === false) {
            node_id = all_values[i]
            if (node_id in node_map) {
                throw Error(`Duplicate node ID: '${node_id}'`)
            }
        }
        //x value
        else if (values.length === 1 && isNumeric(all_values[i])) {
            values.push(parseFloat(all_values[i]))
        }
        //y value
        else if (values.length === 2 && isNumeric(all_values[i])) {
            values.push(parseFloat(all_values[i]))
        }
        //the weight field was entered
        else if (values.length === 3 && isNumeric(all_values[i])) {
            values[0] = parseFloat(all_values[i])
        }
        //the weight field was not entered
        else if (values.length >= 3 && all_values[i].includes(":")) {
            var key_val = all_values[i].split(":")
            if (keys.includes(key_val[0])) {
                // If the user tries to use a key that is one of the default keys, throw error
                throw Error(`Duplicate key-value pair: '${key_val[0]}:${key_val[1]}'`)
            }
            if (boolean_keys.includes(key_val[0]) && key_val[1] !== '') {
                // If the user tries to set a value to a boolean attribute, throw error
                throw Error(`Invalid key-value pair: '${key_val[0]}:${key_val[1]}'`)
            }
            if (key_val[0] === 'color' && !isColor(key_val[1])) {
                // If color attribute is not a valid color string, throw error
                throw Error(`Invalid color: '${key_val[0]}:${key_val[1]}'`)
            }
            keys.push(key_val[0])
            values.push(key_val[1])
        }
        //the key value pairs were not created correctly or the x, y fields were not set
        else {
            throw Error(`Incorrect node format, ID: '${node_id}'`)
        }
    }
    //one last error check: values needs weight, x and y and the minimum
    if (values.length < 3) {
        throw Error(`Incorrect node format, ID: '${node_id}'`)
    }
    //set the node map of the id equal to dictionary
    node_map[node_id] = {}

    //ensure all boolean keys have an assigned boolean value
    for (let bool_key of boolean_keys) {
        let index = keys.findIndex((element) => element == bool_key);
        if (index >= 0) {
            values[index] = true;
        } else {
            keys.push(bool_key);
            values.push(false);
        }
    }

    //go ahead store this node predicate among all nodes in the node_map
    for (var j = 0; j < keys.length; j++) {
        node_map[node_id][keys[j]] = values[j]
    }
}

/**
 * This function parses a given string for an undirected edge predicate
 * @author rskarwa
 * @param {string} edge_string - the line of the undirected edge predicate
 * @param {dictionary} edge_map - the map of all the current undirected edges
 * @param {int} edge_id - the current id of the undirected edge
 */
function edgeParser(edge_string, edge_map, edge_id) {
    //trim the end whitespace
    var trimmed = edge_string.trimEnd()
    //split values to an array in the string by removing whitespace in middle
    var all_values = trimmed.substring(2).split(" ")
    //keys and values of all values of the edge
    var keys = ['weight', 'source', 'target']
    var boolean_keys = ['highlighted']
    var values = [null]

    for (var i = 0; i < all_values.length; i++) {
        //source value
        if (values.length === 1) {
            values.push(all_values[i])
        }
        //target value
        else if (values.length === 2) {
            values.push(all_values[i])
        }
        //the weight field was entered
        else if (values.length === 3 && isNumeric(all_values[i])) {
            values[0] = parseFloat(all_values[i])
        }
        //the weight field was not entered
        else if (values.length >= 3 && all_values[i].includes(":")) {
            var key_val = all_values[i].split(":")
            if (keys.includes(key_val[0])) {
                // If the user tries to use a key that is one of the default keys, throw error
                throw Error(`Duplicate key-value pair: '${key_val[0]}:${key_val[1]}'`)
            }
            if (boolean_keys.includes(key_val[0]) && key_val[1] !== '') {
                // If the user tries to set a value to a boolean attribute, throw error
                throw Error(`Invalid key-value pair: '${key_val[0]}:${key_val[1]}'`)
            }
            if (key_val[0] === 'color' && !isColor(key_val[1])) {
                // If color attribute is not a valid color string, throw error
                throw Error(`Invalid color: '${key_val[0]}:${key_val[1]}'`)
            }
            keys.push(key_val[0])
            values.push(key_val[1])
        }
        //the key value pairs were not created correctly or the source, target fields were not set
        else {
            throw Error("Incorrect edge format")
        }
    }
     //one last error check: values needs weight, source and target and the minimum
    if (values.length < 3) {
        throw Error("Incorrect edge format")
    }

    //ensure all boolean keys have an assigned boolean value
    for (let bool_key of boolean_keys) {
        let index = keys.findIndex((element) => element == bool_key);
        if (index >= 0) {
            values[index] = true;
        } else {
            keys.push(bool_key);
            values.push(false);
        }
    }

    //the edge map of the edge id is a dictionary
    edge_map[edge_id] = {}
    //go ahead store this edge predicate among all edges in the undirected_edge_map
    for (var j = 0; j < keys.length; j++) {
        edge_map[edge_id][keys[j]] = values[j];
    }
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