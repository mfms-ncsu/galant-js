import GraphElement from "./GraphElement.js";

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
    constructor(nodeId, sequenceNumber, x, y, layer, index) {
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
            ["weight", undefined],
        ]));
        // Set the id and give the node a new sequence number
        this.id = nodeId
/**
 * Sequence numbers are used to determine the order of appearance of nodes
 * when they are displayed, particularly important for rooted trees
 * when elkjs mode is used.
 * They are modified when the left to right order of children of a node
 * needs to change during algorithm execution.
 * The current sequence number, as defined in GraphInterface.js,
 *  is the next one to be assigned; it is incremented each time one is assigned.
 * Each node has a sequence number in addtion to an id.
 * Sequence numbers are reassigned when the children of a node need to be reordered
 *   - see setChildren in TreeInterface.js
 */
        this.sequenceNumber = sequenceNumber

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