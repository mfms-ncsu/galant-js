import GraphElement from "./GraphElement.js";

/**
 * Edge is a GraphElement with a unique source-target pair of node
 * ids.
 * 
 * @author Henry Morris
 */
export default class Edge extends GraphElement {
    /**
     * Constructs a new Edge with a uniqe source-target pair and
     * initializes edge-specific attributes.
     * @param {String} source Source node id
     * @param {String} target Target node id
     */
    constructor(source, target) {
        // Call the super constructor with the map of attributes
        super(new Map([
            ["color", undefined],
            ["width", undefined],
            ["highlighted", false],
            ["label", ""],
            ["weight", undefined]
        ]));

        // Set source and target
        this.source = source;
        this.target = target;
    }
}