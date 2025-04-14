
// import  { Graph } from "utils/graph/Graph";
// import Edge from "utils/graph/GraphElement/Edge";
import "@testing-library/jest-dom";
import FileParser from "interfaces/FileParser/FileParser";
import Graph from "states/Graph/Graph";
import Edge from "states/Graph/GraphElement/Edge";
import Node from "states/Graph/GraphElement/Node";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";

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
        "a": new Node("a", 10, 10 ),
        "b": new Node("b", 15, 10 )
    };
    nodes["a"].weight = 20;
    nodes["b"].weight = 20;

    const edges = {
        "a b": new Edge("a", "b"),
        "a a": new Edge("a", "a")
    };
    edges["a b"].weight = 20;
    edges["a b"].shouldBeInvisible = undefined; // Explicitly set to undefined
    edges["a a"].weight = 20;
    edges["a a"].shouldBeInvisible = undefined; // Explicitly set to undefined

    //const graph = new Graph(nodes, edges, false, "");

    const text = `n a 10 10 20
n b 15 10 20
e a b 20
e a a 20`;

    const converted = FileParser.loadGraph("", text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);

    expect(convertedNodes.position).toEqual(nodes.position);
    expect(convertedNodes.weight).toEqual(nodes.weight);
    expect(converted.directed).toEqual(undefined);
});

test("String to Predicate Without Weights No Special Key/Value Pairs", () => {
    const nodes = {
        "a": new Node(undefined, "a", 10, 10 ),
        "b": new Node(undefined, "b", 15, 10 )
    };

    const edges = {
        "a b": new Edge("a", "b" ),
        "a a": new Edge("a", "a" )
    };
    edges["a b"].shouldBeInvisible = undefined; // Explicitly set to undefined
    edges["a a"].shouldBeInvisible = undefined; // Explicitly set to undefined


    const text = `n a 10 10
n b 15 10
e a b
e a a`;

    const converted = FileParser.loadGraph("", text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);

    expect(convertedNodes.position).toEqual(nodes.position);
    expect(convertedNodes.id).toEqual(nodes.id);
    expect(converted.directed).toEqual(undefined);
});



test("String to Predicate Without Weights But With Special Key/Value Pairs", () => {
    const nodes = {
        "a": new Node(undefined, "a", 10, 10),
        "b": new Node(undefined, "b", 15, 10)
    };
    nodes["a"].color = "brown";
    nodes["b"].color = "brown";

    const edges = {
        "a b": new Edge(undefined, "a b", "a", "b", undefined),
        "a a": new Edge(undefined, "a a", "a", "a", undefined)
    };
    edges["a b"].color = "white"; // Explicitly set color
    edges["a b"].shouldBeInvisible = undefined; // Explicitly set to undefined
    edges["a a"].color = "yellow"; // Explicitly set color
    edges["a a"].shouldBeInvisible = undefined; // Explicitly set to undefined

    const graph = new Graph(nodes, edges, true, "");

    const text = `n a 10 10 color:brown
n b 15 10 color:brown
e a b color:white
e a a color:yellow`;

    const converted = FileParser.loadGraph("", text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);

    expect(convertedNodes.position).toEqual(nodes.position);
    expect(convertedNodes.attributes).toEqual(nodes.color);
    expect(convertedNodes.id).toEqual(nodes.id);
    expect(converted.directed).toEqual(undefined);
});

test("Empty Graph", () => {
    const nodes = {};
    const edges = {};


    const text = ``;  // Empty input

    const converted = FileParser.loadGraph("", text);
    const convertedNodes = convertArrayToObject(converted.nodes);

    expect(convertedNodes).toEqual(nodes);
    expect(converted.directed).toEqual(undefined);
});

test("Self-loop with Attributes", () => {
    const nodes = {
        "a": new Node(undefined, "a", 10, 10 )
    };
    nodes["a"].weight = 5;
    nodes["a"].color = "blue";

    const edges = {
        "a a": new Edge(undefined, "a a", "a", "a", undefined)
    };
    edges["a a"].weight = 10;
    edges["a a"].color = "green";
    edges["a a"].shouldBeInvisible = undefined; // Explicitly set to undefined

    const graph = new Graph(nodes, edges, true, "");

    const text = `n a 10 10 5 color:blue
e a a 10 color:green`;

    const converted = FileParser.loadGraph("", text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);
    expect(convertedNodes.position).toEqual(nodes.position);
    expect(convertedNodes.attributes).toEqual(nodes.color);
    expect(converted.directed).toEqual(undefined);
    expect(GraphInterface.getEdgeAttribute(converted, "a", "a", "weight")).toEqual(10);
    expect(GraphInterface.getEdgeAttribute(converted, "a", "a", "color")).toEqual("green");
    
});

test("Directed Graph without Weights", () => {
    const nodes = {
        "a": new Node(undefined, "a", 10, 10, false),
        "b": new Node(undefined, "b", 15, 10, false)
    };

    const edges = {
        "a b": new Edge(undefined, "a b", "a", "b", undefined)
    };
    edges["a b"].shouldBeInvisible = undefined; // Explicitly set to undefined

    const graph = new Graph(nodes, edges, true, "");

    const text = `n a 10 10
n b 15 10
e a b`;

    const converted = FileParser.loadGraph("", text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);

    expect(convertedNodes.position).toEqual(nodes.position);

});

