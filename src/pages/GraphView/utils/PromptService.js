/**
 * @fileoverview Contains the PromptService that will be imported by any components that need the service.
 * It uses React's Context to provide the service without need for prop drilling. 
 * @author Julian Madrigal
 */

import {useContext, createContext } from 'react';
export const PromptContext = createContext();

/**
 * @class This is the Prompt
 */
export default class PromptService {
    
    /**
     * 
     * @constructor
     * @param {Object[]} queue Queue of prompts
     */
    constructor([queue, setQueue]) {
        this.queue = queue;
        this.setQueue = setQueue;
        this.clear = false;             // Set this flag if you want to remove all active prompts
    }

    /**
     * Add a prompt
     * @param {Object} data The data object of the prompt
     * @param {String} data.type Type of the prompt
     * @param {*} callback The callback when user submits prompt. Returns any value if prompt contains input. 
     */
    addPrompt(data, callback) {
        const newQueue = [...this.queue, {data, callback}];
        this.queue = newQueue;
        this.setQueue(newQueue);
    }

    getNextPrompt() {
        const prompt = this.queue.shift();
        this.setQueue([...this.queue]);
        return prompt;
    }
    
    /**
     * Removes all prompts from the queue
     */
    clearPrompts() {
        this.queue = [];
        this.setQueue([...this.queue]);
        this.clear = true;
    }
}

/**
 * Provides access to GraphContext's object
 * @returns {PromptService} Object provided by GraphContext
 */
export function usePromptService() {
    return useContext(PromptContext);
}
