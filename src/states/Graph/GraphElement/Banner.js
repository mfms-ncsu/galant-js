/**
 * Banner is a GraphElement used for displaying or speaking text during algorithm execution.
 * There will be only a single instance, a field in the Graph class.
 * 
 * @author Henry Morris
 */
export default class Banner extends GraphElement {
    /**
     * Creates a new Banner with no text and a map of attributes.
     * Text will be provided using the display() function in Thread.js
     * Other attributes, not currently used, can control, e.g., text characteristics
     */
    constructor() {
        super(new Map());
        this.text = null;
    }
}