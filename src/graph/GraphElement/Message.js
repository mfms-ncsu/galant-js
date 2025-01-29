import GraphElement from "./GraphElement";

/**
 * Message is a GraphElement containing a string to display for the user.
 * 
 * @author Henry Morris
 */
export default class Message extends GraphElement {
    /**
     * Creates a new Message with a message and a map of attributes.
     * @param {String} message Message to store
     */
    constructor(message) {
        super(new Map());

        this.message = message;
    }
}