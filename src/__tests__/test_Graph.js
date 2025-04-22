import Graph from "states/Graph/Graph";
import ChangeManager from "states/ChangeManager/ChangeManager";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import Edge from "states/Graph/GraphElement/Edge";
import LayeredGraph from "states/Graph/LayeredGraph";

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
 * @author Ethan Haske
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
     * Test method for GraphInterface.getNodePosition
     */
    test("Testing the GraphInterface.getNodePosition method", () => {
        expect(GraphInterface.getNodePosition(graph, node1)).toEqual({ x: 0, y: 0 });
        expect(() => { GraphInterface.getNodePosition(graph, "nonexistent") } ).toThrow();
    });

    /**
     * Test method for GraphInterface.getNodeAttribute
     */
    test("Testing the GraphInterface.getNodeAttribute method", () => {
        expect(GraphInterface.getNodeAttribute(graph, node1, "attribute")).toBeUndefined();
        expect(() => { GraphInterface.getNodeAttribute(graph, "nonexistent", "attribute") } ).toThrow();
    });

    /**
     * Test method for GraphInterface.getEdgeAttribute
     */
    test("Testing the GraphInterface.getEdgeAttribute method", () => {
        expect(GraphInterface.getEdgeAttribute(graph, node1, node2, "attribute")).toBeUndefined();
        expect(() => { GraphInterface.getEdgeAttribute(graph, "nonexistent", node2, "attribute") } ).toThrow();
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
    test("Testing GraphInterface.addNode and GraphInterface.addEdge", 
            () => {
        
        graph = new Graph();

        // Add a node to the graph
        let node1, node2;
        [graph, changeManager, node1] = GraphInterface.addNode(graph, changeManager, 0, 0);
        
        // Add a new node to the graph
        [graph, changeManager, node2] = GraphInterface.addNode(graph, changeManager, 1, 1);

        // Add an edge between the two nodes
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node1, node2);

        // Make sure the edge between the two nodes exists
        let edge = GraphInterface.getEdge(graph, node1, node2);

        // Make sure that the edge exists, and that its
        // nodes are node1 and node2, respectively
        expect(edge).toBeInstanceOf(Edge);
        expect(edge.source).toBe(node1);
        expect(edge.target).toBe(node2);

        // Make sure that we cannot add edges between nodes that do not exist
        expect( () => {
            GraphInterface.addEdge(graph, changeManager, node1, "bad input");
        }).toThrow();
        expect( () => {
            GraphInterface.addEdge(graph, changeManager, "bad input", node1);
        }).toThrow();
        expect( () => {
            GraphInterface.addEdge(graph, changeManager, "bad input", "bad input");
        }).toThrow();
    }); 
    
    /** 
     * Test the deleteNode method
     */
    test("Testing GraphInterface.deleteNode", () => {
        
        // Remove node1
        [graph, changeManager] = GraphInterface.deleteNode(graph, changeManager, node2);

        // Test that the associated edges of the node are removed
        expect(() => { GraphInterface.getEdge(graph, node1, node2) } ).toThrow();
        expect(() => { GraphInterface.getEdge(graph, node2, node3) } ).toThrow();
        expect(() => { GraphInterface.getEdge(graph, node2, node4) } ).toThrow();
 
        // We should no longer allow the node to be used in making edges
        expect( () => {
            GraphInterface.addEdge(graph, changeManager, node1, node2);
        }).toThrow();
        expect( () => {
            GraphInterface.addEdge(graph, changeManager, node2, node1);
        }).toThrow();

        // Any adjacency lists containing the edge should be updated
        graph = GraphInterface.setDirected(graph, true);

        let incoming = GraphInterface.getIncomingEdges(graph, node3);
        expect(incoming.length).toBe(1);

        let outgoing = GraphInterface.getOutgoingEdges(graph, node1);
        expect(outgoing.length).toBe(2);
    });
    
    /** 
     * Test the deleteEdge method
     */
    test("Testing ChangeManager.deleteEdge", () => {
        
        // Delete one of the edges, then make sure it does not exist anymore
        [graph, changeManager] = GraphInterface.deleteEdge(graph, changeManager, node1, node2);

        expect(GraphInterface.getEdge(graph, node1, node2)).toBeUndefined();
        expect(() => {GraphInterface.deleteEdge(graph, changeManager, node1, "bad")} ).toThrow();
        expect(() => {GraphInterface.deleteEdge(graph, changeManager, "bad", node1)} ).toThrow();
        expect(() => {GraphInterface.deleteEdge(graph, changeManager, node1, node2)} ).toThrow();

    });
    
    /** 
     * Test the setNodeAttribute method
     */
    test("Testing ChangeManager.setNodeAttribute", () => {
        
        // Set an attribute
        [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, node1, "marked", true);

        // Test that the attribute exists
        expect(GraphInterface.getNodeAttribute(graph, node1, "marked")).toBe(true);
        expect(GraphInterface.getNodeAttribute(graph, node1, "unusedAttribute")).toBeUndefined();

        // Test that invalid inputs return undefined
        expect(() => { GraphInterface.getNodeAttribute("bad input", "marked") } ).toThrow();
    });
    
    /** 
     * Test the setEdgeAttribute method
     */
    test("Testing ChangeManager.setEdgeAttribute", () => {
        
        // Set an attribute
        [graph, changeManager] = GraphInterface.setEdgeAttribute(graph, changeManager, node1, node2, "color", "red");

        // Make sure that the edge's attribute was properly saved
        expect(GraphInterface.getEdgeAttribute(graph, node1, node2, "color")).toBe("red");
        expect(GraphInterface.getEdgeAttribute(graph, node1, node2, "newAttribute")).toBeUndefined;
        
        // Make sure that invalid inputs throw an error
        expect(() => { GraphInterface.getEdgeAttribute(graph, node1, "bad input", "abc") } ).toThrow();
        expect(() => { GraphInterface.getEdgeAttribute(graph, "no", "bad input", "abc") } ).toThrow();
        expect(() => { GraphInterface.getEdgeAttribute(graph, "no", node2, "abc") } ).toThrow();
        expect(() => { GraphInterface.getEdgeAttribute(undefined, "no", node2, "abc") } ).toThrow();
        expect(() => { GraphInterface.getEdgeAttribute("graph", "no", node2, "abc") } ).toThrow();
    });
    
    /** 
     * Test the undo and redo methods. These are tested together
     * because you cannot redo without first calling undo, so it
     * makes more sense to test redo while you are testing undo.
     */
    test("Testing ChangeManager.undo and ChangeManager.redo", () => {
        
        // Make a simple graph
        graph = new Graph();
        changeManager = new ChangeManager();
    
        // Make nodes
        let node1, node2;
        [graph, changeManager, node1] = GraphInterface.addNode(graph, changeManager, 0, 0);
        [graph, changeManager, node2] = GraphInterface.addNode(graph, changeManager, 1, 1);

        // Add an attribute to node1
        [graph, changeManager] = GraphInterface.setNodeAttribute(graph, changeManager, node1, "color", "black");

        // Add an edge to the graph
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node1, node2);
        
        // Add an attribute to the edge
        [graph, changeManager] = GraphInterface.setEdgeAttribute(graph, changeManager, node1, node2, "color", "red");
        
        // Make sure that the edge has the attribute (which implies the
        // nodes and edges were created successfully as well);
        expect(GraphInterface.getEdgeAttribute(graph, node1, node2, "color")).toBe("red");

        // Call the Undo method. The Edge should still be there, but
        // it should have no attribute
        [graph, changeManager] = GraphInterface.undo(graph, changeManager);
        expect(GraphInterface.getEdgeAttribute(graph, node1, node2, "color")).toBeUndefined();

        // Call undo again, the edge should be removed
        [graph, changeManager] = GraphInterface.undo(graph, changeManager);
        
        // Make sure the edge is no longer there
        expect(GraphInterface.getEdge(graph, node1, node2)).toBeUndefined(); 

        // Undo the node's attribute. It should exist before the undo, but not after
        expect(GraphInterface.getNodeAttribute(graph, node1, "color")).toBe("black");
        [graph, changeManager] = GraphInterface.undo(graph, changeManager);
        expect(GraphInterface.getNodeAttribute(graph, node1, "color")).toBeUndefined();

        // Undo the last two nodes
        expect(graph.nodes.size).toBe(2); 
        [graph, changeManager] = GraphInterface.undo(graph, changeManager);
        expect(graph.nodes.size).toBe(1); 
        [graph, changeManager] = GraphInterface.undo(graph, changeManager);

        // The graph should have no nodes
        expect(graph.nodes.size).toBe(0);

        // Now that the graph is empty, calling undo() again should have no effect
        [graph, changeManager] = GraphInterface.undo(graph, changeManager);

        // Redo both nodes
        expect(graph.nodes.size).toBe(0);
        [graph, changeManager] = GraphInterface.redo(graph, changeManager);
        expect(graph.nodes.size).toBe(1);
        [graph, changeManager] = GraphInterface.redo(graph, changeManager);
        expect(graph.nodes.size).toBe(2);

        // Redo the attribute
        [graph, changeManager] = GraphInterface.redo(graph, changeManager);
        expect(GraphInterface.getNodeAttribute(graph, node1, "color")).toBe("black");
            
        // Redo the edge
        [graph, changeManager] = GraphInterface.redo(graph, changeManager);

        // The edge should be back, but with no attribute
        expect(GraphInterface.getEdge(graph, node1, node2)).toBeInstanceOf(Edge);
        expect(GraphInterface.getEdgeAttribute(graph, node1, node2, "color")).toBeUndefined();

        // Redo the attribute
        [graph, changeManager] = GraphInterface.redo(graph, changeManager);

        // Make sure that the edge has it's attribute back
        expect(GraphInterface.getEdgeAttribute(graph, node1, node2, "color")).toBe("red");

        // Calling redo now should have no effect, but should not throw any error
        [graph, changeManager] = GraphInterface.redo(graph, changeManager);

    });

    /** 
     * Test the startRecording and endRecording methods
     * @author Ziyu Wang
     */
    test("Testing ChangeManager.startRecording and ChangeManager.endRecording", () => {
        
        let graph = new Graph();
        let changeManager = new ChangeManager();
        
        // Start recording
        changeManager = GraphInterface.startRecording(changeManager);
        expect(changeManager.isRecording).toBe(true);
        
        // Make some changes
        let node1, node2;
        [graph, changeManager, node1] = GraphInterface.addNode(graph, changeManager, 0, 0);
        [graph, changeManager, node2] = GraphInterface.addNode(graph, changeManager, 1, 1);
        [graph, changeManager] =  GraphInterface.addEdge(graph, changeManager, node1, node2);
        
        // End the recording
        changeManager = GraphInterface.endRecording(changeManager);
        expect(changeManager.isRecording).toBe(false);

        // Undo should remove both nodes and the edge at once
        [graph, changeManager] = GraphInterface.undo(graph, changeManager);
        expect(GraphInterface.getNumberOfNodes(graph)).toBe(0);
        expect(GraphInterface.getNumberOfEdges(graph)).toBe(0);
    });

    /** 
     * Test the revert method
     * @author Ziyu Wang
     */
    test("Testing ChangeManager.revert", () => {
        
        graph = new Graph();
        changeManager = new ChangeManager();
        
        let node1, node2;
        [graph, changeManager, node1] = GraphInterface.addNode(graph, changeManager, 0, 0);
        [graph, changeManager, node2] = GraphInterface.addNode(graph, changeManager, 1, 1);
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node1, node2);

        [graph, changeManager] = GraphInterface.revert(graph, changeManager);
        expect(GraphInterface.getNumberOfNodes(graph)).toBe(0);
        expect(GraphInterface.getNumberOfEdges(graph)).toBe(0);
    });

    /** 
     * Test the getLength and getIndex methods
     * @author Ziyu Wang
     */
    test("Testing ChangeManager.getLength and ChangeManager.getIndex", () => {
        
        graph  = new Graph();
        changeManager = new ChangeManager();
        
        let node1, node2;
        [graph, changeManager, node1] = GraphInterface.addNode(graph, changeManager, 0, 0);
        [graph, changeManager, node2] = GraphInterface.addNode(graph, changeManager, 1, 1);
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node1, node2);

        expect(changeManager.changes.length).toBe(3);
        expect(changeManager.index).toBe(3);

        [graph, changeManager] = GraphInterface.undo(graph, changeManager);
        expect(changeManager.changes.length).toBe(3);
        expect(changeManager.index).toBe(2);
    });

     /** 
     * Test setNodePosition method
     */
     test("Testing GraphInterface.setNodePosition method", () => {
        
        [graph, changeManager] = GraphInterface.setNodePosition(graph, changeManager, node1, 10, 15);

        expect(GraphInterface.getNodePosition(graph,node1)).toEqual({ x: 10, y: 15 });
        expect(() => { GraphInterface.setNodePosition(graph, changeManager, "", 10, 15) } ).toThrow();

        let layGraph = new Graph("", "layered");
        changeManager = new ChangeManager();
        let node5;
        [layGraph, changeManager, node5] = GraphInterface.addNode(layGraph, changeManager, 0, 0);
        [layGraph, changeManager] = GraphInterface.setNodePosition(layGraph, changeManager, node5, 5, 10);
        expect(GraphInterface.getNodePosition(layGraph,node5)).toEqual({ x: 5, y: 0 });

    });

     /** 
     * Test setNodeSize method
     */
     test("Testing GraphInterface.setNodeSize method", () => {
        graph = GraphInterface.setNodeSize(graph, 10);
        expect((graph.nodeSize)).toEqual(10);
       

    });

    /** 
     * Test setShowEdgeLabels method
     */
    test("Testing GraphInterface.setShowEdgeLabels method", () => {
        graph = GraphInterface.setShowEdgeLabels(graph, true);
        expect((graph.showEdgeLabels)).toBe(true);
        graph = GraphInterface.setShowEdgeLabels(graph, false);
        expect((graph.showEdgeLabels)).toBe(false);

    });

     /** 
     * Test setShowEdgeWeights method
     */
     test("Testing GraphInterface.setShowEdgeWeights method", () => {
        graph = GraphInterface.setShowEdgeWeights(graph, true);
        expect((graph.showEdgeWeights)).toBe(true);
        graph = GraphInterface.setShowEdgeWeights(graph, false);
        expect((graph.showEdgeWeights)).toBe(false);
       

    });

     /** 
     * Test setShowNodeLabels method
     */
     test("Testing GraphInterface.setShowNodeLabels method", () => {
        graph = GraphInterface.setShowNodeLabels(graph, true);
        expect((graph.showNodeLabels)).toBe(true);
        graph = GraphInterface.setShowNodeLabels(graph, false);
        expect((graph.showNodeLabels)).toBe(false);
       

    });

     /** 
     * Test setShowNodeWeights method
     */
     test("Testing GraphInterface.setShowNodeWeights method", () => {
        graph = GraphInterface.setShowNodeWeights(graph, true);
        expect((graph.showNodeWeights)).toBe(true);
        graph = GraphInterface.setShowNodeWeights(graph, false);
        expect((graph.showNodeWeights)).toBe(false);
       

    });
    
     /** 
     * Test toString method
     */
     test("Testing GraphInterface.toString method", () => {
       const content = GraphInterface.toString(graph);
       const expected = "n 0 0 0 \nn 1 1 0 \nn 2 1 1 \nn 3 0 1 \ne 0 1 \ne 0 2 \ne 0 3 \ne 1 2 \ne 1 3 \ne 2 3 \n"
       expect((content)).toEqual(expected);
       

    });

    /** 
     * Test undo method
     */
    test("Testing GraphInterface.undo method", () => {
        [graph, changeManager] = GraphInterface.deleteNode(graph, changeManager, node4);
        expect(GraphInterface.getNumberOfNodes(graph)).toBe(3);
        [graph, changeManager] = GraphInterface.undo(graph, changeManager);
        expect(GraphInterface.getNumberOfNodes(graph)).toBe(4);
     });

      /** 
     * Test addEdge method
     */
    test("Testing GraphInterface.addEdge method", () => {
        let node5;
        [graph, changeManager, node5] = GraphInterface.addNode(graph, changeManager, 10, 10);
        [graph, changeManager ] = GraphInterface.addEdge(graph, changeManager, node1, node5);
        expect(GraphInterface.getNumberOfEdges(graph)).toEqual(7);
        expect(GraphInterface.getEdge(graph, node1, node5)).toBeDefined;
     });

     /** 
     * Test setNodeAttributeAll method
     */
    test("Testing GraphInterface.setNodeAttributeAll method", () => {
        [graph, changeManager ] = GraphInterface.setNodeAttributeAll(graph,changeManager, "weight", 10);
        expect(GraphInterface.getNodeAttribute(graph, node1, "weight")).toEqual(10);
        expect(GraphInterface.getNodeAttribute(graph, node2, "weight")).toEqual(10);
        expect(GraphInterface.getNodeAttribute(graph, node3, "weight")).toEqual(10);
        expect(GraphInterface.getNodeAttribute(graph, node4, "weight")).toEqual(10);
     });

      /** 
     * Test setEdgeAttributeAll method
     */
    test("Testing GraphInterface.setEdgeAttributeAll method", () => {
        [graph, changeManager ] = GraphInterface.setEdgeAttributeAll(graph, changeManager, "weight", 10);
        expect(GraphInterface.getEdgeAttribute(graph, node1, node2, "weight")).toEqual(10);
        expect(GraphInterface.getEdgeAttribute(graph, node1, node3, "weight")).toEqual(10);
        expect(GraphInterface.getEdgeAttribute(graph, node1, node4, "weight")).toEqual(10);
        expect(GraphInterface.getEdgeAttribute(graph, node2, node3, "weight")).toEqual(10);
        expect(GraphInterface.getEdgeAttribute(graph, node2, node4, "weight")).toEqual(10);
        expect(GraphInterface.getEdgeAttribute(graph, node3, node4, "weight")).toEqual(10);
     });

    
      /** 
     * Test getOutgoingNodes method
     */
    test("Testing GraphInterface.getOutgoingNodes method", () => {
        expect(GraphInterface.getOutgoingNodes(graph, node1)).toEqual([node2, node3, node4]);
     });

       /** 
     * Test getIncomingNodes method
     */
    test("Testing GraphInterface.getIncomingNodes method", () => {
        expect(GraphInterface.getIncomingNodes(graph, node1)).toEqual([node2, node3, node4]);
     });

       /** 
     * Test getEdgeIds method
     */
    test("Testing GraphInterface.getEdgeIds method", () => {
        graph  = new Graph();
        changeManager = new ChangeManager();
        
        let node1, node2;
        [graph, changeManager, node1] = GraphInterface.addNode(graph, changeManager, 0, 0);
        [graph, changeManager, node2] = GraphInterface.addNode(graph, changeManager, 1, 1);
        [graph, changeManager] = GraphInterface.addEdge(graph, changeManager, node1, node2);
        expect(GraphInterface.getEdgeIds(graph)).toEqual(["0,1"])
     });

       /** 
     * Test addMessage method
     */
    test("Testing GraphInterface.addMessage method", () => {
        changeManager = GraphInterface.addMessage(changeManager, "hello");
        expect(GraphInterface.getMessage(changeManager)).toEqual("hello");
     });



});
