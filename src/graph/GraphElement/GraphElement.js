/**
 * GraphElement is a parent class for Node, Edge, and Message. It stores
 * the attributes for the element in a map where values can be retireved
 * by string attribute names as the key.
 * 
 * @author Henry Morris
 */
export default class GraphElement {
    /**
     * Constructs a new GraphElement with the given map of attributes
     * @param {Map} attributes Map of attributes
     */
    constructor(attributes) {
        this.attributes = attributes;
    }

    getAttribute(name) {}
    setAttribute(name, value) {}
}