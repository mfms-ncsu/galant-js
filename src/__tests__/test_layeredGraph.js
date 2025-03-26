/**
 * @author Heath Dyer
 * Tests for Layered Graph functions related to crossings
 */

import Graph from "states/Graph/Graph";
import LayeredGraph from "states/Graph/LayeredGraph";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import Edge from "states/Graph/GraphElement/Edge";
import Node from "states/Graph/GraphElement/Node";
import FileParser from "interfaces/FileParser/FileParser";

describe("LayeredGraph", () => {
    let graph;
    let A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U , V, W, X, Y ,Z, AA, BB, CC, DD, EE, FF, GG, HH, II, JJ;

    // Load in graph
    beforeEach(() => {
        // this graph can be found in __tests__/test_files/layered-graph.sgf
        graph = FileParser.loadGraph("example 20", "c created by dot+ord2sgf, date/time = Sat Dec 19 21:09:50 UTC 2020\nc $Id: dot+ord2sgf 66 2014-03-29 16:58:11Z mfms $\nc ./minimization -h vertical_bary -i 10 -w _ ../testing/TestData/ex_20.sgf\nt ex_20 20 36 4\nn 0 0 1\nn 1 0 0\nn 2 0 2\nn 3 0 3\nn 4 0 4\nn 5 1 1\nn 6 1 0\nn 7 1 4\nn 8 1 3\nn 9 1 2\nn 10 2 1\nn 11 2 4\nn 12 2 2\nn 13 2 0\nn 14 2 3\nn 15 3 1\nn 16 3 3\nn 17 3 0\nn 18 3 2\nn 19 3 4\ne 0 5 label:A\ne 1 5 label:B\ne 3 5 label:C\ne 0 6 label:D\ne 1 6 label:E\ne 0 7 label:F\ne 3 7 label:G\ne 4 7 label:H\ne 2 8 label:I\ne 3 8 label:J\ne 4 8 label:K\ne 0 9 label:L\ne 6 10 label:M\ne 8 10 label:N\ne 7 11 label:O\ne 8 11 label:P\ne 5 12 label:Q\ne 9 12 label:R\ne 5 13 label:S\ne 5 14 label:T\ne 8 14 label:U\ne 9 14 label:V\ne 11 15 label:W\ne 12 15 label:X\ne 13 15 label:Y\ne 14 15 label:Z\ne 10 16 label:AA\ne 11 16 label:BB\ne 14 16 label:CC\ne 13 17 label:DD\ne 10 18 label:EE\ne 11 18 label:FF\ne 12 18 label:GG\ne 14 18 label:HH\ne 11 19 label:II\ne 12 19 label:JJ");
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
        // Testing some valid edge crossings
        expect(graph.isEdgeCrossed(B, D)).toBe(true);
        expect(graph.isEdgeCrossed(C, L)).toBe(true);
        expect(graph.isEdgeCrossed(C, F)).toBe(true);
        expect(graph.isEdgeCrossed(K, G)).toBe(true);
        expect(graph.isEdgeCrossed(M, S)).toBe(true);
        // Testing invaid edge crossings
        expect(graph.isEdgeCrossed(A, B)).toBe(false);
        expect(graph.isEdgeCrossed(B, C)).toBe(false);
        expect(graph.isEdgeCrossed(L, K)).toBe(false);
        expect(graph.isEdgeCrossed(S, A)).toBe(false);
        expect(graph.isEdgeCrossed(M, F)).toBe(false);
    });

    test("Can get edge crossings for single edge", () => {
        // Graph loaded in
        expect(graph.getEdgeCrossings(A)).toBe(0);
        expect(graph.getEdgeCrossings(B)).toBe(1);
        expect(graph.getEdgeCrossings(C)).toBe(3);
        expect(graph.getEdgeCrossings(D)).toBe(1);
        expect(graph.getEdgeCrossings(E)).toBe(0);
        expect(graph.getEdgeCrossings(F)).toBe(4);
        expect(graph.getEdgeCrossings(G)).toBe(1);
        expect(graph.getEdgeCrossings(H)).toBe(0);
        expect(graph.getEdgeCrossings(I)).toBe(2);
        expect(graph.getEdgeCrossings(J)).toBe(1);
        expect(graph.getEdgeCrossings(K)).toBe(2);
        expect(graph.getEdgeCrossings(L)).toBe(1);
        expect(graph.getEdgeCrossings(M)).toBe(1);
        expect(graph.getEdgeCrossings(N)).toBe(4);
        expect(graph.getEdgeCrossings(O)).toBe(0);
        expect(graph.getEdgeCrossings(P)).toBe(0);
        expect(graph.getEdgeCrossings(Q)).toBe(1);
        expect(graph.getEdgeCrossings(R)).toBe(2);
        expect(graph.getEdgeCrossings(S)).toBe(1);
        expect(graph.getEdgeCrossings(T)).toBe(2);
        expect(graph.getEdgeCrossings(U)).toBe(0);
        expect(graph.getEdgeCrossings(V)).toBe(1);
        expect(graph.getEdgeCrossings(W)).toBe(6);
        expect(graph.getEdgeCrossings(X)).toBe(2);
        expect(graph.getEdgeCrossings(Y)).toBe(0);
        expect(graph.getEdgeCrossings(Z)).toBe(4);
        expect(graph.getEdgeCrossings(AA)).toBe(6);
        expect(graph.getEdgeCrossings(BB)).toBe(1);
        expect(graph.getEdgeCrossings(CC)).toBe(3);
        expect(graph.getEdgeCrossings(DD)).toBe(0);
        expect(graph.getEdgeCrossings(EE)).toBe(3);
        expect(graph.getEdgeCrossings(FF)).toBe(3);
        expect(graph.getEdgeCrossings(GG)).toBe(3);
        expect(graph.getEdgeCrossings(HH)).toBe(3);
        expect(graph.getEdgeCrossings(II)).toBe(0);
        expect(graph.getEdgeCrossings(JJ)).toBe(6);
    });

    test("Can get total crossings in whole graph", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(graph.getTotalCrossings()).toBe(34);
    });

    test("Can calculate bottleneck crossings", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(graph.getBottleneckCrossings()).toBe(6);
    });

    test("Gets non-verticallity for single edge", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(graph.getNonVerticality(A)).toBe(0);
        expect(graph.getNonVerticality(B)).toBe(1);
        expect(graph.getNonVerticality(C)).toBe(4);
        expect(graph.getNonVerticality(D)).toBe(1);
        expect(graph.getNonVerticality(E)).toBe(0);
        expect(graph.getNonVerticality(F)).toBe(9);
        expect(graph.getNonVerticality(G)).toBe(1);
        expect(graph.getNonVerticality(H)).toBe(0);
        expect(graph.getNonVerticality(I)).toBe(1);
        expect(graph.getNonVerticality(J)).toBe(0);
        expect(graph.getNonVerticality(K)).toBe(1);
        expect(graph.getNonVerticality(L)).toBe(1);
        expect(graph.getNonVerticality(M)).toBe(1);
        expect(graph.getNonVerticality(N)).toBe(4);
        expect(graph.getNonVerticality(O)).toBe(0);
        expect(graph.getNonVerticality(P)).toBe(1);
        expect(graph.getNonVerticality(Q)).toBe(1);
        expect(graph.getNonVerticality(R)).toBe(0);
        expect(graph.getNonVerticality(S)).toBe(1);
        expect(graph.getNonVerticality(T)).toBe(4);
        expect(graph.getNonVerticality(U)).toBe(0);
        expect(graph.getNonVerticality(V)).toBe(1);
        expect(graph.getNonVerticality(W)).toBe(9);
        expect(graph.getNonVerticality(X)).toBe(1);
        expect(graph.getNonVerticality(Y)).toBe(1);
        expect(graph.getNonVerticality(Z)).toBe(4);
        expect(graph.getNonVerticality(AA)).toBe(4);
        expect(graph.getNonVerticality(BB)).toBe(1);
        expect(graph.getNonVerticality(CC)).toBe(0);
        expect(graph.getNonVerticality(DD)).toBe(0);
        expect(graph.getNonVerticality(EE)).toBe(1);
        expect(graph.getNonVerticality(FF)).toBe(4);
        expect(graph.getNonVerticality(GG)).toBe(0);
        expect(graph.getNonVerticality(HH)).toBe(1);
        expect(graph.getNonVerticality(II)).toBe(0);
        expect(graph.getNonVerticality(JJ)).toBe(4);
    });

    test("Gets total non-verticallity for graph", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(graph.getTotalNonVerticality()).toBe(62);
    });

    test("Gets bottlnon-verticallity for single edge", () => {
        // Graph is loaded in
        expect(graph).toBeInstanceOf(LayeredGraph);
        expect(graph.getBottleneckNonVerticality()).toBe(9);
    });
    

});