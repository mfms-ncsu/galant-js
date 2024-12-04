import '@testing-library/jest-dom';
import { parseText } from 'utils/FileToPredicate';
import Graph from "utils/Graph";
import NodeObject from "pages/GraphView/utils/NodeObject";
import EdgeObject from "pages/GraphView/utils/EdgeObject";

/**
 * This class runs tests on different kinds of input for the conversion of graph input file to predicates
 */

// Helper function to convert arrays of nodes and edges to dictionaries keyed by their IDs
function convertArrayToObject(array) {
    const obj = {};
    array.forEach(item => {
        obj[item.id] = item;
    });
    return obj;
}

test("String to Predicate With Weights No Special Key/Value Pairs", () => {
    const nodes = {
        'a': new NodeObject(undefined, 'a', 10, 10, false, undefined, undefined, undefined, undefined),
        'b': new NodeObject(undefined, 'b', 15, 10, false, undefined, undefined, undefined, undefined)
    };
    nodes['a'].weight = 20;
    nodes['b'].weight = 20;

    const edges = {
        'a b': new EdgeObject(undefined, 'a b', 'a', 'b', undefined),
        'a a': new EdgeObject(undefined, 'a a', 'a', 'a', undefined)
    };
    edges['a b'].weight = 20;
    edges['a b'].shouldBeInvisible = undefined; // Explicitly set to undefined
    edges['a a'].weight = 20;
    edges['a a'].shouldBeInvisible = undefined; // Explicitly set to undefined

    const graph = new Graph(nodes, edges, false, "");

    const text = `n a 10 10 20
n b 15 10 20
e a b 20
e a a 20`;

    const converted = parseText(text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);
    const convertedEdges = convertArrayToObject(converted.edges);

    expect(convertedNodes).toEqual(graph.nodes);
    expect(convertedEdges).toEqual(graph.edges);
    expect(converted.directed).toEqual(graph.directed);
    expect(converted.message).toEqual(graph.message);
});

test("String to Predicate Without Weights No Special Key/Value Pairs", () => {
    const nodes = {
        'a': new NodeObject(undefined, 'a', 10, 10, false, undefined, undefined, undefined, undefined),
        'b': new NodeObject(undefined, 'b', 15, 10, false, undefined, undefined, undefined, undefined)
    };

    const edges = {
        'a b': new EdgeObject(undefined, 'a b', 'a', 'b', undefined),
        'a a': new EdgeObject(undefined, 'a a', 'a', 'a', undefined)
    };
    edges['a b'].shouldBeInvisible = undefined; // Explicitly set to undefined
    edges['a a'].shouldBeInvisible = undefined; // Explicitly set to undefined

    const graph = new Graph(nodes, edges, false, "");

    const text = `n a 10 10
n b 15 10
e a b
e a a`;

    const converted = parseText(text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);
    const convertedEdges = convertArrayToObject(converted.edges);

    expect(convertedNodes).toEqual(graph.nodes);
    expect(convertedEdges).toEqual(graph.edges);
    expect(converted.directed).toEqual(graph.directed);
    expect(converted.message).toEqual(graph.message);
});



test("String to Predicate Without Weights But With Special Key/Value Pairs", () => {
    const nodes = {
        'a': new NodeObject(undefined, 'a', 10, 10, false, undefined, undefined, undefined, undefined),
        'b': new NodeObject(undefined, 'b', 15, 10, false, undefined, undefined, undefined, undefined)
    };
    nodes['a'].color = 'brown';
    nodes['b'].color = 'brown';

    const edges = {
        'a b': new EdgeObject(undefined, 'a b', 'a', 'b', undefined),
        'a a': new EdgeObject(undefined, 'a a', 'a', 'a', undefined)
    };
    edges['a b'].color = 'white'; // Explicitly set color
    edges['a b'].shouldBeInvisible = undefined; // Explicitly set to undefined
    edges['a a'].color = 'yellow'; // Explicitly set color
    edges['a a'].shouldBeInvisible = undefined; // Explicitly set to undefined

    const graph = new Graph(nodes, edges, true, "");

    const text = `n a 10 10 color:brown
n b 15 10 color:brown
e a b color:white
e a a color:yellow
directed`;

    const converted = parseText(text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);
    const convertedEdges = convertArrayToObject(converted.edges);

    expect(convertedNodes).toEqual(graph.nodes);
    expect(convertedEdges).toEqual(graph.edges);
    expect(converted.directed).toEqual(graph.directed);
    expect(converted.message).toEqual(graph.message);
});

test("Empty Graph", () => {
    const nodes = {};
    const edges = {};

    const graph = new Graph(nodes, edges, false, "");

    const text = ``;  // Empty input

    const converted = parseText(text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);
    const convertedEdges = convertArrayToObject(converted.edges);

    expect(convertedNodes).toEqual(graph.nodes);
    expect(convertedEdges).toEqual(graph.edges);
    expect(converted.directed).toEqual(graph.directed);
    expect(converted.message).toEqual(graph.message);
});

test("Self-loop with Attributes", () => {
    const nodes = {
        'a': new NodeObject(undefined, 'a', 10, 10, false, undefined, undefined, undefined, undefined)
    };
    nodes['a'].weight = 5;
    nodes['a'].color = 'blue';

    const edges = {
        'a a': new EdgeObject(undefined, 'a a', 'a', 'a', undefined)
    };
    edges['a a'].weight = 10;
    edges['a a'].color = 'green';
    edges['a a'].shouldBeInvisible = undefined; // Explicitly set to undefined

    const graph = new Graph(nodes, edges, true, "");

    const text = `n a 10 10 5 color:blue
e a a 10 color:green
directed`;

    const converted = parseText(text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);
    const convertedEdges = convertArrayToObject(converted.edges);

    expect(convertedNodes).toEqual(graph.nodes);
    expect(convertedEdges).toEqual(graph.edges);
    expect(converted.directed).toEqual(graph.directed);
    expect(converted.message).toEqual(graph.message);
});

test("Directed Graph without Weights", () => {
    const nodes = {
        'a': new NodeObject(undefined, 'a', 10, 10, false, undefined, undefined, undefined, undefined),
        'b': new NodeObject(undefined, 'b', 15, 10, false, undefined, undefined, undefined, undefined)
    };

    const edges = {
        'a b': new EdgeObject(undefined, 'a b', 'a', 'b', undefined)
    };
    edges['a b'].shouldBeInvisible = undefined; // Explicitly set to undefined

    const graph = new Graph(nodes, edges, true, "");

    const text = `n a 10 10
n b 15 10
e a b
directed`;

    const converted = parseText(text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);
    const convertedEdges = convertArrayToObject(converted.edges);

    expect(convertedNodes).toEqual(graph.nodes);
    expect(convertedEdges).toEqual(graph.edges);
    expect(converted.directed).toEqual(graph.directed);
    expect(converted.message).toEqual(graph.message);
});
