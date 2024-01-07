let nodes = getNodes(); 
print(nodes);
nodes.forEach(node => colorNode("#47C4AA",node));
let edges = getEdges();
print(edges);
edges.forEach(edge => colorEdge("#47C4AA",edge));
