let edges = getEdges();
print(edges);

edges.forEach(edge => {
    highlight(edge);
    let node = target(edge)
    if ( ! marked(node) ) {
        mark(node);
    } else {
        unmark(node);
    }
})
