import '@testing-library/jest-dom'
import { parseText } from '../backend/FileToPredicate';

/**
 * This class runs tests on different kinds of input for the conversion of graph input file to predicates
 * @author rskarwa
 */

test("String to Predicate With Weights No Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': 20 }
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': 20 }
    var directed = {}
    directed[1] = { 'source': 'a', 'destination': 'b', 'weight': 20 }
    var undirected = {}
    undirected[2] = { 'source': 'a', 'destination': 'a', 'weight': 20 }
    var graph = {}
    graph['node'] = nodes
    graph['directed'] = directed
    graph['undirected'] = undirected
    //create a string to Test
    var text = `n a 10 10 20
n b 15 10 20
d a b 20
e a a 20`
    //check if it matched
    var converted = parseText(text)
    expect(converted).toEqual(graph)

});


test("String to Predicate Without Weights No Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': null }
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': null }
    var directed = {}
    directed[1] = { 'source': 'a', 'destination': 'b', 'weight': null }
    var undirected = {}
    undirected[2] = { 'source': 'a', 'destination': 'a', 'weight': null }
    var graph = {}
    graph['node'] = nodes
    graph['directed'] = directed
    graph['undirected'] = undirected
    //create a string to Test
    var text = `n a 10 10
n b 15 10
d a b
e a a`
    //check if it matched
    var converted = parseText(text)
    expect(converted).toEqual(graph)

});

test("String to Predicate With Weights And Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': 5, 'color': 'brown' }
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': 5, 'color': 'red' }
    var directed = {}
    directed[1] = { 'source': 'a', 'destination': 'b', 'weight': 5, 'color': 'white'}
    var undirected = {}
    undirected[2] = { 'source': 'a', 'destination': 'b', 'weight': 5, 'color': 'yellow' }
    var graph = {}
    graph['node'] = nodes
    graph['directed'] = directed
    graph['undirected'] = undirected
    //create a string to Test
    var text = `n a 10 10 5 color:brown
n b 15 10 5 color:red
d a b 5 color:white
e a b 5 color:yellow`
    //check if it matched
    var converted = parseText(text)
    expect(converted).toEqual(graph)

});

test("String to Predicate Without Weights But With Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': null, 'color': 'brown' }
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': null, 'color': 'brown' }
    var directed = {}
    directed[1] = { 'source': 'a', 'destination': 'b', 'weight': null, 'color': 'white'}
    var undirected = {}
    undirected[2] = { 'source': 'a', 'destination': 'a', 'weight': null, 'color': 'yellow' }
    var graph = {}
    graph['node'] = nodes
    graph['directed'] = directed
    graph['undirected'] = undirected
    //create a string to Test
    var text = `n a 10 10 color:brown
n b 15 10 color:brown
d a b color:white
e a a color:yellow`
    //check if it matched
    var converted = parseText(text)
    expect(converted).toEqual(graph)

});