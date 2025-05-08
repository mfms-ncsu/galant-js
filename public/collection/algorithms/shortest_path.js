/**
 * A variation of Dijstra's algorithm that has both a starting node and a destination node
 */
let edgesUsed = {};

step(() => {
    clearNodeMarks();
    clearNodeWeights();

    clearEdgeHighlights();
    clearEdgeColors();

    for (let edge of getEdges()) {
        if (!hasWeight(edge)) {
            setWeight(edge, 1);
        }
    }
})

let start_node = promptNode("Enter starting point:");
setWeight(start_node, 0);

let dest_node = promptNode("Enter destination:");

while (!marked(dest_node)) {
    let current_node = null;
    let current_dist = Infinity;
    for (let node of getNodes()) {
        if (hasWeight(node)) {
            let distance = weight(node);
            if (!marked(node) && distance < current_dist) {
                current_node = node;
                current_dist = distance;
            }
        }
    }

    print(current_node);
    step(() => {
        mark(current_node);
        if (edgesUsed[current_node]) {
            color(edgesUsed[current_node], "blue");
        }
    });

    for (let edge of outgoing(current_node)) {
        let next_node = other(current_node, edge);
        let next_dist = current_dist + weight(edge);
        print(next_node + " " + next_dist);
        if (!hasWeight(next_node) || next_dist < weight(next_node)) {
            step(() => {
                if (edgesUsed[next_node]) {
                    uncolor(edgesUsed[next_node]);
                    unhighlight(edgesUsed[next_node])
                }
                edgesUsed[next_node] = edge;
                color(edge, "red");
                highlight(edge);
                setWeight(next_node, next_dist);
            });
        }
    }
}
