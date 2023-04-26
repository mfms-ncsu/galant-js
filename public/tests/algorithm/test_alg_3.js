let edges = getEdges();
print(edges);

edges.forEach(edge => {
    let node = target(edge)
    mark(node);
})