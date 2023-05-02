// time at which each node is discovered
let discoveryTimes = {};
// time at which each node has finished being explored
let finishTimes = {};
// Number of steps taken
let time = 0;

print("dfs");
step(() => {
    clearNodeMarks();
    clearNodeHighlights();
    clearNodeLabels();
    clearEdgeHighlights();
    clearEdgeColors();
    clearEdgeLabels();

    
    let start = promptNode("Enter start node:");
    visit(start);
});

function visit(node) {
    display("Visiting " + node);
    step(() => {
        discoveryTimes[node] = time++;
    
        mark(node);
        label(node, discoveryTimes[node]);
    });

    print(outgoing(node));
	for (let edge of outgoing(node)) {
        print(edge);
		let nextNode = other(node, edge);

        if (hasLabel(edge)) {
            continue;
        }

        step(() => {
            if (!marked(nextNode)) { // not yet visited
                highlight(edge);
                label(edge, "Tree");
                color(edge, "blue");

                highlight(nextNode);
                visit(nextNode);
            } else if (finishTimes[nextNode] == null ) { // ancestor
                label(edge, "Back");
                color(edge, "red");
            } else if (finishTimes[nextNode] > discoveryTimes[node]) { // descendant
                label(edge, "Forward");
                color(edge, "green");
            } else {
                label(edge, "Cross");
                color(edge, "orange");
            }
        });
    }

    finishTimes[node] = time;
    label(node, discoveryTimes[node] + "/" + finishTimes[node]);
}