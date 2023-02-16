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
    var directed = {}
    directed[1] = { 'source': 1, 'destination': 2, 'weight': 20 }
    var undirected = {}
    undirected[1] = { 'source': 10, 'destination': 10, 'weight': 20 }
    var graph = {}
    graph['node'] = nodes
    graph['directed'] = directed
    graph['undirected'] = undirected
    //create a string to Test
    var text = `n a 10 10 20
d 1 2 20
e 10 10 20`
    //check if it matched
    var converted = parseText(text)
    expect(converted).toEqual(graph)

});


test("String to Predicate Without Weights No Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': null }
    var directed = {}
    directed[1] = { 'source': 1, 'destination': 2, 'weight': null }
    var undirected = {}
    undirected[1] = { 'source': 10, 'destination': 10, 'weight': null }
    var graph = {}
    graph['node'] = nodes
    graph['directed'] = directed
    graph['undirected'] = undirected
    //create a string to Test
    var text = `n a 10 10
d 1 2
e 10 10`
    //check if it matched
    var converted = parseText(text)
    expect(converted).toEqual(graph)

});

test("String to Predicate With Weights And Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': 5, 'color': 'brown' }
    var directed = {}
    directed[1] = { 'source': 1, 'destination': 2, 'weight': 5, 'color': 'white'}
    var undirected = {}
    undirected[1] = { 'source': 10, 'destination': 10, 'weight': 5, 'color': 'yellow' }
    var graph = {}
    graph['node'] = nodes
    graph['directed'] = directed
    graph['undirected'] = undirected
    //create a string to Test
    var text = `n a 10 10 5 color:brown
d 1 2 5 color:white
e 10 10 5 color:yellow`
    //check if it matched
    var converted = parseText(text)
    expect(converted).toEqual(graph)

});

test("String to Predicate Without Weights But With Special Key/Value Pairs", () => {
    //Make a dictionary to Test
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': null, 'color': 'brown' }
    var directed = {}
    directed[1] = { 'source': 1, 'destination': 2, 'weight': null, 'color': 'white'}
    var undirected = {}
    undirected[1] = { 'source': 10, 'destination': 10, 'weight': null, 'color': 'yellow' }
    var graph = {}
    graph['node'] = nodes
    graph['directed'] = directed
    graph['undirected'] = undirected
    //create a string to Test
    var text = `n a 10 10 color:brown
d 1 2 color:white
e 10 10 color:yellow`
    //check if it matched
    var converted = parseText(text)
    expect(converted).toEqual(graph)

});