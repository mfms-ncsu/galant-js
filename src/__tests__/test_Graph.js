import { Graph } from "graph/Graph";
import Edge from "graph/GraphElement/Edge";

/**
 * Mock window functions for testing environment
 * @author Ziyu Wang
 */
global.window = {};
window.updateCytoscape = jest.fn();
window.updateStep = jest.fn();
window.updateMessage = jest.fn();

/**
 * Test methods for the Graph class.
 *
 * @author Krisjian Smith
 * @author Ziyu Wang
 */
describe("Graph tests", () => {
    
    /**
     * Graph used in each test. It represents a 4-clique, a graph
     * with 4 nodes and an edge between every pair of nodes.
     */
    let graph;
    
    /**
     * The node ID strings for each of the nodes in the graph
     */
    let node1, node2, node3, node4;
    
    /** Sets up the Graph objects before each test */
    beforeEach(() => {

        // Construct the graph
        graph = new Graph();

        // Create the nodes
        node1 = graph.userChangeManager.addNode(0, 0);
        node2 = graph.userChangeManager.addNode(1, 0);
        node3 = graph.userChangeManager.addNode(1, 1);
        node4 = graph.userChangeManager.addNode(0, 1);

        // Create the edges
        graph.userChangeManager.addEdge(node1, node2);
        graph.userChangeManager.addEdge(node1, node3);
        graph.userChangeManager.addEdge(node1, node4);
        graph.userChangeManager.addEdge(node2, node3);
        graph.userChangeManager.addEdge(node2, node4);
        graph.userChangeManager.addEdge(node3, node4);
    });
    
    /**
     * Test method for Graph.getEdge
     */
    test("Testing the Graph.getEdge method", () => {
        
        // Make sure the edge object is returned, and has the correct
        // source and target
        expect(graph.getEdge(node1, node2)).toBeInstanceOf(Edge);
        expect(graph.getEdge(node1, node2)).toBeInstanceOf(Edge);
        expect(graph.getEdge(node1, node2).source).toBe(node1);
        expect(graph.getEdge(node1, node2).target).toBe(node2);

        // Try with bad input
        expect(graph.getEdge("bad input", node1)).toBeUndefined();
        expect(graph.getEdge(node1, "bad input")).toBeUndefined();
        expect(graph.getEdge("bad input", "bad input")).toBeUndefined();

        // Try with valid inputs, when there is no edge
        let newNode = graph.userChangeManager.addNode(2, 2);
        expect(graph.getEdge(node1, newNode)).toBeUndefined();
        expect(graph.getEdge(newNode, node1)).toBeUndefined();
    });

    /**
     * Test method for Graph.getScalar
     */
    test("Testing the Graph.getScalar method", () => {
        expect(graph.getScalar()).toBe(1);
    });

    /**
     * Test method for Graph.getNodeArray
     */
    test("Testing the Graph.getNodeArray method", () => {
        expect(graph.getNodeArray()).toEqual([node1, node2, node3, node4]);
    });

    /**
     * Test method for Graph.getIncidentEdges
     */
    test("Testing the Graph.getIncidentEdges method", () => {
        expect(graph.getIncidentEdges(node1)).toEqual([
            `${node1},${node2}`,
            `${node1},${node3}`,
            `${node1},${node4}`
        ]);
        expect(graph.getIncidentEdges("nonexistent")).toBeUndefined();
    });

    /**
     * Test method for Graph.getIncomingEdges
     */
    test("Testing the Graph.getIncomingEdges method", () => {
        expect(graph.getIncomingEdges(node2)).toEqual([
            `${node1},${node2}`
        ]);
        expect(graph.getIncomingEdges("nonexistent")).toBeUndefined();
    });

    /**
     * Test method for Graph.getOutgoingEdges
     */
    test("Testing the Graph.getOutgoingEdges method", () => {
        expect(graph.getOutgoingEdges(node1)).toEqual([
            `${node1},${node2}`,
            `${node1},${node3}`,
            `${node1},${node4}`
        ]);
        expect(graph.getOutgoingEdges("nonexistent")).toBeUndefined();
    });

    /**
     * Test method for Graph.getOppositeNode
     */
    test("Testing the Graph.getOppositeNode method", () => {
        expect(graph.getOppositeNode(node1, `${node1},${node2}`)).toBe(node2);
        expect(() => graph.getOppositeNode("nonexistent", `${node1},${node2}`)).toThrow();
        expect(() => graph.getOppositeNode(node1, "nonexistent")).toThrow();
    });

    /**
     * Test method for Graph.getNodePosition
     */
    test("Testing the Graph.getNodePosition method", () => {
        expect(graph.getNodePosition(node1)).toEqual({ x: 0, y: 0 });
        expect(graph.getNodePosition("nonexistent")).toBeUndefined();
    });

    /**
     * Test method for Graph.getNodeAttribute
     */
    test("Testing the Graph.getNodeAttribute method", () => {
        expect(graph.getNodeAttribute(node1, "attribute")).toBeUndefined();
        expect(graph.getNodeAttribute("nonexistent", "attribute")).toBeUndefined();
    });

    /**
     * Test method for Graph.getEdgeAttribute
     */
    test("Testing the Graph.getEdgeAttribute method", () => {
        expect(graph.getEdgeAttribute(node1, node2, "attribute")).toBeUndefined();
        expect(graph.getEdgeAttribute("nonexistent", node2, "attribute")).toBeUndefined();
    });
    
});
