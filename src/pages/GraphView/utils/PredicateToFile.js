/**
 * This function parses predicates into text allowing for the relaying of changes in the Graph View to the Graph Editor
 * If the file is sgf file, replace the x and y
 *
 * @param {Graph} graph - The graph that needs to be stringified and translated in to text
 *
 * @returns a dictionary object with keys called nodes, directed_edges, and edges
 *
 * @author Minghong Zou
 * @author Vitesh Kambara
 */
export function StringifyGraphSnapshot(graph) {
    let lines = [];

    let nodes = graph.getNodes();
    let edges = graph.getEdges();
    
    // Update node coordinates and properties
    for ( const [key, node] of Object.entries(nodes)){
        const x = graph.getNodeObject(node)['x'];
        const y = graph.getNodeObject(node)['y'];

        let nodeLine = `n ${node} ${x} ${y}`;
        // update if it is sgf file
        if (graph.getName() && graph.getName().endsWith('.sgf')){
            nodeLine = `n ${node} ${y} ${x}`;
        }

        if (graph.hasWeight(node)) {
            nodeLine += ' ' + graph.weight(node);
        }

        if (graph.hasColor(node)) {
            const color = graph.getColor(node);
            nodeLine += ' color:' + color;
        }

        if (graph.hasLabel(node)) {
            nodeLine += ' label:' + graph.getLabel(node);
        }

        lines.push(nodeLine);
    }

    // Serialize edges
    for (const [key,edge] of Object.entries(edges)) {
        const source = graph.source(edge);
        const target = graph.target(edge);

        let edgeLine = `e ${source} ${target}`;
        
        if (graph.hasWeight(edge)){
            edgeLine += ' ';
            edgeLine += graph.weight(edge);
        }
        
        if (graph.hasColor(edge)){
            edgeLine += ' color:' + graph.getColor(edge);
        }

        if (graph.hasLabel(edge)) {
            edgeLine += ' label:' + graph.getLabel(edge);
        }
        
        lines.push(edgeLine);
    }

    if (graph.directed){
        lines.push('directed');
    }

    return lines.join('\n');
}