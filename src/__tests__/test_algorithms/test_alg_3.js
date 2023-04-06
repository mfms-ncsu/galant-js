let nodes = getNodes();
print(nodes);
let outNodes = outgoingNodes(nodes[0]);
print(outNodes);
outNodes.forEach(node => mark(node));
clearNodeMarks();
