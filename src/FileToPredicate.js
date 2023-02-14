import React, { useState } from "react";

//parse the text into predicates. This function returns a dictionary object with keys called nodes, directed_edges, and undirected_edges
export function parseText(e) {

    //ids and dictionaries to store nodes and edges
    var node_map = {}
    var directed_edge_map = {}
    var directed_edge_id = 0
    var undirected_edge_map = {}
    var undirected_edge_id = 0
  
    var lines = e.split('\n')
    for (var line = 0; line < lines.length; line++) {
      //this is a node
      if (lines[line][0] == 'n') {
        var node_id = false
        var x = false
        var y = false
        var weight = false
        //trim the end whitespace
        var trimmed = lines[line].trimEnd()
        //split values to an array in the string by removing whitespace in middle
        var all_values = trimmed.substring(2).split(" ")
        var keys = ['x', 'y']
        var values = []
        for (var i = 0; i < all_values.length; i++) {
          //id value
          if (node_id == false) {
            node_id = all_values[i]
          }
          //x value
          else if (x == false && isNumeric(all_values[i])) {
            x = true
            values.push(all_values[i])
          }
          //y value
          else if (y == false && isNumeric(all_values[i])) {
            y = true
            values.push(all_values[i])
          }
          //the weight field was entered
          else if (x == true && y == true && weight == false && isNumeric(all_values[i])) {
            weight = true
            keys.push('weight')
            values.push(all_values[i])
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
          //one last error check
          if (x != true || y != true) {
            console.log("Incorrect node format")
          }
        }
        //set the node map of the id equal to dictionary
        node_map[node_id] = {}
        //go ahead store this node predicate among all nodes in the node_map
        for (var j = 0; j < keys.length; j++) {
          node_map[node_id][keys[j]] = values[j];
        }
      }
      //this is an undirected edge
      else if (lines[line][0] == 'e') {
        var id = undirected_edge_id + 1
        undirected_edge_map[id] = {}
        undirected_edge_id += 1
        var source = false
        var destination = false
        var weight = false
        //trim the end whitespace
        var trimmed = lines[line].trimEnd()
        //split values to an array in the string by removing whitespace in middle
        var all_values = trimmed.substring(2).split(" ")
        var keys = ['source', 'destination']
        var values = []
        for (var i = 0; i < all_values.length; i++) {
          //source value
          if (source == false && isNumeric(all_values[i])) {
            source = true
            values.push(all_values[i])
          }
          //destination value
          else if (destination == false && isNumeric(all_values[i])) {
            destination = true
            values.push(all_values[i])
          }
          //the weight field was entered
          else if (source == true && destination == true && weight == false && isNumeric(all_values[i])) {
            weight = true
            keys.push('weight')
            values.push(all_values[i])
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
          //one last error check
          if (source != true || destination != true) {
            console.log("Incorrect edge format")
          }
        }
        //go ahead store this node predicate among all nodes in the node_map
        for (var j = 0; j < keys.length; j++) {
          undirected_edge_map[id][keys[j]] = values[j];
        }
      }
      //this is a directed edge
      else if (lines[line][0] == 'd') {
        var id = directed_edge_id + 1
        directed_edge_map[id] = {}
        directed_edge_id += 1
        var source = false
        var destination = false
        var weight = false
        //trim the end whitespace
        var trimmed = lines[line].trimEnd()
        //split values to an array in the string by removing whitespace in middle
        var all_values = trimmed.substring(2).split(" ")
        var keys = ['source', 'destination']
        var values = []
        for (var i = 0; i < all_values.length; i++) {
          //source value
          if (source == false && isNumeric(all_values[i])) {
            source = true
            values.push(all_values[i])
          }
          //destination value
          else if (destination == false && isNumeric(all_values[i])) {
            destination = true
            values.push(all_values[i])
          }
          //the weight field was entered
          else if (source == true && destination == true && weight == false && isNumeric(all_values[i])) {
            weight = true
            keys.push('weight')
            values.push(all_values[i])
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
          //one last error check
          if (source != true || destination != true) {
            console.log("Incorrect edge format")
          }
        }
        //go ahead store this node predicate among all nodes in the node_map
        for (var j = 0; j < keys.length; j++) {
          directed_edge_map[id][keys[j]] = values[j];
        }
      }
      //if the user had a new line character at the end of the file
      else if (lines[line][0] != '\n') {
        console.log("Incorrect file format")
      }
    }
    console.log(node_map)
    console.log(directed_edge_map)
    console.log(undirected_edge_map)
  
    //combine everything into one object and return it
    var graph = {}
    graph['node'] = node_map
    graph['directed'] = directed_edge_map
    graph['undirected'] = undirected_edge_map
    console.log(graph)
    return graph
  }
  
  //this function checks if a string is number of any type
  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  function GraphInput() { 
    var [textValue, setTextValue] = useState("");
    var [fileName, setFileName] = useState("");
    function handleChange(e) {

      setFileName(e.target.files[0].name);
      var file = e.target.files[0];
  
      let reader = new FileReader();
  
      reader.onload = (e) => {
        var file = e.target.result;
        setTextValue(file);
        setFileName(e.target.files[0].name);
        //parse it into graph components
        parseText(file)
      };
  
      reader.onerror = (e) => alert(e.target.error.name);
      reader.readAsText(file);
    };
    return (
      <div style={{ display: "block" }}>
        <label htmlFor="filePicker" style={{ position: "absolute", top: 0, left: 0, background: "grey", padding: "1px 7px 2pxx", position: "absolute", appearance: "button", color: "buttontext" }}>
          Upload Graph
        </label>
        <input id="filePicker" style={{ visibility: "hidden" }} type={"file"} onChange={handleChange} />
        <div
        >{fileName}</div>
        <textarea
          cols={60}
          rows={15}
          value={textValue}
          onChange={setTextValue}
          style={{ marginTop: 15, position: "absolute", bottom: 30, right: 30 }}
        ></textarea>
      </div>
    );
  };
  
  export default GraphInput;
  