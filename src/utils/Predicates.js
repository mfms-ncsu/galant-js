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

    /**
     * Updates the state using a specified update function.
     * @param {Function} update - The update function that modifies the state.
     * @returns {Object} An object containing apply and revert functions to apply or revert the update.
     */
    update(update) {
        let rule;
        this.state = produce(this.state, update, (apply, revert) => {
            rule = { apply: apply, revert: revert };
        });
        return rule;
    }

    /**
     * Applies an array of patches to the state.
     * @param {Array} patches - An array of patches to apply to the state.
     */
    applyPatches(patches) {
        this.state = applyPatches(this.state, patches);
    }
}
