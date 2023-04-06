let edges = getEdges();
console.log(edges);
print(edges);

edges.forEach(edge => {
    let node = target(edge)
    mark(node);
})


// let nodes = getNodes();
// print(nodes);
// let outNodes = adjacentNodes("3");
// console.log(outNodes);
// print(outNodes);
// outNodes.forEach(node => mark(node));
// clearNodeMarks();
