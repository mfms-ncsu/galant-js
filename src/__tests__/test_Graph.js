import { Graph } from "graph/Graph";
import Edge from "graph/GraphElement/Edge";

/**
 * Test methods for the Graph class.
 *
 * @author Krisjian Smith
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
     * Test method for Graph.getOutgoingEdges
     */
    test("Testing the Graph.getOutgoingEdges method", () => {
        
        // Get the outgoing Edges for node2. This should be the
        // edge from 2 to 3 and 2 to 4
        let outgoingEdges = graph.getOutgoingEdges(node2);
        
        // Make sure that the two exected edges were returned
        expect(outgoingEdges.length).toBe(2);
        expect(graph.getEdge(node2, node3)).toBe(outgoingEdges[0]);
        expect(graph.getEdge(node2, node4)).toBe(outgoingEdges[1]);

        // Try with node with no edges. It should return an empty list.
        let newNode = graph.userChangeManager.addNode(2, 2);
        let newNodeEdges = graph.getOutgoingEdges(newNode);
        expect(newNodeEdges.length).toBe(0);

        // Try with invalid input
        expect(graph.getOutgoingEdges("bad input")).toBeUndefined();

    });
    
    /**
     * Test method for Graph.getIncomingEdges
     */
    test("Testing the Graph.getIncomingEdges method", () => {

        // Get the incomgoing Edges for node3. This should be the
        // edge from 1 to 3 and 2 to 3
        let incomingEdges = graph.getIncomingEdges(node3);
        
        // Make sure that the two exected edges were returned
        expect(incomingEdges.length).toBe(2);
        expect(graph.getEdge(node1, node3)).toBe(incomingEdges[0]);
        expect(graph.getEdge(node2, node3)).toBe(incomingEdges[1]);

        // Try with node with no edges. It should return an empty list.
        let newNode = graph.userChangeManager.addNode(2, 2);
        let newNodeEdges = graph.getIncomingEdges(newNode);
        expect(newNodeEdges.length).toBe(0);

        // Try with invalid input
        expect(graph.getIncomingEdges("bad input")).toBeUndefined();
    });
    
    /**
     * Test method for Graph.getAllEdges
     */
    test("Testing the Graph.getAllEdges method", () => {
        
        // Get all the edges for node2. This should be the edge
        // from 1 to 2, from 2 to 3, and from 2 to 4.

        let edges = graph.getAllEdges(node2);

        // Make sure that all the expected edges were returned
        expect(edges.length).toBe(3);
        expect(graph.getEdge(node1, node2)).toBe(edges[0]);
        expect(graph.getEdge(node2, node3)).toBe(edges[1]);
        expect(graph.getEdge(node2, node4)).toBe(edges[2]);
        
        // Try with node with no edges. It should return an empty list.
        let newNode = graph.userChangeManager.addNode(2, 2);
        let newNodeEdges = graph.getAllEdges(newNode);
        expect(newNodeEdges.length).toBe(0);

        // Try with invalid input
        expect(graph.getAllEdges("bad input")).toBeUndefined();
    });
});
