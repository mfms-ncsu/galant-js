import Graph from "states/Graph/Graph";
import ChangeManager from "states/ChangeManager/ChangeManager";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import Edge from "states/Graph/GraphElement/Edge";

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
     * ChangeManager used in each test
     */
    let changeManager;  
    
    /**
     * The node ID strings for each of the nodes in the graph
     */
    let node1, node2, node3, node4;
    
    /** Sets up the Graph objects before each test */
    beforeEach(() => {

        // Construct the graph
        graph = new Graph();
        changeManager = new ChangeManager();

        // Create the nodes
        [graph, changeManager, node1] = GraphInterface.addNode(graph, changeManager, 0, 0);
        [graph, changeManager, node2] = GraphInterface.addNode(graph, changeManager, 1, 0);
        [graph, changeManager, node3] = GraphInterface.addNode(graph, changeManager, 1, 1);
        [graph, changeManager, node4] = GraphInterface.addNode(graph, changeManager, 0, 1);

        // Create the edges
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node1, node2);
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node1, node3);
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node1, node4);
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node2, node3);
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node2, node4);
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node3, node4);
    });
    
    /**
     * Test method for Graph.getEdge
     */
    test("Testing the GraphInterface.getEdge method", () => {
        
        // Make sure the edge object is returned, and has the correct
        // source and target
        expect(GraphInterface.getEdge(graph, node1, node2)).toBeInstanceOf(Edge);
        expect(GraphInterface.getEdge(graph, node1, node2)).toBeInstanceOf(Edge);
        expect(GraphInterface.getEdge(graph, node1, node2).source).toBe(node1);
        expect(GraphInterface.getEdge(graph, node1, node2).target).toBe(node2);

        // Try with bad input
        expect(() => { GraphInterface.getEdge(graph, "bad input", node1) } ).toThrow();
        expect(() => { GraphInterface.getEdge(graph, node1, "bad input") } ).toThrow();
        expect(() => { GraphInterface.getEdge(graph, "bad input", "bad input") } ).toThrow();

        // Try with valid inputs, when there is no edge
        let newNode;
        [graph, changeManager, newNode] = GraphInterface.addNode(graph, changeManager, 2, 2);
        expect(GraphInterface.getEdge(graph, node1, newNode)).toBeUndefined();
        expect(GraphInterface.getEdge(graph, newNode, node1)).toBeUndefined();
    });

    /**
     * Test method for Graph.getScalar
     *
     * TODO: Figure out a consistent way to test this. It depends on the size of your
     *       screen, so it will pass on some computers but fail on others.
    test("Testing the Graph.getScalar method", () => {
        expect(GraphInterface.getScalar(graph)).toEqual([1, 1]);
    });
     */

    /**
     * Test method for GraphInterface.getNodes
     */
    test("Testing the GraphInterface.getNodeIds method", () => {
        expect(() => { GraphInterface.getNodeIds(null) } ).toThrow();
        expect(GraphInterface.getNodeIds(graph)).toEqual([node1, node2, node3, node4]);
    });

    /**
     * Test method for GraphInterface.getIncidentEdges
     */
    test("Testing the GraphInterface.getIncidentEdges method", () => {
        expect(GraphInterface.getIncidentEdges(graph, node1)).toEqual([
            `${node1},${node2}`,
            `${node1},${node3}`,
            `${node1},${node4}`
        ]);
        expect(() => { GraphInterface.getIncidentEdges(graph, "nonexistent") } ).toThrow();
    });

    /**
     * Test method for GraphInterface.getIncomingEdges
     */
    test("Testing the GraphInterface.getIncomingEdges method", () => {

        // For an undirected graph, this should get the same results as getIncidentEdges
        expect(GraphInterface.getIncomingEdges(graph, node1)).toEqual([
            `${node1},${node2}`,
            `${node1},${node3}`,
            `${node1},${node4}`
        ]);
        
        // For a directed graph, only the incoming nodes should be returned
        graph = GraphInterface.setDirected(graph, true);
        expect(GraphInterface.getIncomingEdges(graph, node2)).toEqual([
            `${node1},${node2}`
        ]);

        expect(() => { GraphInterface.getIncomingEdges(graph, "nonexistent") } ).toThrow();
    });

    /**
     * Test method for GraphInterface.getOutgoingEdges
     */
    test("Testing the GraphInterface.getOutgoingEdges method", () => {

        // For an undirected graph, this should get the same results as getIncidentEdges
        expect(GraphInterface.getOutgoingEdges(graph, node1)).toEqual([
            `${node1},${node2}`,
            `${node1},${node3}`,
            `${node1},${node4}`
        ]);
        
        // For a directed graph, only the outgoing edges should be shown
        graph = GraphInterface.setDirected(graph, true);
        expect(GraphInterface.getOutgoingEdges(graph, node2)).toEqual([
            `${node2},${node3}`,
            `${node2},${node4}`
        ]);
        expect(() => { graph.getOutgoingEdges("nonexistent") } ).toThrow();
    });

    /**
     * Test method for GraphInterface.getOppositeNode
     */
    test("Testing the GraphInterface.getOppositeNode method", () => {
        expect(GraphInterface.getOppositeNode(graph, node1, `${node1},${node2}`)).toBe(node2);
        expect(GraphInterface.getOppositeNode(graph, node2, `${node1},${node2}`)).toBe(node1);
        expect(() => { GraphInterface.getOppositeNode(graph, "nonexistent", `${node1},${node2}`) } ).toThrow();
        expect(() => { GraphInterface.getOppositeNode(graph, node1, "nonexistent") } ).toThrow();
        expect(() => { GraphInterface.getOppositeNode(graph, node1, "2,3") } ).toThrow();
    });

    /**
     * Test method for Graph.getNodePosition
     *
    test("Testing the Graph.getNodePosition method", () => {
        expect(graph.getNodePosition(node1)).toEqual({ x: 0, y: 0 });
        expect(graph.getNodePosition("nonexistent")).toBeUndefined();
    });

    /**
     * Test method for Graph.getNodeAttribute
     *
    test("Testing the Graph.getNodeAttribute method", () => {
        expect(graph.getNodeAttribute(node1, "attribute")).toBeUndefined();
        expect(graph.getNodeAttribute("nonexistent", "attribute")).toBeUndefined();
    });

    /**
     * Test method for Graph.getEdgeAttribute
     *
    test("Testing the Graph.getEdgeAttribute method", () => {
        expect(graph.getEdgeAttribute(node1, node2, "attribute")).toBeUndefined();
        expect(graph.getEdgeAttribute("nonexistent", node2, "attribute")).toBeUndefined();
    });
    */
    
});
