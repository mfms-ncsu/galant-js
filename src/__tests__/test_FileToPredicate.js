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
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': 20,'highlighted': false, 'marked': false}
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': 20, 'highlighted': false, 'marked': false}
    var edges = {}
    edges[1] = { 'highlighted': false, 'source': 'a', 'target': 'b', 'weight': 20 }
    edges[2] = { 'highlighted': false, 'source': 'a', 'target': 'a', 'weight': 20 }
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
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': null,'highlighted': false, 'marked': false }
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': null, 'highlighted': false, 'marked': false }
    var edges = {}
    edges[1] = { 'source': 'a', 'target': 'b', 'weight': null, 'highlighted': false }
    edges[2] = { 'source': 'a', 'target': 'a', 'weight': null, 'highlighted': false }
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
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': 5, 'color': 'brown','highlighted': false, 'marked': false }
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': 5, 'color': 'red', 'highlighted': false, 'marked': false}
    var edges = {}
    edges[1] = { 'source': 'a', 'target': 'b', 'weight': 5, 'color': 'white', 'highlighted': false }
    edges[2] = { 'source': 'a', 'target': 'b', 'weight': 5, 'color': 'yellow', 'highlighted': false }
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
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': null, 'color': 'brown','highlighted': false, 'marked': false }
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': null, 'color': 'brown', 'highlighted': false, 'marked': false }
    var edges = {}
    edges[1] = { 'source': 'a', 'target': 'b', 'weight': null, 'color': 'white', 'highlighted': false}
    edges[2] = { 'source': 'a', 'target': 'a', 'weight': null, 'color': 'yellow', 'highlighted': false }
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