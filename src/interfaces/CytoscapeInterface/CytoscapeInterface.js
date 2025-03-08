import GraphInterface from "../GraphInterface/GraphInterface"

/**
 * CytoscapeInterface returns the graph represented in cytoscape 
 * element format. Also generates a stylesheet for cytoscape.
 * 
 * @author Henry Morris
 * @author Krisjian Smith
 */

/**
 ***********
 * HELPERS *
 ***********
 */

/**
 * Returns true if the given attribute in the ege is not undefined, not 
 * an empty string, and is not hidden.
 */
function edgeHasAttribute(edge, attribute) {
    return edge.attributes.has(attribute) &&
           edge.attributes.get(attribute) !== "" &&
           edge.attributes.get(attribute) !== undefined &&
           !edge.attributes.get(attribute + "Hidden");
}

/**
 * Converts an Edge into a cytoscape element.
 * @param {Edge} edge Edge to parse
 * @returns Cytoscape edge element
 */
function parseEdge(graph, edge) {
    // Identifying data
    let element = {
        group: "edges",
        data: { source: edge.source, target: edge.target }
    }

    // Add attributes
    edge.attributes.forEach((value, name) => {
        element.data[name] = value;
    });

    // Add the edge label to display. Since we put both the label and weight 
    // in the same textbox, we need to put them together
    let text = "";
    let addedWeight = false;

    if (edgeHasAttribute(edge, "weight") && graph.showEdgeWeights) {
        addedWeight = true;
        text += edge.attributes.get("weight");
    }
    
    if (edgeHasAttribute(edge, "label") && graph.showEdgeLabels) {
        // If we added a weight, separate the label and weight with a newline
        if (addedWeight) {
            text += "\n";
        }

        text += edge.attributes.get("label");
    }

    element.data["textToDisplay"] = text;

    // If either the source or target nodes are hidden, then this edge should 
    // also be hidden
    if (GraphInterface.getNodeAttribute(graph, edge.source, "hidden") || GraphInterface.getNodeAttribute(graph, edge.target, "hidden")) {
        element.data["hidden"] = true;
    }

    return element;
}

/**
 * Converts a Node into a cytoscape element.
 * @param {Node} node Node to parse
 * @returns Cytoscape node element
 */
function parseNode(graph, node) {
    let scalar = graph.scalar;

    // Identifying data
    let element = {
        group: "nodes",
        data: { id: node.id },
        position: {
            x: scalar.x * node.position.x, // Scale the position
            y: scalar.y * node.position.y
        }
    };

    // Add attributes
    node.attributes.forEach((value, name) => {
        element.data[name] = value;
    });

    return element;
}



/**
 ***********
 * GETTERS *
 ***********
 */

/**
 * Generates an array of cytoscape elements from the current graph representation.
 * @returns Array of cytoscape elements to display
 */
function getElements(graph) {
    // Create an array of elements
    let elements = [];

    // Loop over each node
    GraphInterface.getNodes(graph).forEach(node => {
        elements.push(parseNode(graph, node));

        // Loop over each edge sourced at this node
        node.edges.forEach(edge => {
            if (node.id === edge.source) {
                elements.push(parseEdge(graph, edge));
            }
        });
    });

    return elements;
}

/**
 * Gets the cytoscape stylesheet for the graph.
 * @returns Cytoscape stylesheet
 */
function getStyle(graph) {
    return [
        {
            "selector": "node",
            "style": {
                "width": `${graph.nodeSize}px`,
                "height": `${graph.nodeSize}px`,
                "backgroundColor": "#FFFFFF",
                "color": "#000000",
                "borderWidth": `${graph.nodeSize / 10}px`,
                "borderStyle": "solid",
                "borderColor": "#AAAAAA",
                "backgroundOpacity": 1,
                "shape": "ellipse",
                "textValign": "center",
                "visibility": "visible",
                "fontSize": `${graph.nodeSize / 2}px`,
                "overlay-padding": `${graph.nodeSize / 5}px`
            }
        },
        {
            "selector": "edge",
            "style": {
                "label": "data(id)",
                "width": graph.nodeSize / 10,
                "lineColor": "#444444",
                "color": "#AA0000",
                "targetArrowColor": "#444444",
                "targetArrowShape": (graph.isDirected) ? "triangle" : "none",
                "curveStyle": "bezier",
                "overlay-padding": `${graph.nodeSize / 5}px`
            }
        },
        {
            "selector": "node[?marked]",
            "style": {
                "backgroundColor": "orange"
            }
        },
        {
            "selector": "node[?highlighted]",
            "style": {
                "borderWidth": `${graph.nodeSize / 5}px`
            }
        },
        {
            "selector": "node[?hidden]",
            "style": {
                "visibility": "hidden"
            }
        },
        {
            "selector": "edge[?hidden]",
            "style": {
                "visibility": "hidden"
            }
        },
        {
            "selector": "edge[?highlighted]",
            "style": {
                "width": `${graph.nodeSize / 2.5}px`
            }
        },
        {
            "selector": "edge[label]",
            "style": {
                "label": "data(textToDisplay)",
                "fontSize": `${graph.nodeSize / 2.5}px`,
                "textWrap": "wrap",
                "textBackgroundColor": "white",
                "textBackgroundOpacity": "1.0",
                "textBackgroundPadding": `${graph.nodeSize / 12.5}px`,
                "textBorderOpacity": "1.0",
                "textBorderStyle": "solid",
                "textBorderWidth": `${graph.nodeSize / 25}px`,
                "textBorderColor": "black"
            }
        },
        {
            "selector": "edge.directed",
            "style": {
                "targetArrowShape": "triangle"
            }
        },
        {
            "selector": "node[color]",
            "style": {
                "backgroundColor": "data(color)"
            }
        },
        {
            "selector": "node[id]",
            "style": {
                "label": "data(id)"
            }
        },
        {
            "selector": "node[shape]",
            "style": {
                "shape": "data(shape)"
            }
        },
        {
            "selector": "node[borderColor]",
            "style": {
                "borderColor": "data(borderColor)"
            }
        },
        {
            "selector": "node[borderWidth]",
            "style": {
                "borderWidth": "data(borderWidth)"
            }
        },
        {
            "selector": "node[backgroundOpacity]",
            "style": {
                "backgroundOpacity": "data(backgroundOpacity)"
            }
        },
        {
            "selector": "node[size]",
            "style": {
                "width": "data(size)",
                "height": "data(size)"
            }
        },
        {
            "selector": "edge[width]",
            "style": {
                "width": "data(width)"
            }
        },
        {
            "selector": "edge[color]",
            "style": {
                "lineColor": "data(color)",
                "targetArrowColor": "data(color)"
            }
        }
    ];
}

const CytoscapeInterface = {
    getElements,
    getStyle
}
export default CytoscapeInterface;