test("Test sgf graph", () => {
    const nodes = {
        "a": new Node("a", "a", 10, 10, false ),
        "b": new Node("b", "b", 10, 15, false )
    };
    nodes["a"].color = "brown";
    nodes["b"].color = "brown";

    const edges = {
        "a b": new Edge(undefined, "a b", "a", "b", undefined),
        "a a": new Edge(undefined, "a a", "a", "a", undefined)
    };
    edges["a b"].color = "white"; // Explicitly set color
    edges["a b"].shouldBeInvisible = undefined; // Explicitly set to undefined
    edges["a a"].color = "yellow"; // Explicitly set color
    edges["a a"].shouldBeInvisible = undefined; // Explicitly set to undefined

    const graph = new Graph(nodes, edges, true, "");

    const text = `t graph
n a 10 10 color:brown
n b 15 10 color:brown
e a b color:white
e a a color:yellow`;

    const converted = FileParser.loadGraph("", text);
    
    const convertedNodes = convertArrayToObject(converted.nodes);

    expect(convertedNodes.position).toEqual(nodes.position);
    expect(GraphInterface.getNodeAttribute(converted, "a", "color")).toEqual("brown");
    expect(GraphInterface.getNodeAttribute(converted, "b", "color")).toEqual("brown");
    expect(GraphInterface.getEdgeAttribute(converted, "a", "b", "color")).toEqual("white");
    expect(GraphInterface.getEdgeAttribute(converted, "a", "a", "color")).toEqual("yellow");
    expect(converted.directed).toEqual(graph.directed);
});

/**
 * Mock window functions for testing environment
 * @author Ziyu Wang
 *
global.window = {};
window.updateCytoscape = jest.fn();
window.updateStep = jest.fn();
window.updateMessage = jest.fn();



Currently commented out while I work on other tests




/**
 * Test methods for the FileParser, which is responsible
 * for loading a graph from a text file.
 *
 * @author Krisjian Smith
 *
describe("FileParser tests", () => {
    
    /** Graph object used in each test *
    let graph;
    
    /** Sets up Graph objects before each test *
    beforeEach(() => {
        
        graph = new Graph();

    });

    /**
     * Test reading in a few valid files
     *
    test("Testing FileParser with valid files", () => {
        
        // Load a test graph. This is a graph that I made that should test just about
        // everything. It has arbitrary node ids, arbitrary weights and values, and some
        // edges have weights and some don't
        let graphText = "n 0 0 0 1 color:red shape:star highlighted:yes\n" +
            "n 1 1 0 color:black\n" +
            "n abc 1 1\n" +
            "n n 0 1 -1\n" +
            "n 2 -1 -1 -5\n" +
            "n -1 100 -1000 -754\n" +
            "e 0 1 2 bold:true\n" +
            "e 1 abc squiggly:true\n" +
            "e n -1 -4\n";
        graph.fileParser.loadGraph(graphText);
 
        // TODO: Finish this test when we can retrieve node attributes and coordinates. As of yet,
        //       there is no way to know if the graph is successfully reading the node's attributes
        //       or coordinates.
        
        // Check that each edge was created
        expect(graph.getEdge("0", "1")).toBeInstanceOf(Edge);
        expect(graph.getEdge("1", "abc")).toBeInstanceOf(Edge);
        expect(graph.getEdge("n", "-1")).toBeInstanceOf(Edge);
        
        // Check that the edges have the appropriate attributes
        expect(graph.getEdge("0", "1").getAttribute("bold")).toBe("true");
        expect(graph.getEdge("1", "abc").getAttribute("squiggly")).toBe("true");
        expect(graph.getEdge("n", "-1").getAttribute("weight")).toBe(-4);
        
        // Check that the weights of the nodes were set properly
        expect(graph.getNodeAttribute("0", "weight")).toBe(1);
        expect(graph.getNodeAttribute("1", "weight")).toBeUndefined();
        expect(graph.getNodeAttribute("-1", "weight")).toBe(-754);
        expect(graph.getNodeAttribute("2", "weight")).toBe(-5);

        // Check the attributes of the nodes
        expect(graph.getNodeAttribute("0", "color")).toBe("red");
        expect(graph.getNodeAttribute("0", "shape")).toBe("star");
        expect(graph.getNodeAttribute("0", "highlighted")).toBe("yes");
        expect(graph.getNodeAttribute("1", "color")).toBe("black");
 
        // TODO: Check the node coordinates. We still have no way to
        //       read the coordinates of a node.

    });
    
    /**
     * Test reading in invalid files
     *
     */
    test("Testing FileParser with invalid files", () => {
        
        // Testing with incomplete lines
        expect( () => {
            let graphText = "n";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0 0";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "e";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0 0 1\nn 1 1 0\ne 0";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0 0 1\nn 1 1 0\ne a";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();

        // Test with invalid weights
        expect( () => {
            let graphText = "n 0 0 abc";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0 0 1\nn 1 1 0\ne 0 1 invalid";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();

        // Test with bad attributes
        expect( () => {
            let graphText = "n 0 1 abc::123";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0 0 4 abc:";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0 0 :abc";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0 0 1\nn 1 1 0\ne 0 1 2 abc";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0 0 1\nn 1 1 0\ne 0 1 abc:";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0 0 1\nn 1 1 0\ne 0 1 2 :abc";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        expect( () => {
            let graphText = "n 0 0 1\nn 1 1 0\ne 0 1 2 abc::abc";
            graph.fileParser.loadGraph(graphText);
        }).toThrow();
        
    });
