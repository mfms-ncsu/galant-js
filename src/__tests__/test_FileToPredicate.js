import '@testing-library/jest-dom'
import { parseText } from 'backend/FileToPredicate';
import Graph from "backend/Graph/Graph"

/**
 * This class runs tests on different kinds of input for the conversion of graph input file to predicates
 * @author rskarwa
 */

test("String to Predicate With Weights No Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': 20,'highlighted': false, 'marked': false, 'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false}
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': 20, 'highlighted': false, 'marked': false, 'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false}
    var edges = {}
    edges["a b"] = { 'highlighted': false, 'source': 'a', 'target': 'b', 'weight': 20, 'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false, 'shouldBeInvisible': false }
    edges["a a"] = { 'highlighted': false, 'source': 'a', 'target': 'a', 'weight': 20, 'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false, 'shouldBeInvisible': false }
    var graph = new Graph(nodes, edges, false, "")
    //create a string to Test
    var text = `n a 10 10 20
n b 15 10 20
e a b 20
e a a 20`
    //check if it matched
    var converted = parseText(text)
    expect(converted.nodes).toEqual(graph.nodes)
    expect(converted.edges).toEqual(graph.edges)
    expect(converted.directed).toEqual(graph.directed)
    expect(converted.message).toEqual(graph.message)

});


test("String to Predicate Without Weights No Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': undefined,'highlighted': false, 'marked': false,  'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false }
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': undefined, 'highlighted': false, 'marked': false,  'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false }
    var edges = {}
    edges["a b"] = { 'source': 'a', 'target': 'b', 'weight': undefined, 'highlighted': false,  'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false, 'shouldBeInvisible': false }
    edges["a a"] = { 'source': 'a', 'target': 'a', 'weight': undefined, 'highlighted': false,  'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false, 'shouldBeInvisible': false }
    var graph = new Graph(nodes, edges, false, "")
    //create a string to Test
    var text = `n a 10 10
n b 15 10
e a b
e a a`
    //check if it matched
    var converted = parseText(text)
    expect(converted.nodes).toEqual(graph.nodes)
    expect(converted.edges).toEqual(graph.edges)
    expect(converted.directed).toEqual(graph.directed)
    expect(converted.message).toEqual(graph.message)

});

test("String to Predicate With Weights And Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': 5, 'color': 'brown','highlighted': false, 'marked': false,  'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false }
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': 5, 'color': 'red', 'highlighted': false, 'marked': false, 'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false}
    var edges = {}
    edges["a b"] = { 'source': 'a', 'target': 'b', 'weight': 5, 'color': 'white', 'highlighted': false,  'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false, 'shouldBeInvisible': false  }
    edges["a b 2"] = { 'source': 'a', 'target': 'b', 'weight': 5, 'color': 'yellow', 'highlighted': false,  'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false, 'shouldBeInvisible': false }
    var graph = new Graph(nodes, edges, true, "")
    //create a string to Test
    var text = `n a 10 10 5 color:brown
n b 15 10 5 color:red
e a b 5 color:white
e a b 5 color:yellow
directed`
    //check if it matched
    var converted = parseText(text)
    expect(converted.nodes).toEqual(graph.nodes)
    expect(converted.edges).toEqual(graph.edges)
    expect(converted.directed).toEqual(graph.directed)
    expect(converted.message).toEqual(graph.message)

});

test("String to Predicate Without Weights But With Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': undefined, 'color': 'brown','highlighted': false, 'marked': false,  'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false }
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': undefined, 'color': 'brown', 'highlighted': false, 'marked': false, 'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false }
    var edges = {}
    edges["a b"] = { 'source': 'a', 'target': 'b', 'weight': undefined, 'color': 'white', 'highlighted': false, 'invisible': false, 'invisibleLabel': false, 'invisibleWeight': false, 'shouldBeInvisible': false }
    edges["a a"] = { 'source': 'a', 'target': 'a', 'weight': undefined, 'color': 'yellow', 'highlighted': false,  'invisible': false, 'invisibleLabel': false,'invisibleWeight': false, 'shouldBeInvisible': false }
    var graph = new Graph(nodes, edges, true, "")
    //create a string to Test
    var text = `n a 10 10 color:brown
n b 15 10 color:brown
e a b color:white
e a a color:yellow
directed`
    //check if it matched
    var converted = parseText(text)
    expect(converted.nodes).toEqual(graph.nodes)
    expect(converted.edges).toEqual(graph.edges)
    expect(converted.directed).toEqual(graph.directed)
    expect(converted.message).toEqual(graph.message)

});
