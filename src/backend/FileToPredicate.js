//this graph that contains the nodes and edges can be imported into another javscript file 
var graph = {}
export default graph

/**
 * This function parses input graph text into predicates
 * @author rskarwa
 * @param {string} graphText - The text from the input graph text file
 * @returns a dictionary object with keys called nodes, directed_edges, and undirected_edges
 */
export function parseText(graphText) {

  //ids and dictionaries to store nodes and edges
  var node_map = {}
  var directed_edge_map = {}
  var directed_edge_id = 0
  var undirected_edge_map = {}
  var undirected_edge_id = 0

  var lines = graphText.split('\n')
  for (var line = 0; line < lines.length; line++) {

    //this is a node
    if (lines[line][0] == 'n') {
      nodeParser(lines[line], node_map)
    }

    //this is an undirected edge
    else if (lines[line][0] == 'e') {
      undirectedEdgeParser(lines[line], undirected_edge_map, undirected_edge_id)
    }

    //this is a directed edge
    else if (lines[line][0] == 'd') {
      directedEdgeParser(lines[line], directed_edge_map, directed_edge_id)
    }

    //if the user had a new line character at the end of the file
    else if (lines[line][0] != '\n') {
      console.log("Incorrect file format")
    }
  }

  //combine everything into one object and return it
  graph['node'] = node_map
  graph['directed'] = directed_edge_map
  graph['undirected'] = undirected_edge_map
  console.log(graph)
  return graph

}

/**
 * This function parses a given string for a node predicate
 * @author rskarwa
 * @param {string} node_string - the line of the node predicate
 * @param {dictionary} node_map - the map of all the current nodes
 */
function nodeParser(node_string, node_map) {
  var node_id = false
  var x = false
  var y = false
  var weight = null
  //trim the end whitespace
  var trimmed = node_string.trimEnd()
  //split values to an array in the string by removing whitespace in middle
  var all_values = trimmed.substring(2).split(" ")
  var keys = ['weight', 'x', 'y']
  var values = [null]
  for (var i = 0; i < all_values.length; i++) {
    //id value
    if (node_id == false) {
      node_id = all_values[i]
    }
    //x value
    else if (x == false && isNumeric(all_values[i])) {
      x = true
      values.push(parseFloat(all_values[i]))
    }
    //y value
    else if (y == false && isNumeric(all_values[i])) {
      y = true
      values.push(parseFloat(all_values[i]))
    }
    //the weight field was entered
    else if (x == true && y == true && weight == null && isNumeric(all_values[i])) {
      weight = true
      values[0] = parseFloat(all_values[i])
    }
    //the weight field was not entered
    else if (x == true && y == true && all_values[i].includes(":")) {
      var key_val = all_values[i].split(":")
      keys.push(key_val[0])
      values.push(key_val[1])
    }
    //the key value pairs were not created correctly or the x, y fields were not set
    else {
      // handleChange()
      console.log("Incorrect node format")
    }
  }
  //one last error check
  if (x != true || y != true) {
    console.log("Incorrect node format")
  }
  //set the node map of the id equal to dictionary
  node_map[node_id] = {}
  //go ahead store this node predicate among all nodes in the node_map
  for (var j = 0; j < keys.length; j++) {
    node_map[node_id][keys[j]] = values[j];
  }
}

/**
 * This function parses a given string for an undirected edge predicate
 * @author rskarwa
 * @param {string} undirected_edge_string - the line of the undirected edge predicate
 * @param {dictionary} undirected_edge_map - the map of all the current undirected edges
 * @param {int} undirected_edge_id - the current id of the undirected edge
 */
function undirectedEdgeParser(undirected_edge_string, undirected_edge_map, undirected_edge_id) {
  var id = undirected_edge_id + 1
  undirected_edge_map[id] = {}
  undirected_edge_id += 1
  var source = false
  var destination = false
  var weight = null
  //trim the end whitespace
  var trimmed = undirected_edge_string.trimEnd()
  //split values to an array in the string by removing whitespace in middle
  var all_values = trimmed.substring(2).split(" ")
  var keys = ['weight', 'source', 'destination']
  var values = [null]
  for (var i = 0; i < all_values.length; i++) {
    //source value
    if (source == false && isNumeric(all_values[i])) {
      source = true
      values.push(parseFloat(all_values[i]))
    }
    //destination value
    else if (destination == false && isNumeric(all_values[i])) {
      destination = true
      values.push(parseFloat(all_values[i]))
    }
    //the weight field was entered
    else if (source == true && destination == true && weight == null && isNumeric(all_values[i])) {
      weight = true
      values[0] = parseFloat(all_values[i])
    }
    //the weight field was not entered
    else if (source == true && destination == true && all_values[i].includes(":")) {
      var key_val = all_values[i].split(":")
      keys.push(key_val[0])
      values.push(key_val[1])
    }
    //the key value pairs were not created correctly or the source, destination fields were not set
    else {
      console.log("Incorrect edge format")
    }
  }
  //one last error check
  if (source != true || destination != true) {
    console.log("Incorrect edge format")
  }
  //go ahead store this edge predicate among all edges in the undirected_edge_map
  for (var j = 0; j < keys.length; j++) {
    undirected_edge_map[id][keys[j]] = values[j];
  }
}

/**
 * This function parses a given string for an directed edge predicate
 * @author rskarwa
 * @param {string} directed_edge_string - the line of the directed edge predicate
 * @param {dictionary} directed_edge_map - the map of all the current directed edges
 * @param {int} directed_edge_id - the current id of the directed edge
 */
function directedEdgeParser(directed_edge_string, directed_edge_map, directed_edge_id) {
  var id = directed_edge_id + 1
  directed_edge_map[id] = {}
  directed_edge_id += 1
  var source = false
  var destination = false
  var weight = null
  //trim the end whitespace
  var trimmed = directed_edge_string.trimEnd()
  //split values to an array in the string by removing whitespace in middle
  var all_values = trimmed.substring(2).split(" ")
  var keys = ['weight', 'source', 'destination']
  var values = [null]
  for (var i = 0; i < all_values.length; i++) {
    //source value
    if (source == false && isNumeric(all_values[i])) {
      source = true
      values.push(parseFloat(all_values[i]))
    }
    //destination value
    else if (destination == false && isNumeric(all_values[i])) {
      destination = true
      values.push(parseFloat(all_values[i]))
    }
    //the weight field was entered
    else if (source == true && destination == true && weight == null && isNumeric(all_values[i])) {
      weight = true
      values[0] = parseFloat(all_values[i])
    }
    //the weight field was not entered
    else if (source == true && destination == true && all_values[i].includes(":")) {
      var key_val = all_values[i].split(":")
      keys.push(key_val[0])
      values.push(key_val[1])
    }
    //the key value pairs were not created correctly or the source, destination fields were not set
    else {
      console.log("Incorrect edge format")
    }
  }
  //one last error check
  if (source != true || destination != true) {
    console.log("Incorrect edge format")
  }
  //go ahead store this node predicate among all nodes in the node_map
  for (var j = 0; j < keys.length; j++) {
    directed_edge_map[id][keys[j]] = values[j];
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

