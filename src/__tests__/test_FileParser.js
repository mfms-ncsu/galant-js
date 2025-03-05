import  { Graph } from "utils/graph/Graph/Graph";
import Edge from "utils/graph/GraphElement/Edge";

/**
 * Mock window functions for testing environment
 * @author Ziyu Wang
 */
global.window = {};
window.updateCytoscape = jest.fn();
window.updateStep = jest.fn();
window.updateMessage = jest.fn();

/**
 * Test methods for the FileParser, which is responsible
 * for loading a graph from a text file.
 *
 * @author Krisjian Smith
 */
describe("FileParser tests", () => {
    
    /** Graph object used in each test */
    let graph;
    
    /** Sets up Graph objects before each test */
    beforeEach(() => {
        
        graph = new Graph();

    });

    /**
     * Test reading in a few valid files
     */
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
    
});
