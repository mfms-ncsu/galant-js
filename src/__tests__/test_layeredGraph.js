/**
 * @author Heath Dyer
 * @author Ethan Haske
 * Tests for Layered Graph functions related to crossings
 */

import Graph from "states/Graph/Graph";
import ChangeManager from "states/ChangeManager/ChangeManager";
import LayeredGraph from "states/Graph/LayeredGraph";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import LayeredGraphInterface from "interfaces/GraphInterface/LayeredGraphInterface";
import Edge from "states/Graph/GraphElement/Edge";
import Node from "states/Graph/GraphElement/Node";
import FileParser from "interfaces/FileParser/FileParser";

describe("LayeredGraph", () => {
    let graph, standardGraph, changeManager;
    let A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U , V, W, X, Y ,Z, AA, BB, CC, DD, EE, FF, GG, HH, II, JJ;

    // Load in graph
    beforeEach(() => {
        // this graph can be found in __tests__/test_files/layered-graph.sgf
        graph = FileParser.loadGraph("example 20", "c created by dot+ord2sgf, date/time = Sat Dec 19 21:09:50 UTC 2020\nc $Id: dot+ord2sgf 66 2014-03-29 16:58:11Z mfms $\nc ./minimization -h vertical_bary -i 10 -w _ ../testing/TestData/ex_20.sgf\nt ex_20 20 36 4\nn 0 0 1\nn 1 0 0\nn 2 0 2\nn 3 0 3\nn 4 0 4\nn 5 1 1\nn 6 1 0\nn 7 1 4\nn 8 1 3\nn 9 1 2\nn 10 2 1\nn 11 2 4\nn 12 2 2\nn 13 2 0\nn 14 2 3\nn 15 3 1\nn 16 3 3\nn 17 3 0\nn 18 3 2\nn 19 3 4\ne 0 5 label:A\ne 1 5 label:B\ne 3 5 label:C\ne 0 6 label:D\ne 1 6 label:E\ne 0 7 label:F\ne 3 7 label:G\ne 4 7 label:H\ne 2 8 label:I\ne 3 8 label:J\ne 4 8 label:K\ne 0 9 label:L\ne 6 10 label:M\ne 8 10 label:N\ne 7 11 label:O\ne 8 11 label:P\ne 5 12 label:Q\ne 9 12 label:R\ne 5 13 label:S\ne 5 14 label:T\ne 8 14 label:U\ne 9 14 label:V\ne 11 15 label:W\ne 12 15 label:X\ne 13 15 label:Y\ne 14 15 label:Z\ne 10 16 label:AA\ne 11 16 label:BB\ne 14 16 label:CC\ne 13 17 label:DD\ne 10 18 label:EE\ne 11 18 label:FF\ne 12 18 label:GG\ne 14 18 label:HH\ne 11 19 label:II\ne 12 19 label:JJ");
        standardGraph = FileParser.loadGraph("example 20", "c created by dot+ord2sgf, date/time = Sat Dec 19 21:09:50 UTC 2020\nc $Id: dot+ord2sgf 66 2014-03-29 16:58:11Z mfms $\nc ./minimization -h vertical_bary -i 10 -w _ ../testing/TestData/ex_20.txt\nn 0 0 1\nn 1 0 0\nn 2 0 2\nn 3 0 3\nn 4 0 4\nn 5 1 1\nn 6 1 0\nn 7 1 4\nn 8 1 3\nn 9 1 2\nn 10 2 1\nn 11 2 4\nn 12 2 2\nn 13 2 0\nn 14 2 3\nn 15 3 1\nn 16 3 3\nn 17 3 0\nn 18 3 2\nn 19 3 4\ne 0 5 label:A\ne 1 5 label:B\ne 3 5 label:C\ne 0 6 label:D\ne 1 6 label:E\ne 0 7 label:F\ne 3 7 label:G\ne 4 7 label:H\ne 2 8 label:I\ne 3 8 label:J\ne 4 8 label:K\ne 0 9 label:L\ne 6 10 label:M\ne 8 10 label:N\ne 7 11 label:O\ne 8 11 label:P\ne 5 12 label:Q\ne 9 12 label:R\ne 5 13 label:S\ne 5 14 label:T\ne 8 14 label:U\ne 9 14 label:V\ne 11 15 label:W\ne 12 15 label:X\ne 13 15 label:Y\ne 14 15 label:Z\ne 10 16 label:AA\ne 11 16 label:BB\ne 14 16 label:CC\ne 13 17 label:DD\ne 10 18 label:EE\ne 11 18 label:FF\ne 12 18 label:GG\ne 14 18 label:HH\ne 11 19 label:II\ne 12 19 label:JJ");
        //update this later
        changeManager = new ChangeManager();
        // get edges for easy reference
        A = GraphInterface.getEdge(graph, "0", "5");
        B = GraphInterface.getEdge(graph, "1", "5");
        C = GraphInterface.getEdge(graph, "3", "5");
        D = GraphInterface.getEdge(graph, "0", "6");
        E = GraphInterface.getEdge(graph, "1", "6");
        F = GraphInterface.getEdge(graph, "0", "7");
        G = GraphInterface.getEdge(graph, "3", "7");
        H = GraphInterface.getEdge(graph, "4", "7");
        I = GraphInterface.getEdge(graph, "2", "8");
        J = GraphInterface.getEdge(graph, "3", "8");
        K = GraphInterface.getEdge(graph, "4", "8");
        L = GraphInterface.getEdge(graph, "0", "9");
        M = GraphInterface.getEdge(graph, "6", "10");
        N = GraphInterface.getEdge(graph, "8", "10");
        O = GraphInterface.getEdge(graph, "7", "11");
        P = GraphInterface.getEdge(graph, "8", "11");
        Q = GraphInterface.getEdge(graph, "5", "12");
        R = GraphInterface.getEdge(graph, "9", "12");
        S = GraphInterface.getEdge(graph, "5", "13");
        T = GraphInterface.getEdge(graph, "5", "14");
        U = GraphInterface.getEdge(graph, "8", "14");
        V = GraphInterface.getEdge(graph, "9", "14");
        W = GraphInterface.getEdge(graph, "11", "15");
        X = GraphInterface.getEdge(graph, "12", "15");
        Y = GraphInterface.getEdge(graph, "13", "15");
        Z = GraphInterface.getEdge(graph, "14", "15");
        AA = GraphInterface.getEdge(graph, "10", "16");
        BB = GraphInterface.getEdge(graph, "11", "16");
        CC = GraphInterface.getEdge(graph, "14", "16");
        DD = GraphInterface.getEdge(graph, "13", "17");
        EE = GraphInterface.getEdge(graph, "10", "18");
        FF = GraphInterface.getEdge(graph, "11", "18");
        GG = GraphInterface.getEdge(graph, "12", "18");
        HH = GraphInterface.getEdge(graph, "14", "18");
        II = GraphInterface.getEdge(graph, "11", "19");
        JJ = GraphInterface.getEdge(graph, "12", "19");
    });

    test("Can detect if two edges are crossing", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(() => { LayeredGraphInterface.isCrossed(standardGraph, B, D) }).toThrow(Error);
        // Testing some valid edge crossings
        expect(LayeredGraphInterface.isCrossed(graph, B, D)).toBe(true);
        expect(LayeredGraphInterface.isCrossed(graph, C, L)).toBe(true);
        expect(LayeredGraphInterface.isCrossed(graph, C, F)).toBe(true);
        expect(LayeredGraphInterface.isCrossed(graph, K, G)).toBe(true);
        expect(LayeredGraphInterface.isCrossed(graph, M, S)).toBe(true);
        // Testing invaid edge crossings
        expect(LayeredGraphInterface.isCrossed(graph, A, B)).toBe(false);
        expect(LayeredGraphInterface.isCrossed(graph, B, C)).toBe(false);
        expect(LayeredGraphInterface.isCrossed(graph, L, K)).toBe(false);
        expect(LayeredGraphInterface.isCrossed(graph, S, A)).toBe(false);
        expect(LayeredGraphInterface.isCrossed(graph, M, F)).toBe(false);
    });

    test("Can get edge crossings for single edge", () => {
        // Graph loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(() => { LayeredGraphInterface.crossings(standardGraph, A) }).toThrow(Error);
        expect(LayeredGraphInterface.crossings(graph, A)).toBe(0);
        expect(LayeredGraphInterface.crossings(graph, B)).toBe(1);
        expect(LayeredGraphInterface.crossings(graph, C)).toBe(3);
        expect(LayeredGraphInterface.crossings(graph, D)).toBe(1);
        expect(LayeredGraphInterface.crossings(graph, E)).toBe(0);
        expect(LayeredGraphInterface.crossings(graph, F)).toBe(4);
        expect(LayeredGraphInterface.crossings(graph, G)).toBe(1);
        expect(LayeredGraphInterface.crossings(graph, H)).toBe(0);
        expect(LayeredGraphInterface.crossings(graph, I)).toBe(2);
        expect(LayeredGraphInterface.crossings(graph, J)).toBe(1);
        expect(LayeredGraphInterface.crossings(graph, K)).toBe(2);
        expect(LayeredGraphInterface.crossings(graph, L)).toBe(1);
        expect(LayeredGraphInterface.crossings(graph, M)).toBe(1);
        expect(LayeredGraphInterface.crossings(graph, N)).toBe(4);
        expect(LayeredGraphInterface.crossings(graph, O)).toBe(0);
        expect(LayeredGraphInterface.crossings(graph, P)).toBe(0);
        expect(LayeredGraphInterface.crossings(graph, Q)).toBe(1);
        expect(LayeredGraphInterface.crossings(graph, R)).toBe(2);
        expect(LayeredGraphInterface.crossings(graph, S)).toBe(1);
        expect(LayeredGraphInterface.crossings(graph, T)).toBe(2);
        expect(LayeredGraphInterface.crossings(graph, U)).toBe(0);
        expect(LayeredGraphInterface.crossings(graph, V)).toBe(1);
        expect(LayeredGraphInterface.crossings(graph, W)).toBe(6);
        expect(LayeredGraphInterface.crossings(graph, X)).toBe(2);
        expect(LayeredGraphInterface.crossings(graph, Y)).toBe(0);
        expect(LayeredGraphInterface.crossings(graph, Z)).toBe(4);
        expect(LayeredGraphInterface.crossings(graph, AA)).toBe(6);
        expect(LayeredGraphInterface.crossings(graph, BB)).toBe(1);
        expect(LayeredGraphInterface.crossings(graph, CC)).toBe(3);
        expect(LayeredGraphInterface.crossings(graph, DD)).toBe(0);
        expect(LayeredGraphInterface.crossings(graph, EE)).toBe(3);
        expect(LayeredGraphInterface.crossings(graph, FF)).toBe(3);
        expect(LayeredGraphInterface.crossings(graph, GG)).toBe(3);
        expect(LayeredGraphInterface.crossings(graph, HH)).toBe(3);
        expect(LayeredGraphInterface.crossings(graph, II)).toBe(0);
        expect(LayeredGraphInterface.crossings(graph, JJ)).toBe(6);
    });

    test("Can get total crossings in whole LayeredGraphInterface", () => {
        // LayeredGraphInterface is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(() => { LayeredGraphInterface.totalCrossings(standardGraph) }).toThrow(Error);
        expect(LayeredGraphInterface.totalCrossings(graph)).toBe(34);
    });

    test("Can calculate bottleneck crossings", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(() => { LayeredGraphInterface.bottleneckCrossings(standardGraph) }).toThrow(Error);
        expect(LayeredGraphInterface.bottleneckCrossings(graph)).toBe(6);
    });

    test("Gets non-verticallity for single edge", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(() => { LayeredGraphInterface.nonVerticality(standardGraph, A) }).toThrow(Error);
        expect(LayeredGraphInterface.nonVerticality(graph, A)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, B)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, C)).toBe(4);
        expect(LayeredGraphInterface.nonVerticality(graph, D)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, E)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, F)).toBe(9);
        expect(LayeredGraphInterface.nonVerticality(graph, G)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, H)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, I)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, J)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, K)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, L)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, M)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, N)).toBe(4);
        expect(LayeredGraphInterface.nonVerticality(graph, O)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, P)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, Q)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, R)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, S)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, T)).toBe(4);
        expect(LayeredGraphInterface.nonVerticality(graph, U)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, V)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, W)).toBe(9);
        expect(LayeredGraphInterface.nonVerticality(graph, X)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, Y)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, Z)).toBe(4);
        expect(LayeredGraphInterface.nonVerticality(graph, AA)).toBe(4);
        expect(LayeredGraphInterface.nonVerticality(graph, BB)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, CC)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, DD)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, EE)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, FF)).toBe(4);
        expect(LayeredGraphInterface.nonVerticality(graph, GG)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, HH)).toBe(1);
        expect(LayeredGraphInterface.nonVerticality(graph, II)).toBe(0);
        expect(LayeredGraphInterface.nonVerticality(graph, JJ)).toBe(4);
    });

    test("Gets total non-verticallity for graph", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(() => { LayeredGraphInterface.totalNonVerticality(standardGraph) }).toThrow(Error);
        expect(LayeredGraphInterface.totalNonVerticality(graph)).toBe(62);
    });

    test("Gets bottlnon-verticallity for single edge", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(() => { LayeredGraphInterface.bottleneckVerticality(standardGraph) }).toThrow(Error);
        expect(LayeredGraphInterface.bottleneckVerticality(graph)).toBe(9);
    });

    test("Gets nodes on layer", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(() => { LayeredGraphInterface.nodesOnLayer(standardGraph, 0) }).toThrow(Error);

        //test layer 0
        const layer0 = LayeredGraphInterface.nodesOnLayer(graph, 0);
        expect(layer0.length).toBe(5);
        expect(layer0[0]).toBe(graph.nodes.get("1"));
        expect(layer0[1]).toBe(graph.nodes.get("0"));
        expect(layer0[2]).toBe(graph.nodes.get("2"));
        expect(layer0[3]).toBe(graph.nodes.get("3"));
        expect(layer0[4]).toBe(graph.nodes.get("4"));
        //test layer 1
        const layer1 = LayeredGraphInterface.nodesOnLayer(graph, 1);
        expect(layer1.length).toBe(5);
        expect(layer1[0]).toBe(graph.nodes.get("6"));
        expect(layer1[1]).toBe(graph.nodes.get("5"));
        expect(layer1[2]).toBe(graph.nodes.get("9"));
        expect(layer1[3]).toBe(graph.nodes.get("8"));
        expect(layer1[4]).toBe(graph.nodes.get("7"));
        //test layer 2
        const layer2 = LayeredGraphInterface.nodesOnLayer(graph, 2);
        expect(layer2.length).toBe(5);
        expect(layer2[0]).toBe(graph.nodes.get("13"));
        expect(layer2[1]).toBe(graph.nodes.get("10"));
        expect(layer2[2]).toBe(graph.nodes.get("12"));
        expect(layer2[3]).toBe(graph.nodes.get("14"));
        expect(layer2[4]).toBe(graph.nodes.get("11"));
        //test layer 3
        const layer3 = LayeredGraphInterface.nodesOnLayer(graph, 3);
        expect(layer3.length).toBe(5);
        expect(layer3[0]).toBe(graph.nodes.get("17"));
        expect(layer3[1]).toBe(graph.nodes.get("15"));
        expect(layer3[2]).toBe(graph.nodes.get("18"));
        expect(layer3[3]).toBe(graph.nodes.get("16"));
        expect(layer3[4]).toBe(graph.nodes.get("19"));
    });

    test("Swaps two nodes", () => {
        // Graph is loaded as layered graph
        expect(graph).toBeInstanceOf(LayeredGraph);
        // Test function doesnt work on standard graphs
        let newGraph;
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.swap(graph, changeManager, "2", "8") }).toThrow(Error);
        // try swap nodes on same layer
        let node0 = graph.nodes.get("0");
        let node1 = graph.nodes.get("1");
        expect(node0.index).toBe(1);
        expect(node0.position.x).toBe(1);
        expect(node1.index).toBe(0);
        expect(node1.position.x).toBe(0);

        [newGraph, changeManager] = LayeredGraphInterface.swap(graph, changeManager, "0", "1");
        node0 = newGraph.nodes.get("0");
        node1 = newGraph.nodes.get("1");
        expect(node0.index).toBe(0);
        expect(node0.position.x).toBe(0);
        expect(node1.index).toBe(1);
        expect(node1.position.x).toBe(1);
        // try swap nodes on different layer? behavior may change
        const node2 = newGraph.nodes.get("2");
        const node8 = newGraph.nodes.get("8");
        expect(() => { newGraph = LayeredGraphInterface.swap(graph, node2, node8) }).toThrow(Error);
    });

    test("set weights up by index", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        let newGraph;
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setWeightsUp(standardGraph, changeManager, 1, "index") }).toThrow(Error);
        // test by index
        [newGraph, changeManager] = LayeredGraphInterface.setWeightsUp(graph, changeManager, 1, "index");
        // test by position
        const node6 = newGraph.nodes.get("6");
        const node5 = newGraph.nodes.get("5");
        const node9 = newGraph.nodes.get("9");
        const node8 = newGraph.nodes.get("8");
        const node7 = newGraph.nodes.get("7");
        expect(node6.attributes.get("weight")).toBe(1 / 2);
        expect(node5.attributes.get("weight")).toBe(4 / 3);
        expect(node9.attributes.get("weight")).toBe(1);
        expect(node8.attributes.get("weight")).toBe(3);
        expect(node7.attributes.get("weight")).toBe(8 / 3);
        // test invalid type
        expect(() => { LayeredGraphInterface.setWeightsUp(graph, changeManager, 1, "invalid") }).toThrow(Error);
    });

    test("set weights up by position", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        let newGraph;
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setWeightsUp(standardGraph, changeManager, 1, "position") }).toThrow(Error);
        // test by position
        [newGraph, changeManager] = LayeredGraphInterface.setWeightsUp(graph, changeManager, 1, "position");
        const node6 = newGraph.nodes.get("6");
        const node5 = newGraph.nodes.get("5");
        const node9 = newGraph.nodes.get("9");
        const node8 = newGraph.nodes.get("8");
        const node7 = newGraph.nodes.get("7");
        expect(node6.attributes.get("weight")).toBe(1 / 2);
        expect(node5.attributes.get("weight")).toBe(4 / 3);
        expect(node9.attributes.get("weight")).toBe(1);
        expect(node8.attributes.get("weight")).toBe(3);
        expect(node7.attributes.get("weight")).toBe(8 / 3);
        // test invalid type
        expect(() => { LayeredGraphInterface.setWeightsUp(graph, changeManager, 1, "invalid") }).toThrow(Error);
    });

    test("set weights down by position", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        let newGraph;
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setWeightsDown(standardGraph, changeManager, 1, "position") }).toThrow(Error);
        // test by position
        [newGraph, changeManager] = LayeredGraphInterface.setWeightsDown(graph, changeManager, 1, "position");
        // test by position
        const node6 = newGraph.nodes.get("6");
        const node5 = newGraph.nodes.get("5");
        const node9 = newGraph.nodes.get("9");
        const node8 = newGraph.nodes.get("8");
        const node7 = newGraph.nodes.get("7");
        expect(node6.attributes.get("weight")).toBe(1);
        expect(node5.attributes.get("weight")).toBe(5 / 3);
        expect(node9.attributes.get("weight")).toBe(5 / 2);
        expect(node8.attributes.get("weight")).toBe(8 / 3);
        expect(node7.attributes.get("weight")).toBe(4);
        // test invalid type
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setWeightsDown(graph, changeManager, 1, "invalid") }).toThrow(Error);
    });

    test("set weights down by index", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        let newGraph;
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setWeightsDown(standardGraph, changeManager, 1, "index") }).toThrow(Error);
        // test by position
        [newGraph, changeManager] = LayeredGraphInterface.setWeightsDown(graph, changeManager, 1, "position");
        // test by position
        const node6 = newGraph.nodes.get("6");
        const node5 = newGraph.nodes.get("5");
        const node9 = newGraph.nodes.get("9");
        const node8 = newGraph.nodes.get("8");
        const node7 = newGraph.nodes.get("7");
        expect(node6.attributes.get("weight")).toBe(1);
        expect(node5.attributes.get("weight")).toBe(5 / 3);
        expect(node9.attributes.get("weight")).toBe(5 / 2);
        expect(node8.attributes.get("weight")).toBe(8 / 3);
        expect(node7.attributes.get("weight")).toBe(4);
        // test invalid type
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setWeightsDown(graph, changeManager, 1, "invalid") }).toThrow(Error);
    });

    test("set weights both by position", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        let newGraph;
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setWeightsBoth(standardGraph, changeManager, 1, "position") }).toThrow(Error);
        [newGraph, changeManager] = LayeredGraphInterface.setWeightsBoth(graph, changeManager, 1, "position");
        // test by position
        const node6 = newGraph.nodes.get("6");
        const node5 = newGraph.nodes.get("5");
        const node9 = newGraph.nodes.get("9");
        const node8 = newGraph.nodes.get("8");
        const node7 = newGraph.nodes.get("7");
        expect(node6.attributes.get("weight")).toBe(2 / 3);
        expect(node5.attributes.get("weight")).toBe(9 / 6);
        expect(node9.attributes.get("weight")).toBe(2);
        expect(node8.attributes.get("weight")).toBe(17 / 6);
        expect(node7.attributes.get("weight")).toBe(3);
        // test invalid type
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setWeightBoth(graph, changeManager, 1, "invalid") }).toThrow(Error);
    });

    test("set weights both by index", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        let newGraph;
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setWeightsBoth(standardGraph, changeManager, 1, "index") }).toThrow(Error);
        [newGraph, changeManager] = LayeredGraphInterface.setWeightsBoth(graph, changeManager, 1, "index");
        // test by position
        const node6 = newGraph.nodes.get("6");
        const node5 = newGraph.nodes.get("5");
        const node9 = newGraph.nodes.get("9");
        const node8 = newGraph.nodes.get("8");
        const node7 = newGraph.nodes.get("7");
        expect(node6.attributes.get("weight")).toBe(2 / 3);
        expect(node5.attributes.get("weight")).toBe(9 / 6);
        expect(node9.attributes.get("weight")).toBe(2);
        expect(node8.attributes.get("weight")).toBe(17 / 6);
        expect(node7.attributes.get("weight")).toBe(3);
        // test invalid type
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setWeightBoth(graph, changeManager, 1, "invalid") }).toThrow(Error);
    });

    test("Sorts by weight", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        let newGraph;
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.sortByWeight(standardGraph, changeManager, 1) }).toThrow(Error);
        //get nodes for reference
        const node6 = graph.nodes.get("6");
        const node5 = graph.nodes.get("5");
        const node9 = graph.nodes.get("9");
        const node8 = graph.nodes.get("8");
        const node7 = graph.nodes.get("7");
        // assign weights and sort
        [newGraph, changeManager] = LayeredGraphInterface.setWeightsUp(graph, changeManager, 1, "index");
        [newGraph, changeManager] = LayeredGraphInterface.sortByWeight(newGraph, changeManager, 1);
        // get nodes in order now and see if in right order
        const nodesUp = LayeredGraphInterface.nodesOnLayer(newGraph, 1);
        expect(nodesUp[0].id).toBe(node6.id);
        expect(nodesUp[1].id).toBe(node9.id);
        expect(nodesUp[2].id).toBe(node5.id);
        expect(nodesUp[3].id).toBe(node7.id);
        expect(nodesUp[4].id).toBe(node8.id);
        // assign weights and sort
        [newGraph, changeManager] = LayeredGraphInterface.setWeightsDown(newGraph, changeManager, 1, "index");
        [newGraph, changeManager] = LayeredGraphInterface.sortByWeight(newGraph, changeManager, 1);
        // get nodes in order now and see if in right order
        const nodesDown = LayeredGraphInterface.nodesOnLayer(newGraph, 1);
        expect(nodesDown[0].id).toBe(node6.id);
        expect(nodesDown[1].id).toBe(node5.id);
        expect(nodesDown[2].id).toBe(node9.id);
        expect(nodesDown[3].id).toBe(node8.id);
        expect(nodesDown[4].id).toBe(node7.id);
        // assign weights and sort
        [newGraph, changeManager] = LayeredGraphInterface.setWeightsBoth(newGraph, changeManager, 1, "index");
        [newGraph, changeManager] = LayeredGraphInterface.sortByWeight(newGraph, changeManager, 1);
        // get nodes in order now and see if in right order
        const nodesBoth = LayeredGraphInterface.nodesOnLayer(newGraph, 1);
        expect(nodesBoth[0].id).toBe(node6.id);
        expect(nodesBoth[1].id).toBe(node5.id);
        expect(nodesBoth[2].id).toBe(node9.id);
        expect(nodesBoth[3].id).toBe(node8.id);
        expect(nodesBoth[4].id).toBe(node7.id);

    });

    test("Sets layer property", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        let newGraph;
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setLayerProperty(standardGraph, changeManager, 0, "weight", 2) }).toThrow(Error);
        [newGraph, changeManager] = LayeredGraphInterface.setLayerProperty(graph, changeManager, 0, "someAttribute", "someValue");
        const node0 = newGraph.nodes.get("0");
        const node1 = newGraph.nodes.get("1");
        const node2 = newGraph.nodes.get("2");
        const node3 = newGraph.nodes.get("3");
        const node4 = newGraph.nodes.get("4");
        const node5 = newGraph.nodes.get("5");
        const node6 = newGraph.nodes.get("5");
        const node7 = newGraph.nodes.get("7");
        const node8 = newGraph.nodes.get("8");
        const node9 = newGraph.nodes.get("9");
        const node10 = newGraph.nodes.get("10");

        //verify values are updated
        expect(node0.attributes.get("someAttribute")).toBe("someValue");
        expect(node1.attributes.get("someAttribute")).toBe("someValue");
        expect(node2.attributes.get("someAttribute")).toBe("someValue");
        expect(node3.attributes.get("someAttribute")).toBe("someValue");
        expect(node4.attributes.get("someAttribute")).toBe("someValue");
        // test some other nodes arent affected
        expect(node5.attributes.get("someAttribute")).toBeUndefined();
        expect(node6.attributes.get("someAttribute")).toBeUndefined();
        expect(node7.attributes.get("someAttribute")).toBeUndefined();
        expect(node8.attributes.get("someAttribute")).toBeUndefined();
        expect(node9.attributes.get("someAttribute")).toBeUndefined();
        expect(node10.attributes.get("someAttribute")).toBeUndefined();

    });

    test("Sets channel property", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        let newGraph;
        expect(() => { [newGraph, changeManager] = LayeredGraphInterface.setChannelProperty(standardGraph, 1, "weight", 2) }).toThrow(Error);
        [newGraph, changeManager] = LayeredGraphInterface.setChannelProperty(graph, changeManager, 0, "someAttribute", "someValue");

        A = GraphInterface.getEdge(newGraph, "0", "5");
        B = GraphInterface.getEdge(newGraph, "1", "5");
        C = GraphInterface.getEdge(newGraph, "3", "5");
        D = GraphInterface.getEdge(newGraph, "0", "6");
        E = GraphInterface.getEdge(newGraph, "1", "6");
        F = GraphInterface.getEdge(newGraph, "0", "7");
        G = GraphInterface.getEdge(newGraph, "3", "7");
        H = GraphInterface.getEdge(newGraph, "4", "7");
        I = GraphInterface.getEdge(newGraph, "2", "8");
        J = GraphInterface.getEdge(newGraph, "3", "8");
        K = GraphInterface.getEdge(newGraph, "4", "8");
        L = GraphInterface.getEdge(newGraph, "0", "9");
        M = GraphInterface.getEdge(newGraph, "6", "10");
        N = GraphInterface.getEdge(newGraph, "8", "10");
        O = GraphInterface.getEdge(newGraph, "7", "11");
        P = GraphInterface.getEdge(newGraph, "8", "11");
        Q = GraphInterface.getEdge(newGraph, "5", "12");
        R = GraphInterface.getEdge(newGraph, "9", "12");
        S = GraphInterface.getEdge(newGraph, "5", "13");
        T = GraphInterface.getEdge(newGraph, "5", "14");
        U = GraphInterface.getEdge(newGraph, "8", "14");
        V = GraphInterface.getEdge(newGraph, "9", "14");
        W = GraphInterface.getEdge(newGraph, "11", "15");
        X = GraphInterface.getEdge(newGraph, "12", "15");
        Y = GraphInterface.getEdge(newGraph, "13", "15");
        Z = GraphInterface.getEdge(newGraph, "14", "15");
        AA = GraphInterface.getEdge(newGraph, "10", "16");
        BB = GraphInterface.getEdge(newGraph, "11", "16");
        CC = GraphInterface.getEdge(newGraph, "14", "16");
        DD = GraphInterface.getEdge(newGraph, "13", "17");
        EE = GraphInterface.getEdge(newGraph, "10", "18");
        FF = GraphInterface.getEdge(newGraph, "11", "18");
        GG = GraphInterface.getEdge(newGraph, "12", "18");
        HH = GraphInterface.getEdge(newGraph, "14", "18");
        II = GraphInterface.getEdge(newGraph, "11", "19");
        JJ = GraphInterface.getEdge(newGraph, "12", "19");
        //test all edges in channel have attribute
        expect(A.attributes.get("someAttribute")).toBe("someValue");
        expect(B.attributes.get("someAttribute")).toBe("someValue");
        expect(C.attributes.get("someAttribute")).toBe("someValue");
        expect(D.attributes.get("someAttribute")).toBe("someValue");
        expect(E.attributes.get("someAttribute")).toBe("someValue");
        expect(F.attributes.get("someAttribute")).toBe("someValue");
        expect(G.attributes.get("someAttribute")).toBe("someValue");
        expect(H.attributes.get("someAttribute")).toBe("someValue");
        expect(I.attributes.get("someAttribute")).toBe("someValue");
        expect(J.attributes.get("someAttribute")).toBe("someValue");
        expect(K.attributes.get("someAttribute")).toBe("someValue");
        expect(L.attributes.get("someAttribute")).toBe("someValue");
        //TEST other edges not modified
        expect(M.attributes.get("someAttribute")).toBeUndefined();
        expect(N.attributes.get("someAttribute")).toBeUndefined();
        expect(O.attributes.get("someAttribute")).toBeUndefined();
        expect(P.attributes.get("someAttribute")).toBeUndefined();
        expect(Q.attributes.get("someAttribute")).toBeUndefined();
        expect(R.attributes.get("someAttribute")).toBeUndefined();
        expect(S.attributes.get("someAttribute")).toBeUndefined();
        expect(T.attributes.get("someAttribute")).toBeUndefined();
        expect(U.attributes.get("someAttribute")).toBeUndefined();
        expect(V.attributes.get("someAttribute")).toBeUndefined();
        expect(W.attributes.get("someAttribute")).toBeUndefined();
        expect(X.attributes.get("someAttribute")).toBeUndefined();
        expect(Y.attributes.get("someAttribute")).toBeUndefined();
        expect(Z.attributes.get("someAttribute")).toBeUndefined();
        expect(AA.attributes.get("someAttribute")).toBeUndefined();
        expect(BB.attributes.get("someAttribute")).toBeUndefined();
        expect(CC.attributes.get("someAttribute")).toBeUndefined();
        expect(DD.attributes.get("someAttribute")).toBeUndefined();
        expect(EE.attributes.get("someAttribute")).toBeUndefined();
        expect(FF.attributes.get("someAttribute")).toBeUndefined();
        expect(GG.attributes.get("someAttribute")).toBeUndefined();
        expect(HH.attributes.get("someAttribute")).toBeUndefined();
        expect(II.attributes.get("someAttribute")).toBeUndefined();
        expect(JJ.attributes.get("someAttribute")).toBeUndefined();
        
    });

    test("Gets number of Layers", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(LayeredGraphInterface.numberOfLayers(graph)).toEqual(4);
        
    });

    test("test evenly spaced layout", () => {
        let regGraph = new Graph("", "");
        let regChangeManager = new ChangeManager();
        expect(() => { LayeredGraphInterface.evenlySpacedLayout(regGraph, regChangeManager) } ).toThrow();
        graph = FileParser.loadGraph("example 20", "c created by dot+ord2sgf, date/time = Sat Dec 19 21:09:50 UTC 2020\nc $Id: dot+ord2sgf 66 2014-03-29 16:58:11Z mfms $\nc ./minimization -h vertical_bary -i 10 -w _ ../testing/TestData/ex_20.sgf\nt ex_20 20 36 4\nn 0 0 1\nn 1 0 0\nn 2 0 2\nn 3 0 3\nn 4 0 4\nn 20 0 5\nn 21 0 6\nn 22 0 7\nn 23 0 8\nn 5 1 1\nn 6 1 0\nn 7 1 4\nn 8 1 3\nn 9 1 2\nn 10 2 1\nn 11 2 4\nn 12 2 2\nn 13 2 0\nn 14 2 3\nn 15 3 1\nn 16 3 3\nn 17 3 0\nn 18 3 2\nn 19 3 4\ne 0 5 label:A\ne 1 5 label:B\ne 3 5 label:C\ne 0 6 label:D\ne 1 6 label:E\ne 0 7 label:F\ne 3 7 label:G\ne 4 7 label:H\ne 2 8 label:I\ne 3 8 label:J\ne 4 8 label:K\ne 0 9 label:L\ne 6 10 label:M\ne 8 10 label:N\ne 7 11 label:O\ne 8 11 label:P\ne 5 12 label:Q\ne 9 12 label:R\ne 5 13 label:S\ne 5 14 label:T\ne 8 14 label:U\ne 9 14 label:V\ne 11 15 label:W\ne 12 15 label:X\ne 13 15 label:Y\ne 14 15 label:Z\ne 10 16 label:AA\ne 11 16 label:BB\ne 14 16 label:CC\ne 13 17 label:DD\ne 10 18 label:EE\ne 11 18 label:FF\ne 12 18 label:GG\ne 14 18 label:HH\ne 11 19 label:II\ne 12 19 label:JJ");

         // Graph is loaded in
         expect(graph).toBeInstanceOf(LayeredGraph);
         [graph, changeManager] = LayeredGraphInterface.evenlySpacedLayout(graph, changeManager);
         let nodes = LayeredGraphInterface.nodesOnLayer(graph, 0);
         expect(nodes[0].position.x).toEqual(0);
         expect(nodes[1].position.x).toEqual(1);
         expect(nodes[2].position.x).toEqual(2);
         expect(nodes[3].position.x).toEqual(3);
         expect(nodes[4].position.x).toEqual(4);
         expect(nodes[5].position.x).toEqual(5);
         expect(nodes[6].position.x).toEqual(6);
         expect(nodes[7].position.x).toEqual(7);
         expect(nodes[8].position.x).toEqual(8);
         nodes = LayeredGraphInterface.nodesOnLayer(graph, 1);
         expect(nodes[0].position.x).toEqual(0);
         expect(nodes[1].position.x).toEqual(2);
         expect(nodes[2].position.x).toEqual(4);
         expect(nodes[3].position.x).toEqual(6);
         expect(nodes[4].position.x).toEqual(8);



    });

    test("test show positions", () => {
        graph = FileParser.loadGraph("example 20", "c created by dot+ord2sgf, date/time = Sat Dec 19 21:09:50 UTC 2020\nc $Id: dot+ord2sgf 66 2014-03-29 16:58:11Z mfms $\nc ./minimization -h vertical_bary -i 10 -w _ ../testing/TestData/ex_20.sgf\nt ex_20 20 36 4\nn 0 0 1\nn 1 0 0\nn 2 0 2\nn 3 0 3\nn 4 0 8\nn 5 1 1\nn 6 1 0\nn 7 1 4\nn 8 1 3\nn 9 1 2\nn 10 2 1\nn 11 2 4\nn 12 2 2\nn 13 2 0\nn 14 2 3\nn 15 3 1\nn 16 3 3\nn 17 3 0\nn 18 3 2\nn 19 3 4\ne 0 5 label:A\ne 1 5 label:B\ne 3 5 label:C\ne 0 6 label:D\ne 1 6 label:E\ne 0 7 label:F\ne 3 7 label:G\ne 4 7 label:H\ne 2 8 label:I\ne 3 8 label:J\ne 4 8 label:K\ne 0 9 label:L\ne 6 10 label:M\ne 8 10 label:N\ne 7 11 label:O\ne 8 11 label:P\ne 5 12 label:Q\ne 9 12 label:R\ne 5 13 label:S\ne 5 14 label:T\ne 8 14 label:U\ne 9 14 label:V\ne 11 15 label:W\ne 12 15 label:X\ne 13 15 label:Y\ne 14 15 label:Z\ne 10 16 label:AA\ne 11 16 label:BB\ne 14 16 label:CC\ne 13 17 label:DD\ne 10 18 label:EE\ne 11 18 label:FF\ne 12 18 label:GG\ne 14 18 label:HH\ne 11 19 label:II\ne 12 19 label:JJ");
        [graph, changeManager] = LayeredGraphInterface.showPositions(graph, changeManager, 0);
        let nodes = GraphInterface.getNodeIds(graph);
        expect(GraphInterface.getNodeAttribute(graph, nodes[0], "weight")).toEqual(1);
        expect(GraphInterface.getNodeAttribute(graph, nodes[1], "weight")).toEqual(0);
        expect(GraphInterface.getNodeAttribute(graph, nodes[2], "weight")).toEqual(2);
        expect(GraphInterface.getNodeAttribute(graph, nodes[3], "weight")).toEqual(3);
        expect(GraphInterface.getNodeAttribute(graph, nodes[4], "weight")).toEqual(8);

    });

    test("test show indexes", () => {
        graph = FileParser.loadGraph("example 20", "c created by dot+ord2sgf, date/time = Sat Dec 19 21:09:50 UTC 2020\nc $Id: dot+ord2sgf 66 2014-03-29 16:58:11Z mfms $\nc ./minimization -h vertical_bary -i 10 -w _ ../testing/TestData/ex_20.sgf\nt ex_20 20 36 4\nn 0 0 1\nn 1 0 0\nn 2 0 2\nn 3 0 3\nn 4 0 8\nn 5 1 1\nn 6 1 0\nn 7 1 4\nn 8 1 3\nn 9 1 2\nn 10 2 1\nn 11 2 4\nn 12 2 2\nn 13 2 0\nn 14 2 3\nn 15 3 1\nn 16 3 3\nn 17 3 0\nn 18 3 2\nn 19 3 4\ne 0 5 label:A\ne 1 5 label:B\ne 3 5 label:C\ne 0 6 label:D\ne 1 6 label:E\ne 0 7 label:F\ne 3 7 label:G\ne 4 7 label:H\ne 2 8 label:I\ne 3 8 label:J\ne 4 8 label:K\ne 0 9 label:L\ne 6 10 label:M\ne 8 10 label:N\ne 7 11 label:O\ne 8 11 label:P\ne 5 12 label:Q\ne 9 12 label:R\ne 5 13 label:S\ne 5 14 label:T\ne 8 14 label:U\ne 9 14 label:V\ne 11 15 label:W\ne 12 15 label:X\ne 13 15 label:Y\ne 14 15 label:Z\ne 10 16 label:AA\ne 11 16 label:BB\ne 14 16 label:CC\ne 13 17 label:DD\ne 10 18 label:EE\ne 11 18 label:FF\ne 12 18 label:GG\ne 14 18 label:HH\ne 11 19 label:II\ne 12 19 label:JJ");
        [graph, changeManager] = LayeredGraphInterface.showIndexes(graph, changeManager, 0);
        let nodes = GraphInterface.getNodeIds(graph);
        expect(GraphInterface.getNodeAttribute(graph, nodes[0], "weight")).toEqual(1);
        expect(GraphInterface.getNodeAttribute(graph, nodes[1], "weight")).toEqual(0);
        expect(GraphInterface.getNodeAttribute(graph, nodes[2], "weight")).toEqual(2);
        expect(GraphInterface.getNodeAttribute(graph, nodes[3], "weight")).toEqual(3);
        expect(GraphInterface.getNodeAttribute(graph, nodes[4], "weight")).toEqual(4);

    });

    test("test copy and apply node position", () => {
        let position = LayeredGraphInterface.copyNodePositions(graph);
        expect(position[0].id).toEqual("0");
        expect(position[0].position.x).toEqual(1);
        expect(position[0].index).toEqual(1);
        expect(position[0].layer).toEqual(0);
        
        expect(position[6].id).toEqual("6");
        expect(position[6].position.x).toEqual(0);
        expect(position[6].index).toEqual(0);
        expect(position[6].layer).toEqual(1);
        
        expect(position[12].id).toEqual("12");
        expect(position[12].position.x).toEqual(2);
        expect(position[12].index).toEqual(2);
        expect(position[12].layer).toEqual(2);

        expect(position[16].id).toEqual("16");
        expect(position[16].position.x).toEqual(3);
        expect(position[16].index).toEqual(3);
        expect(position[16].layer).toEqual(3);

        position[0].position.x = 10;
        [graph, changeManager] = LayeredGraphInterface.applyNodePositions(graph, changeManager, position);
        expect(GraphInterface.getNodePosition(graph, "0").x).toEqual(10);



    });

});