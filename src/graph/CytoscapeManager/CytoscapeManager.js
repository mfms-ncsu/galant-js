/**
 * CytoscapeManager is an interface for its graph which returns the graph
 * represented in cytoscape element format. Also generates a stylesheet for
 * cytoscape.
 * 
 * @author Henry Morris
 */
export default class CytoscapeManager {
    /** Graph for which to create cytoscape elements */
    #graph
    
    /**
     * Constructs a CytoscapeManager with its associated Graph object. Takes 
     * in the public graph object as well as its private methods, which are
     * necessary for directly modifying the graph representation.
     * @param {Graph} graph Graph for which to create cytoscape elements
     * @param {Object} privateMethods Object containing the graph's private methods
     */
    constructor(graph, privateMethods) {
        // Import the graph object with private methods
        this.#graph = graph;
        for (let method in privateMethods) {
            this.#graph[method] = privateMethods[method];
        }

        // Use a variable for node size scaling
        this.nodeSize = 25;

        // Flags for showing labels and weights
        this.nodeLabels = true;
        this.nodeWeights = true;
        this.edgeLabels = true;
        this.edgeWeights = true;
    }

    /**
     * Generates an array of cytoscape elements from the current graph representation.
     * @returns Array of cytoscape elements to display
     */
    getElements() {
        // Create an array of elements
        let elements = [];

        // Loop over each node
        this.#graph.getNodes().forEach(node => {
            elements.push(this.#parseNode(node));

            // Loop over each edge sourced at this node
            node.edges.forEach(edge => {
                if (node.id === edge.source) {
                    elements.push(this.#parseEdge(edge));
                }
            });
        });

        return elements;
    }
    
    /**
     * Converts a Node into a cytoscape element.
     * @param {Node} node Node to parse
     * @returns Cytoscape node element
     */
    #parseNode(node) {
        let scalar = this.#graph.getScalar();

        // Identifying data
        let element = {
            group: "nodes",
            data: { id: node.id },
            position: {
                x: scalar * node.position.x, // Scale the position
                y: scalar * node.position.y
            }
        };

        // Add attributes
        node.attributes.forEach((value, name) => {
            element.data[name] = value;
        });

        return element;
    }
    
    /**
     * Returns true if the given attribute in the ege
     * is not undefined, not an empty string, and is not hidden.
     */
    #edgeHasAttribute(edge, attribute) {
        
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
    #parseEdge(edge) {
        // Identifying data
        let element = {
            group: "edges",
            data: { source: edge.source, target: edge.target }
        }

        // Add attributes
        edge.attributes.forEach((value, name) => {
            element.data[name] = value;
        });

        // Add the edge label to display. Since we put both the
        // label and weight in the same textbox, we need to
        // put them together
        
        let text = "";
        let addedWeight = false;

        if (this.#edgeHasAttribute(edge, "weight") &&
            this.edgeWeights) {
            
            addedWeight = true;
            text += edge.attributes.get("weight");
        }
        
        if (this.#edgeHasAttribute(edge, "label") &&
            this.edgeLabels) {

            // If we added a weight, separate the label and
            // weight with a newline
            if (addedWeight) {
                text += "\n";
            }

            text += edge.attributes.get("label");
        }

        element.data["textToDisplay"] = text;

        // If either the source or target nodes are hidden, then this
        // edge should also be hidden
        if (this.#graph.getNodeAttribute(edge.source, "hidden") ||
            this.#graph.getNodeAttribute(edge.target, "hidden")) {
            
            element.data["hidden"] = true;
        }

        return element;
    }

    /**
     * Gets the cytoscape stylesheet for the graph.
     * @returns Cytoscape stylesheet
     */
    getStyle() {
        return [
            {
                "selector": "node",
                "style": {
                    "width": `${this.nodeSize}px`,
                    "height": `${this.nodeSize}px`,
                    "backgroundColor": "#FFFFFF",
                    "color": "#000000",
                    "borderWidth": `${this.nodeSize / 10}px`,
                    "borderStyle": "solid",
                    "borderColor": "#AAAAAA",
                    "backgroundOpacity": 1,
                    "shape": "ellipse",
                    "textValign": "center",
                    "visibility": "visible",
                    "fontSize": `${this.nodeSize / 2}px`,
                    "overlay-padding": `${this.nodeSize / 5}px`
                }
            },
            {
                "selector": "edge",
                "style": {
                    "label": "data(id)",
                    "width": this.nodeSize / 10,
                    "lineColor": "#444444",
                    "color": "#AA0000",
                    "targetArrowColor": "#444444",
                    "targetArrowShape": (this.#graph.isDirected) ? "triangle" : "none",
                    "curveStyle": "bezier",
                    "overlay-padding": `${this.nodeSize / 5}px`
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
                    "borderWidth": `${this.nodeSize / 5}px`
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
                    "width": `${this.nodeSize / 2.5}px`
                }
            },
            {
                "selector": "edge[label]",
                "style": {
                    "label": "data(textToDisplay)",
                    "fontSize": `${this.nodeSize / 2.5}px`,
                    "textWrap": "wrap",
                    "textBackgroundColor": "white",
                    "textBackgroundOpacity": "1.0",
                    "textBackgroundPadding": `${this.nodeSize / 12.5}px`,
                    "textBorderOpacity": "1.0",
                    "textBorderStyle": "solid",
                    "textBorderWidth": `${this.nodeSize / 25}px`,
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
}
