import Graph from "utils/Graph";
import EdgeObject from "pages/GraphView/utils/EdgeObject";
import NodeObject from "pages/GraphView/utils/NodeObject";

describe("Graph", () => {
    let graph, nodes, edges;

    beforeEach(() => {
        nodes = [
            new NodeObject({ id: "A", x: 0, y: 0 }),
            new NodeObject({ id: "B", x: 0, y: 0 }),
            new NodeObject({ id: "C", x: 0, y: 0 })
        ];
        edges = [
            new EdgeObject({ id: "A B", source: "A", target: "B" }),
            new EdgeObject({ id: "B C", source: "B", target: "C" })
        ];

        graph = new Graph(nodes, edges, true, "Graph message", "test-graph", 1);
    });

    test("creates a new Graph instance", () => {
        expect(graph).toBeInstanceOf(Graph);
    });

    test("retrieves nodes", () => {
        expect(graph.getNodes()).toEqual(["A", "B", "C"]);
    });

    test("retrieves edges", () => {
        expect(graph.getEdges()).toEqual(edges);
    });

    test("retrieves number of nodes", () => {
        expect(graph.getNumberOfNodes()).toBe(3);
    });

    test("retrieves number of edges", () => {
        expect(graph.getNumberOfEdges()).toBe(2);
    });

    test("retrieves edge IDs", () => {
        expect(graph.getEdgeIds()).toEqual(["A B", "B C"]);
    });

    test("retrieves specific node", () => {
        expect(graph.getNodeObject("A")).toBeInstanceOf(NodeObject);
    });


    test("throws error if edge ID does not exist", () => {
        expect(() => graph.getEdgeObject("X Y")).toThrow("X Y is not a valid edge.");
    });


    test("retrieves specific edge", () => {
        expect(graph.getEdgeObject("A B")).toBeInstanceOf(EdgeObject);
    });

    test("throws error if edge ID does not exist", () => {
        expect(() => graph.getEdgeObject("X Y")).toThrowError("X Y is not a valid edge.");
    });

    test("retrieves graph object", () => {
        expect(graph.getGraphObject("A")).toBeInstanceOf(NodeObject);
        expect(graph.getGraphObject("A B")).toBeInstanceOf(EdgeObject);
    });

    test("creates unique edge ID", () => {
        expect(graph.createEdgeId("A", "B")).toBe("A B");
    });

    test("retrieves incident edges", () => {
        expect(graph.incident("A")).toEqual(["A B"]);
    });

    test("retrieves incoming edges", () => {
        expect(graph.incoming("B")).toEqual(["A B"]);
    });

    test("retrieves outgoing edges", () => {
        expect(graph.outgoing("A")).toEqual(["A B"]);
    });

    test("retrieves adjacent nodes", () => {
        expect(graph.adjacentNodes("A")).toEqual(["B"]);
    });

    test("marks and unmarks nodes", () => {
        graph.mark("A");
        expect(graph.marked("A")).toBe(true);
        graph.unmark("A");
        expect(graph.marked("A")).toBe(false);
    });

    test("clears node marks", () => {
        graph.mark("A");
        graph.clearNodeMarks();
        expect(graph.marked("A")).toBe(false);
    });

    test("highlights and unhighlights nodes", () => {
        graph.highlight("A");
        expect(graph.highlighted("A")).toBe(true);
        graph.unhighlight("A");
        expect(graph.highlighted("A")).toBe(false);
    });

    test("highlights and unhighlights edges", () => {
        graph.highlight("A B");
        expect(graph.highlighted("A B")).toBe(true);
        graph.unhighlight("A B");
        expect(graph.highlighted("A B")).toBe(false);
    });

    test("clears node highlights", () => {
        graph.highlight("A");
        graph.clearNodeHighlights();
        expect(graph.highlighted("A")).toBe(false);
    });

    test("clears edge highlights", () => {
        graph.highlight("A B");
        graph.clearEdgeHighlights();
        expect(graph.highlighted("A B")).toBe(false);
    });

    test("colors and uncolors nodes", () => {
        graph.color("A", "red");
        expect(graph.getColor("A")).toBe("red");
        graph.uncolor("A");
        expect(graph.hasColor("A")).toBe(false);
    });

    test("clears node colors", () => {
        graph.color("A", "red");
        graph.clearNodeColors();
        expect(graph.getNodeObject("A").color).toBeUndefined();
    });


    test("labels and unlabels nodes", () => {
        graph.label("A", "Label A");
        expect(graph.getLabel("A")).toBe("Label A");
        graph.unlabel("A");
        expect(graph.hasLabel("A")).toBe(false);
    });

    test("clears node labels", () => {
        graph.label("A", "Label A");
        graph.clearNodeLabels();
        expect(graph.hasLabel("A")).toBe(false);
    });

    test("sets and clears shape", () => {
        graph.setShape("A", "circle");
        expect(graph.shape("A")).toBe("circle");
        graph.clearShape("A");
        expect(graph.hasShape("A")).toBe(false);
    });

    test("sets and clears border width", () => {
        graph.setBorderWidth("A", 3);
        expect(graph.borderWidth("A")).toBe(3);
        graph.clearBorderWidth("A");
        expect(graph.hasBorderWidth("A")).toBe(false);
    });

    test("sets and clears background opacity", () => {
        graph.setBackgroundOpacity("A", 0.5);
        expect(graph.backgroundOpacity("A")).toBe(0.5);
        graph.clearBackgroundOpacity("A");
        expect(graph.hasBackgroundOpacity("A")).toBe(false);
    });

    test("sets and clears size", () => {
        graph.setSize("A", 10);
        expect(graph.size("A")).toBe(10);
        graph.clearSize("A");
        expect(graph.getNodeObject("A").size).toBeUndefined();
    });


    test("sets and clears weight for node", () => {
        graph.setWeight("A", 5);
        expect(graph.weight("A")).toBe(5);
        graph.clearWeight("A");
        expect(graph.hasWeight("A")).toBe(false);
    });

    test("increments node position", () => {
        graph.incrementPosition("A", { x: 10, y: 10 });
        expect(graph.getNodeObject("A").x).toBe(10);
        expect(graph.getNodeObject("A").y).toBe(10);
    });


    test("sets node position", () => {
        graph.setPosition("A", { x: 15, y: 20 });
        expect(graph.getNodeObject("A").x).toBe(15);
        expect(graph.getNodeObject("A").y).toBe(20);
    });


    test("sets and retrieves graph name", () => {
        graph.setName("new-graph");
        expect(graph.getName()).toBe("new-graph");
    });

    test("hides and shows nodes", () => {
        graph.hideNode("A");
        expect(graph.getNodeObject("A").invisible).toBe(true);
        graph.showNode("A");
        expect(graph.getNodeObject("A").invisible).toBe(false);
    });


    test("hides and shows edge weights", () => {
        graph.hideEdgeWeight("A B");
        expect(graph.getEdgeObject("A B").invisibleWeight).toBe(true);
        graph.showEdgeWeight("A B");
        expect(graph.getEdgeObject("A B").invisibleWeight).toBe(false);
    });

    test("hides and shows edge labels", () => {
        graph.hideEdgeLabel("A B");
        expect(graph.getEdgeObject("A B").invisibleLabel).toBe(false);
        graph.showEdgeLabel("A B");
        expect(graph.getEdgeObject("A B").invisibleLabel).toBe(false);
    });

    test("hides and shows all edge labels", () => {
        graph.hideAllEdgeLabels();
        graph.getEdges().forEach((edge) => {
            expect(edge.invisibleLabel).toBe(true);
        });
        graph.showAllEdgeLabels();
        graph.getEdges().forEach((edge) => {
            expect(edge.invisibleLabel).toBe(false);
        });
    });

    test("displays a message", () => {
        graph.display("New Message");
        expect(graph.message).toBe("New Message");
    });
});
