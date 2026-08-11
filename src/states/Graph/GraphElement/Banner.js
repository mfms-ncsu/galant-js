import GraphElement from "./GraphElement";

/**
 * Message is a GraphElement containing a string to display for the user.
 * There will be a single instance of this element.
 * That message can be used throughout algorithm execution to narrate the algorithm,
 * Attributes can be used to control
 * - font, color and background of text for visual display
 * - voice characteristics for spoken messages
 * 
 * @author Henry Morris
 * @author Matthias Stallmann
 */
export default class Message extends GraphElement {
    /**
     * Creates a new Message with a message and a map of attributes.
     * @param {String} spoken whether or not speech synthesis should be used for messages
     */
    constructor(spoken) {
        super(new Map());
        this.spoken = spoken;
        this.text = null;
    }
}