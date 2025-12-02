import ChangeManager from "states/ChangeManager/ChangeManager";
import LayeredGraph from "states/Graph/LayeredGraph";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import LayeredGraphInterface from "interfaces/GraphInterface/LayeredGraphInterface";
import Edge from "states/Graph/GraphElement/Edge";
import Node from "states/Graph/GraphElement/Node";
import FileParser from "interfaces/FileParser/FileParser";
import TreeInterface from "interfaces/GraphInterface/TreeInterface";
import Tree from "states/Graph/Tree";


describe("Tree Tests", () => {
    let tree;
    let changeManager;
    let node1, node2, node3, node4, node5;
    let right1, right2;
    let edge1, edge2, edge3;
    beforeEach(() => {
        // Reset any necessary state before each test
        tree = new Tree();
        tree = GraphInterface.setDirected(tree, true);
        changeManager = new ChangeManager();
        [tree, changeManager, node1] = GraphInterface.addNode(tree, changeManager, "1", 0, 0, {weight: 1});
        [tree, changeManager, node2] = GraphInterface.addNode(tree, changeManager, "2", 0, 0, {weight: 2});
        [tree, changeManager, node3] = GraphInterface.addNode(tree, changeManager, "3", 0, 0, {weight: 3});
        [tree, changeManager, node4] = GraphInterface.addNode(tree, changeManager, "4", 0, 0, {weight: 4});
        [tree, changeManager] = GraphInterface.addEdge(tree, changeManager, node2, node1);
        [tree, changeManager] = GraphInterface.addEdge(tree, changeManager, node2, node3);
        [tree, changeManager] = GraphInterface.addEdge(tree, changeManager, node3, node4);
    });

    /**
     * Checks that getParent finds the parent of a node correctly
     * 
     * Issue: Nodes should only have one parent in a tree, should return single value instead of array
     * Fix: change "parent.push(edge.source);" to "return edge.source;" and remove array structure
     */
    test("Checks the getParents function", () => {
        expect(TreeInterface.getParent(tree, node2)).toEqual(undefined);
        expect(TreeInterface.getParent(tree, node4)).toEqual(node3);
        expect(TreeInterface.getParent(tree, node3)).toEqual(node2);
        expect(TreeInterface.getParent(tree, node1)).toEqual(node2);

        expect(() => {TreeInterface.getParent(tree, "5")}).toThrow(Error);
    });

    /**
     * Checks that getChildren finds the children of a node correctly.
     * Expects order to be preserved in children, either by ID or weight.
     */
    test("Checks the getChildren function", () => {
        expect(TreeInterface.getChildren(tree, node2)).toEqual([node1, node3]);
        expect(TreeInterface.getChildren(tree, node3)).toEqual([node4]);
        expect(TreeInterface.getChildren(tree, node4)).toEqual([]);
        expect(TreeInterface.getChildren(tree, node1)).toEqual([]);

        expect(() => TreeInterface.getChildren(tree, "1000")).toThrow(Error);
    });

    /**
     * Checks that getRoots finds all root nodes in the tree
     * 
     * Current issue: Typo inside if-statement conditional on line 66
     * Fix: change "getParent(graph, nodeId === undefined)"" to "getParent(graph, nodeId) === undefined"
     */
    test("Checks the getRoots function", () => {
        expect(TreeInterface.getRoots(tree)).toEqual([node2]);

        [tree, changeManager, node5] = GraphInterface.addNode(tree, changeManager, "5", 0, 0);
        expect(TreeInterface.getRoots(tree)).toEqual([node2, node5]);
    });

    /**
     * Checks that getRoot finds the root node of the tree
     * 
     * Current issue: Typo inside if-statement conditional on line 66
     * Fix: change "getParent(graph, nodeId === undefined)"" to "getParent(graph, nodeId) === undefined"
     */
    test("Checks the getRoot function", () => {
        expect(TreeInterface.getRoot(tree)).toEqual(node2);
    });

    /**
     * Checks that isLeaf correctly identifies leaf nodes of a tree
     * 
     * Current issue: getChildren(graph, graph.noded.get(nodeId)) [currently line 145] contains a typo
     * Fix: change "graph.noded.get(nodeId)" to "graph.nodes.get(nodeId)"
     */
    test("Checks the isLeaf function", () => {
        expect(TreeInterface.isLeaf(tree, node1)).toBe(true);
        expect(TreeInterface.isLeaf(tree, node4)).toBe(true);
        expect(TreeInterface.isLeaf(tree, node2)).toBe(false);
        expect(TreeInterface.isLeaf(tree, node3)).toBe(false);
        node5 = "5";
        expect(()=> {TreeInterface.isLeaf(tree, node5)}).toThrowError("Cannot check node 5 because no node with this id exists in the graph");
    });

    /**
     * Checks that we can get a left child of a node correctly
     * 
     * Current issue: getLeft assumes only-child nodes are left children
     * Fix: Either ensure a dummy node exists, or make a check dependent on parent
     */
    test("Checks the getLeft function", () => {
        let nodeSingle = "10";
        [tree, changeManager, nodeSingle] = GraphInterface.addNode(tree, changeManager, nodeSingle, 0, 0, {weight: 10});

        expect(TreeInterface.getLeft(tree, node2)).toBe(node1);
        expect(TreeInterface.getLeft(tree, nodeSingle)).toBe(undefined);
        expect(TreeInterface.getLeft(tree, node1)).toBe(undefined);
        expect(TreeInterface.getLeft(tree, node4)).toBe(undefined);
        node5 = "5";
        expect(() => {TreeInterface.getLeft(tree, node5)}).toThrowError("Cannot get left child of node 5 because no node with this id exists in the graph");
    });

    /**
     * Checks that we can get a right child of a node correctly
     * 
     * Current issue: getRight assumes only-child nodes are right children
     * Fix: Either ensure a dummy node exists, or make a check dependent on parent
     */
    test("Checks the getRight function", () => {
        [tree, changeManager, right1] = GraphInterface.addNode(tree, changeManager, "10", 0, 0, {weight: 10});
        [tree, changeManager, right2] = GraphInterface.addNode(tree, changeManager, "20", 0, 0, {weight: 20});
        [tree, changeManager] = GraphInterface.addEdge(tree, changeManager, node3, right2);

        let nodeSingle = "10";
        [tree, changeManager, nodeSingle] = GraphInterface.addNode(tree, changeManager, nodeSingle, 0, 0, {weight: 10});

        expect(TreeInterface.getRight(tree, node2)).toBe(node3);
        expect(TreeInterface.getRight(tree, node3)).toBe(right2);
        expect(TreeInterface.getRight(tree, nodeSingle)).toBe(undefined);
        expect(TreeInterface.getRight(tree, node4)).toBe(undefined);
        let node10 = "10";
        expect(() => {TreeInterface.getRight(tree, node10)}).toThrowError("Cannot get right child of node 10 because no node with this id exists in the graph");
    });

});