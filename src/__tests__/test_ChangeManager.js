import { Graph } from "graph/Graph";
import Edge from "graph/GraphElement/Edge";
import ChangeManager from "graph/ChangeManager/ChangeManager";

// TODO: Test with invalid inputs, whenever we decide what those should
//       be

// TODO: When the implementation of the ChangeManager is complete, add
//       more tests to ensure branch coverage is good.

/**
 * Test file for the ChangeManager class.
 *
 * @author Krisjian Smith
 */
describe("ChangeManager tests", () => {
    
    /** Graph with no edges or nodes for testing */
    let graph;

    // TODO: Try with different graphs? Maybe a directed graph
    //       or one loaded from a file?

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
        graph.userChangeManager.addEdge(node1, node2);

        // Make sure the edge between the two nodes exists
        let edge = graph.getEdge(node1, node2);

        // Make sure that the edge exists, and that its
        // nodes are node1 and node2, respectively
        expect(edge).toBeInstanceOf(Edge);
        expect(edge.source).toBe(node1);
        expect(edge.target).toBe(node2);
    });
    
    /** 
     * Test the addMessage method
     */
    test("Testing ChangeManager.addMessage", () => {
        let message = graph.addMessage("Displayed message");

        // TODO: ???
        // I don't really know how to test that this call was a
        // successful. There's no getMessage() function in
        // ChangeManager or Graph.
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
        expect(graph.getEdge(node1, node3).source).toBe(node1);
        expect(graph.getEdge(node1, node4).source).toBe(node1);

        // Remove node1
        graph.userChangeManager.deleteNode(node1);

        // All calls to getEdge() should fail now

        // TODO: Finish this method when we have implemented getEdge.
        //       Right now, I'm not sure if this should throw an error,
        //       return some kind of null value, or do something else.
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

        // 
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

        // TODO: Test that this function was successful. Currently,
        //       there's no way to get the attribute from a node.
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
        // TODO: Check that the attribute has been removed. I'm not sure
        //       if calling getAttribute is supposed to throw an error
        //       or return a null value if there is no attribute with
        //       the given name

        // Call undo again, the edge should be removed
        graph.userChangeManager.undo();

        // TODO: Check that the edge was removed. Again, not sure what
        //       the expected behavior should be yet.

        // Redo the edge
        graph.userChangeManager.redo();

        // The edge should be back, but with no attribute
        expect(graph.getEdge(node1, node2)).toBeInstanceOf(Edge);
        // TODO: Check that the edge has no attribute.

        // Redo the attribute
        graph.userChangeManager.redo();

        // Make sure that the edge has it's attribute back
        expect(graph.getEdge(node1, node2).getAttribute("color"))
            .toBe("red");

    });
});
