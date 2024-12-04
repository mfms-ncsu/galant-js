import { enablePatches, freeze, produce, applyPatches } from "immer";

/**
 * Enables Immer's patches functionality.
 */
enablePatches();

/**
 * Class representing a Predicates object for managing state updates.
 */
export default class Predicates {
    /**
     * Creates a new Predicates instance.
     * @param {Object} state - The initial state object.
     */
    constructor(state) {
        freeze(state, true); // Freezes the initial state object
        this.state = state;
    }

    /**
     * Retrieves the current state object.
     * @returns {Object} The current state object.
     */
    get() {
        return this.state;
    }

    update(update) {
        const prevState = this.deepCopy(this.state);
        const changes = [];
        update(prevState, changes);
        this.state = prevState;
        return {
            apply: changes,
            revert: [],
        }
    }

    deepCopy(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj; // Return the value if obj is not an object
        }

        // Handle array
        if (Array.isArray(obj)) {
            return obj.map(item => this.deepCopy(item));
        }

        // Handle object
        const copy = Object.create(Object.getPrototypeOf(obj)); // Create a new object with the same prototype
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = this.deepCopy(obj[key]); // Recursively copy properties
            }
        }
        return copy;
    }
    /**
     * Applies an array of patches to the state.
     * @param {Array} patches - An array of patches to apply to the state.
     */
    applyPatches(patches) {
        this.state = applyPatches(this.state, patches);
    }
}
