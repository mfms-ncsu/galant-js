import GraphElement from "./GraphElement.js";

/**
 * Node is a GraphElement with a unique id, an xy-position, and an
 * adjacency list of edges.
 * 
 * @author Henry Morris
 */
export default class Node extends GraphElement {
    /**
     * Constructs a new Node with a unique id and an xy-position.
     * Initializes node-specific attributes.
     * @param {String} nodeId Unique string id
     * @param {Number} x X-position
     * @param {Number} y Y-position
     */
    constructor(nodeId, x, y) {
        // Call the super constructor with the map of attributes
        super(new Map([
            ["backgroundOpacity", undefined],
            ["borderWidth", undefined],
            ["color", undefined],
            ["highlight", false],
            ["label", undefined],
            ["mark", false],
            ["shape", undefined],
            ["size", undefined],
            ["weight", undefined]
        ]));

        // Set the id
        this.id = nodeId;

        // Create an object containing the xy-position
        this.position = {
            x: x,
            y: y
        }

        // Create a list of adjacent edges
        this.edges = [];
    }
}