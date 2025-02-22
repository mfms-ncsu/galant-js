/**
 * ChangeObject is a record of a change made to the graph. It contains a
 * description of the change made and two objects containing the previous
 * state and the current state after the change was made.
 * 
 * @author Henry Morris
 */
export default class ChangeObject {
    
    /**
     * Constructs a new ChangeObject with the requisite description
     * and objects containing the changes in the graph.
     * @param {String} action Description of the change
     * @param {Object} previous Previous state, if any
     * @param {Object} current Current state, if any
     */
    constructor(action, previous, current) {
        this.action = action;
        this.previous = previous;
        this.current = current;
    }
}
