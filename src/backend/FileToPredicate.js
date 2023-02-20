//this graph that contains the nodes and edges can be imported into another javscript file 
var graph = null
export default graph

/**
 * This function parses input graph text into predicates
 * @author rskarwa
 * @param {string} graphText - The text from the input graph text file
 * @returns a dictionary object with keys called nodes, directed_edges, and undirected_edges
 */
export function parseText(graphText) {

  //remove any previous values that the graph may have
  graph = {}

  //ids and dictionaries to store nodes and edges
  var node_map = {}
  var directed_edge_map = {}
  var undirected_edge_map = {}
  var edge_id = 0

  var lines = graphText.split('\n')
  for (var line = 0; line < lines.length; line++) {

    //this is a node
    if (lines[line][0] === 'n') {
      nodeParser(lines[line], node_map)
    }

    //this is an undirected edge
    else if (lines[line][0] === 'e') {
      edge_id += 1
      edgeParser(lines[line], undirected_edge_map, edge_id)
    }

    //this is a directed edge
    else if (lines[line][0] === 'd') {
      edge_id += 1
      edgeParser(lines[line], directed_edge_map, edge_id)
    }

    //if the user had a new line character at the end of the file
    else if (lines[line][0] !== '\n') {
      /**
       * TODO: Change console.log error messages to alerts with a more meaningful message and add functionality to reprompt for a file 
       */
      console.log("Incorrect file format")
    }
  }

  //ensure that all entered source and targets for edges are valid node ids
  /**
   * TODO: Change console.log error messages to alerts with a more meaningful message and add functionality to reprompt for a file 
   */
  for (var key in directed_edge_map) {
    if (!(directed_edge_map[key].source in node_map)) {
      console.log("Source does not match a node ID")
    }
    if (!(directed_edge_map[key].target in node_map)) {
      console.log("Target does not match a node ID")
    }
  }
  for (var key in undirected_edge_map) {
    if (!(undirected_edge_map[key].source in node_map)) {
      console.log("Source does not match a node ID")
    }
    if (!(undirected_edge_map[key].target in node_map)) {
      console.log("Target does not match a node ID")
    }
  }

  //combine everything into one object and return it
  graph.node = node_map
  graph.directed = directed_edge_map
  graph.undirected = undirected_edge_map
  console.log(graph)
  const event = new CustomEvent('graphUpdated', {detail: graph});
  document.dispatchEvent(event);
  return graph
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
  var values = [null]

  for (var i = 0; i < all_values.length; i++) {
    //id value
    if (node_id === false) {
      node_id = all_values[i]
    }
    //x value
    else if (values.length == 1 && isNumeric(all_values[i])) {
      values.push(parseFloat(all_values[i]))
    }
    //y value
    else if (values.length == 2 && isNumeric(all_values[i])) {
      values.push(parseFloat(all_values[i]))
    }
    //the weight field was entered
    else if (values.length == 3 && isNumeric(all_values[i])) {
      values[0] = parseFloat(all_values[i])
    }
    //the weight field was not entered
    else if (values.length >= 3  && all_values[i].includes(":")) {
      var key_val = all_values[i].split(":")
      keys.push(key_val[0])
      values.push(key_val[1])
    }
    //the key value pairs were not created correctly or the x, y fields were not set
    else {
      /**
       * TODO: Change console.log error messages to alerts with a more meaningful message and add functionality to reprompt for a file
       */
      console.log("Incorrect node format")
    }
  }
  //one last error check: values needs weight, x and y and the minimum
  if (values.length < 3) {
    /**
     * TODO: Change console.log error messages to alerts with a more meaningful message and add functionality to reprompt for a file
     */
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
  var values = [null]

  for (var i = 0; i < all_values.length; i++) {
    //source value
    if (values.length == 1) {
      values.push(all_values[i])
    }
    //target value
    else if (values.length == 2) {
      values.push(all_values[i])
    }
    //the weight field was entered
    else if (values.length == 3 && isNumeric(all_values[i])) {
      values[0] = parseFloat(all_values[i])
    }
    //the weight field was not entered
    else if (values.length >= 3 && all_values[i].includes(":")) {
      var key_val = all_values[i].split(":")
      keys.push(key_val[0])
      values.push(key_val[1])
    }
    //the key value pairs were not created correctly or the source, target fields were not set
    else {
      /**
       * TODO: Change console.log error messages to alerts with a more meaningful message and add functionality to reprompt for a file
       */
      console.log("Incorrect edge format")
    }
  }
   //one last error check: values needs weight, source and target and the minimum
  if (values.length < 3) {
    /**
     * TODO: Change console.log error messages to alerts with a more meaningful message and add functionality to reprompt for a file
     */
    console.log("Incorrect edge format")
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

