import { Graph } from "utils/graph/Graph";
import Edge from "utils/graph/GraphElement/Edge";
import ChangeManager from "utils/graph/ChangeManager/ChangeManager";

/**
 * Mock window functions for testing environment
 * @author Ziyu Wang
 */
global.window = {};
window.updateCytoscape = jest.fn();
window.updateStep = jest.fn();
window.updateMessage = jest.fn();

/**
 * Test file for the ChangeManager class.
 *
 * @author Krisjian Smith
 */
describe("ChangeManager tests", () => {
    
    /** Graph with no edges or nodes for testing */
    let graph;

    /** Sets up Graph objects before each test */
    beforeEach(() => {
        
        graph = new Graph();

    });
    
    /** 
     * Tests that both ChangeManager objects are successfully
     * created when the Graph is constructed
     */
    test("Retrieve both ChangeManagers from the Graph", () => {

        expect(graph.userChangeManager)
            .toBeInstanceOf(ChangeManager);

        expect(graph.algorithmChangeManager)
            .toBeInstanceOf(ChangeManager);
    });
    
    /** 
     * Test the addNode and addEdge methods. These two methods are tested
     * together since there's no way to add an Edge without first adding
     * Nodes, and there's no way to test if a Node exists without 
     * retrieving an Edge it belongs to.
     *
     * It's a little strange to have Edge objects but not Node
     * objects, but we don't allow the user to retrieve a Node
     * object itself because they could add their own edges to the
     * Node's internal Edge map, which would bypass the ChangeManager.
     */
    test("Testing ChangeManager.addNode and ChangeManager.addEdge", 
            () => {

        // Add a node to the graph
        let node1 = graph.userChangeManager.addNode(0, 0);
        
        // Add a new node to the graph
        let node2 = graph.userChangeManager.addNode(1, 1);

        // Add an edge between the two nodes
        graph.userChangeManager.addEdge(node1, node2);

        // Make sure the edge between the two nodes exists
        let edge = graph.getEdge(node1, node2);

        // Make sure that the edge exists, and that its
        // nodes are node1 and node2, respectively
        expect(edge).toBeInstanceOf(Edge);
        expect(edge.source).toBe(node1);
        expect(edge.target).toBe(node2);

        // Make sure that we cannot add edges between nodes that do not exist
        expect( () => {
            graph.userChangeManager.addEdge(node1, "bad input");
        }).toThrow();
        expect( () => {
            graph.userChangeManager.addEdge("bad input", node1);
        }).toThrow();
        expect( () => {
            graph.userChangeManager.addEdge("bad input", "bad input");
        }).toThrow();
    }); 
    
    /** 
     * Test the deleteNode method
     */
    test("Testing ChangeManager.deleteNode", () => {
        
        // Make a graph that's a 4-clique (graph with 4 nodes, and
        // each node is connected to each other node)
        let node1 = graph.userChangeManager.addNode(0, 0);
        let node2 = graph.userChangeManager.addNode(1, 0);
        let node3 = graph.userChangeManager.addNode(1, 1);
        let node4 = graph.userChangeManager.addNode(0, 1);

        graph.userChangeManager.addEdge(node1, node2);
        graph.userChangeManager.addEdge(node1, node3);
        graph.userChangeManager.addEdge(node1, node4);
        graph.userChangeManager.addEdge(node2, node3);
        graph.userChangeManager.addEdge(node2, node4);
        graph.userChangeManager.addEdge(node3, node4);

        // Make sure that node1 and it's associated edges were created
        expect(graph.getEdge(node1, node2).source).toBe(node1);
        expect(graph.getEdge(node2, node3).source).toBe(node2);
        expect(graph.getEdge(node2, node4).source).toBe(node2);

        // Remove node1
        graph.userChangeManager.deleteNode(node2);

        // Test that the associated edges of the node are removed
        expect(graph.getEdge(node1, node2)).toBeUndefined();
        expect(graph.getEdge(node2, node3)).toBeUndefined();
        expect(graph.getEdge(node2, node4)).toBeUndefined();
 
        // We should no longer allow the node to be used in making edges
        expect( () => {
            graph.userChangeManager.addEdge(node1, node2);
        }).toThrow();
        expect( () => {
            graph.userChangeManager.addEdge(node2, node1);
        }).toThrow();

        // Any adjacency lists containing the edge should be updated
        let incoming = graph.getIncomingEdges(node3);
        expect(incoming.length).toBe(1);

        let outgoing = graph.getOutgoingEdges(node1);
        expect(outgoing.length).toBe(2);
    });
    
    /** 
     * Test the deleteEdge method
     */
    test("Testing ChangeManager.deleteEdge", () => {
        
        // Make a graph that's a 4-clique (graph with 4 nodes, and
        // each node is connected to each other node)
        let node1 = graph.userChangeManager.addNode(0, 0);
        let node2 = graph.userChangeManager.addNode(1, 0);
        let node3 = graph.userChangeManager.addNode(1, 1);
        let node4 = graph.userChangeManager.addNode(0, 1);

        graph.userChangeManager.addEdge(node1, node2);
        graph.userChangeManager.addEdge(node1, node3);
        graph.userChangeManager.addEdge(node1, node4);
        graph.userChangeManager.addEdge(node2, node3);
        graph.userChangeManager.addEdge(node2, node4);
        graph.userChangeManager.addEdge(node3, node4);

        // Make sure the edge was created properly
        expect(graph.getEdge(node1, node2)).toBeInstanceOf(Edge);

        // Delete one of the edges, then make sure it does not exist anymore
        graph.userChangeManager.deleteEdge(node1, node2);

        expect(graph.getEdge(node1, node2)).toBeUndefined();

    });
    
    /** 
     * Test the setNodeAttribute method
     */
    test("Testing ChangeManager.setNodeAttribute", () => {
        
        // Create a node
        let node = graph.userChangeManager.addNode(0, 0);

        // Set an attribute
        graph.userChangeManager.setNodeAttribute(node,
                                                 "marked", true);
        // Test that the attribute exists
        expect(graph.getNodeAttribute(node, "marked")).toBe(true);

        // Test that invalid inputs return undefined
        expect(graph.getNodeAttribute("bad input", "marked")).toBeUndefined();
    });
    
    /** 
     * Test the setEdgeAttribute method
     */
    test("Testing ChangeManager.setEdgeAttribute", () => {
        
        // Make an edge
        let node1 = graph.userChangeManager.addNode(0, 0);
        let node2 = graph.userChangeManager.addNode(1, 1);
        graph.userChangeManager.addEdge(node1, node2);


        // Set an attribute
        graph.userChangeManager.setEdgeAttribute(
            node1, node2,
            "color", "red");

        // Make sure that the edge's attribute was properly saved
        expect(graph.getEdge(node1, node2).getAttribute("color"))
            .toBe("red");

        // Make sure that the edge's attribute can be retrieved through
        // the graph interface as well
        expect(graph.getEdgeAttribute(node1, node2, "color")).toBe("red");

        // Make sure that invalid inputs return undefined
        expect(graph.getEdgeAttribute(node1, "bad input", "abc")).toBeUndefined();
    });
    
    /** 
     * Test the undo and redo methods. These are tested together
     * because you cannot redo without first calling undo, so it
     * makes more sense to test redo while you are testing undo.
     */
    test("Testing ChangeManager.undo and ChangeManager.redo", () => {
        
        // Make a simple graph
        let node1 = graph.userChangeManager.addNode(0, 0);
        let node2 = graph.userChangeManager.addNode(1, 1);
        graph.userChangeManager.setNodeAttribute(node1, "color", "black");
        graph.userChangeManager.addEdge(node1, node2);
        
        // TODO: Add calls to setNodeAttribute once there is a way to
        //       retrieve a Node's attributes
        graph.userChangeManager.setEdgeAttribute(
            node1, node2,
            "color", "red");
        
        // Make sure that the edge has the attribute (which implies the
        // nodes and edges were created successfully as well);
        expect(graph.getEdge(node1, node2).getAttribute("color"))
            .toBe("red");

        // Call the Undo method. The Edge should still be there, but
        // it should have no attribute
        graph.userChangeManager.undo();

        expect(graph.getEdge(node1, node2)).toBeInstanceOf(Edge);
        expect(graph.getEdge(node1, node2).getAttribute("color")).toBeUndefined();

        // Call undo again, the edge should be removed
        graph.userChangeManager.undo();
        
        // Make sure the edge is no longer there
        expect(graph.getEdge(node1, node2)).toBeUndefined(); 

        // Undo both of the nodes

        // Undo the node's attribute. It should exist before the undo, but not after
        expect(graph.getNodeAttribute(node1, "color")).toBe("black");
        graph.userChangeManager.undo();
        expect(graph.getNodeAttribute(node1, "color")).toBeUndefined();

        // Undo the last two nodes
        graph.userChangeManager.undo();
        graph.userChangeManager.undo();

        // Now that the graph is empty, calling undo() again should have no effect
        graph.userChangeManager.undo();

        // Redo both nodes
        graph.userChangeManager.redo();
        graph.userChangeManager.redo();

        // Redo the attribute
        graph.userChangeManager.redo();
        expect(graph.getNodeAttribute(node1, "color")).toBe("black");
            
        // Redo the edge
        graph.userChangeManager.redo();

        // The edge should be back, but with no attribute
        expect(graph.getEdge(node1, node2)).toBeInstanceOf(Edge);
        expect(graph.getEdge(node1, node2).getAttribute("color")).toBeUndefined();

        // Redo the attribute
        graph.userChangeManager.redo();

        // Make sure that the edge has it's attribute back
        expect(graph.getEdge(node1, node2).getAttribute("color"))
            .toBe("red");

        // Calling redo now should have no effect, but should not throw any error
        graph.userChangeManager.redo();

    });

    /** 
     * Test the startRecording and endRecording methods
     * @author Ziyu Wang
     */
    test("Testing ChangeManager.startRecording and ChangeManager.endRecording", () => {
        graph.userChangeManager.startRecording();
        expect(graph.userChangeManager.isRecording()).toBe(true);

        let node1 = graph.userChangeManager.addNode(0, 0);
        let node2 = graph.userChangeManager.addNode(1, 1);
        graph.userChangeManager.addEdge(node1, node2);

        graph.userChangeManager.endRecording();
        expect(graph.userChangeManager.isRecording()).toBe(false);

        // Undo should remove both nodes and the edge at once
        graph.userChangeManager.undo();
        expect(graph.getEdge(node1, node2)).toBeUndefined();
        expect(graph.getNodePosition(node1)).toBeUndefined();
        expect(graph.getNodeAttribute(node1, "color")).toBeUndefined();
    });

    /** 
     * Test the revert method
     * @author Ziyu Wang
     */
    test("Testing ChangeManager.revert", () => {
        let node1 = graph.userChangeManager.addNode(0, 0);
        let node2 = graph.userChangeManager.addNode(1, 1);
        graph.userChangeManager.addEdge(node1, node2);

        graph.userChangeManager.revert();
        expect(graph.getEdge(node1, node2)).toBeUndefined();
        expect(graph.getNodeAttribute(node1, "color")).toBeUndefined();
    });

    /** 
     * Test the getLength and getIndex methods
     * @author Ziyu Wang
     */
    test("Testing ChangeManager.getLength and ChangeManager.getIndex", () => {
        let node1 = graph.userChangeManager.addNode(0, 0);
        let node2 = graph.userChangeManager.addNode(1, 1);
        graph.userChangeManager.addEdge(node1, node2);

        expect(graph.userChangeManager.getLength()).toBe(3);
        expect(graph.userChangeManager.getIndex()).toBe(3);

        graph.userChangeManager.undo();
        expect(graph.userChangeManager.getIndex()).toBe(2);
    });
    
});
