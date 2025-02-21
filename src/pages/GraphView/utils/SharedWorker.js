/**
 * @file SharedWorker.js
 * This file centralizes all the code for SharedWorker on the GraphView end.
 * Other components can utilize these functions to communicate with SharedWorker
 * @author Julian Madrigal
 */

const sharedWorker = new SharedWorker('./worker.js');
const messageHandlers = {};


/**
 * Broadcast a message to the SharedWorker instance
 * @param {Object} data The data object to pass
 * @param {string} data.message The message type
 */
export function postMessage(data) {
    sharedWorker.port.postMessage([data])
}

/**
 * Add a callback function that will be called everytime a message matching the message type.
 * @param {string} messageType The type of the message to match
 * @param {Function} callback The function that should be called when a valid message is received
 */
export function on(messageType, callback) {
    if (!messageHandlers[messageType]) {
        messageHandlers[messageType] = [];
    }

    // We want the callbacks to be called asynchronously
    messageHandlers[messageType].push(callback);
}

/**
 * Removes all callbacks provided that were previously added via {@link on | SharedWorker.on}
 * @param  {...Function} callbacks The callbacks to remove
 */
export function remove(...callbacks) {
    console.log("BEFORE REMOVE", messageHandlers);
    for (const messageType in messageHandlers) {
        const handlers = messageHandlers[messageType];
        messageHandlers[messageType] = handlers.filter(callback => !callbacks.includes(callback))
    }
    console.log("AFTER REMOVE", messageHandlers);
}

/**
 * Creates the function that will start listening for messages in sharedWorker and handle calling handlers.
 */
sharedWorker.port.onmessage = (({ data }) => {
    const handlers = messageHandlers[data.message];
    if (!handlers) return;

    for (const handler of handlers) {
        (async () => handler(data))();
    }
})


export default { on, postMessage, remove }