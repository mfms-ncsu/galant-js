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
    
    constructor(graph, privateMethods) {
        // Import the graph object with private methods
        this.#graph = graph;
        for (let method in privateMethods) {
            this.#graph[method] = privateMethods[method];
        }

        // Default styling preferences
        this.preferences = {
            node: {
                backgroundColor: "#FFFFFF",
                size: {x: 25, y: 25},
                color: "#000000",
                borderColor: "#AAAAAA",
                borderWidth: 2,
                backgroundOpacity: 1,
                shape: "circle",
                hideWeight: false,
                hideLabel: false
            },
            edge: {
                lineColor: "#444444",
                width: 3,
                color: "#AA0000",
                hideWeight: false,
                hideLabel: false
            },
        }

        // Allows for mappings between a element's data attribute to a style attribute.
        this.dataMappings = [
            {selector: 'node', data: 'color', styles:['backgroundColor']},
            {selector: 'node', data: 'id', styles:['label']},
            {selector: 'node', data: 'shape', styles:['shape']},
            {selector: 'node', data: 'borderColor', styles:['borderColor']},
            {selector: 'node', data: 'borderWidth', styles:['borderWidth']},
            {selector: 'node', data: 'backgroundOpacity', styles:['backgroundOpacity']},
            {selector: 'node', data: 'size', styles:['width', 'height']},
            {selector: 'edge', data: 'width', styles:['width']},
            {selector: 'edge', data: 'color', styles:['lineColor', 'targetArrowColor']}
        ];
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

        return element;
    }

    /**
     * Generates a cytoscape stylesheet for the graph.
     * @author Julian Madrigal
     * @returns Cytoscape stylesheet
     */
    getStyle() {
        const style = [
            {
                selector: "node",
                style: {
                    width: this.preferences.node.size.x + "px",
                    height: this.preferences.node.size.y + "px",
                    backgroundColor: this.preferences.node.backgroundColor,
                    color: this.preferences.node.color,
                    textOpacity: this.preferences.node.textOpacity,
                    borderWidth: (this.preferences.node.size.x / 10) + "px",
                    borderStyle: "solid",
                    borderColor: this.preferences.node.borderColor,
                    backgroundOpacity: this.preferences.node.backgroundOpacity,
                    shape: this.preferences.node.shape,
                    textValign: "center",
                    visibility: "visible",
                    fontSize: (this.preferences.node.size.x / 2) + "px"
                }
            },
            {
                selector: "edge",
                style: {
                    label: "data(id)",
                    width: 3,
                    lineColor: this.preferences.edge.lineColor,
                    color: this.preferences.edge.color,
                    textOpacity: this.preferences.edge.textOpacity,
                    targetArrowColor: this.preferences.edge.lineColor,
                    targetArrowShape: "none",
                    curveStyle: "bezier"
                }
            },
            {
                selector: "node[?marked]",
                style: {
                    backgroundColor: "orange",
                }
            },
            {
                selector: "node[?highlighted]",
                style: {
                    borderWidth: (this.preferences.node.size.x / 5) + "px",
                }
            },
            {
                selector: "node[?invisible]",
                style: {
                    visibility: "hidden",
                }
            },
            {
                selector: "edge[?invisible]",
                style: {
                    visibility: "hidden",
                }
            },
            {
                selector: "edge[?highlighted]",
                style: {
                    width: "10px",
                }
            },
            {
                selector: "edge[label]",
                style: {
                    label: "data(label)",
                    textWrap: "wrap",
                    textBackgroundColor: "white",
                    textBackgroundOpacity: "1.0",
                    textBackgroundPadding: "2px",
                    textBorderOpacity: "1.0",
                    textBorderStyle: "solid",
                    textBorderWidth: "1px",
                    textBorderColor: "black",
                }
            },
            {
                selector: "edge.directed",
                style: {
                    targetArrowShape: "triangle",
                }
            },
        ];

        // Create CSS rules for element data attributes
        for (const mapping of this.dataMappings) {
            style.push(this.#createCSSRuleFromDataMapping(mapping))
        }

        return style;
    }

    /**
     * Create a CSS Rule to be added to stylesheet from a mapping.
     * @author Julian Madrigal
     * @param {DataMapping} mapping Data mapping
     * @returns CSS rule
     */
    #createCSSRuleFromDataMapping(mapping) {
        const rule = {
            selector: `${mapping.selector}[${mapping.data}]`,
            style: {}
        }
    
        for (const styleAttribute of mapping.styles) {
            rule.style[styleAttribute] = `data(${mapping.data})`;
        }
    
        return rule;
    }
}