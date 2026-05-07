import GraphElement from "./GraphElement.js";

/**
 * @returns a unique sequence number for a node
 * Sequence numbers are used to determine the order of appearance of nodes
 * when they are displayed, particularly important for rooted trees
 * when elkjs mode is used.
 * They are modified when the left to right order of children of a node
 * needs to change during algorithm execution
 * @todo could alse be used to order adjacency lists
 */
function generateSequenceNumber() {
  currentSequenceNumber++
  return currentSequenceNumber
}

let currentSequenceNumber = 0;

/**
 * Node is a GraphElement with a unique id, an xy-position, and an
 * adjacency list of edges stored in a map.
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
     * @param {Number} layer Graph layer (layered only)
     * @param {Number} index Layer index (layered only)
     */
    constructor(nodeId, x, y, layer, index) {
        // Call the super constructor with the map of attributes
        super(new Map([
            ["backgroundOpacity", undefined],
            ["borderWidth", undefined],
            ["color", undefined],
            ["highlighted", false],
            ["label", ""],
            ["marked", false],
            ["shape", undefined],
            ["size", undefined],
            ["weight", undefined]
        ]));
        // Set the id and sequence number
        this.id = nodeId
        this.sequenceNumber = generateSequenceNumber()

        // Create an object containing the xy-position
        this.position = {
            x: x,
            y: y
        }

        // Set the index and layer
        this.layer = layer;
        this.index = index;

        // Create a map between adjacent nodes and their edge objects
        this.edges = new Map();
    }
}