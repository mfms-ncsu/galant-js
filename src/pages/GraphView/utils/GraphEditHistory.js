import Graph from "utils/Graph";

/**
 * @typedef {import('utils/Graph').default} Graph
 */

/**
 * This is basically a wrapper for the immer data, which defines functions that can be applied using the update() function.
 * @author Julian Madrigal
 * @author Christina Albores
 */
export default class GraphEditHistory {

    /**
     * Creates an instance of GraphEditHistory.
     * @param {Object} data The initial data containing history and current index.
     * @param {Graph[]} data.history List of graph snapshots.
     * @param {number} data.current Current index.
     * @param {Function} update The update function provided by useImmer().
     */
    constructor(data, update) {
        /**
         * @type {Graph[]} List of graph snapshots
         */
        this.history = data.history;
        /**
         * @type {number} Current index
         */
        this.current = data.current;
        /**
         * @type {Function} useImmer()'s update function
         */
        this.update = update;
    }


    /**
     * This adds a new snapshot after the current snapshot.
     * If snapshots exist after the current snapshot (due to user undos), delete before adding. 
     * @param {Graph} snapshot The GraphSnapshot to add
     */
    add(snapshot) {
        this.update(draft => {
            if (draft.current < draft.history.length - 1) { // If user has undone, and snapshots exist further in the timeline
                draft.history = draft.history.slice(0, draft.current + 1);
            }

            draft.history.push(snapshot);
            draft.current++;
        })
    }

    /**
     * Updates the current to point to the previous snapshot.
     * If current is already at the initial snapshot, do nothing.
     */
    undo() {
        if (this.current <= 0) return;
        this.update(draft => {
            draft.current--;
        })
    }

    /**
     * Updates the current to point to the next snapshot.
     * If current is already at the last snapshot, do nothing.
     */
    redo() {
        if (this.current >= this.history.length - 1) return;
        this.update(draft => {
            draft.current++;
        })
    }

    /**
     * Removes all the changes and keeps the initial graph. 
     */
    revert() {
        this.update(draft => {
            draft.history = draft.history.slice(0, 1);
            draft.current = 0;
        })
    }

    /**
     * Gets the graph snapshot at the current index.
     * @returns {Graph} The current graph snapshot.
     */
    getCurrentSnapshot() {
        return this.history[this.current];
    }

    /**
     * Gets the latest graph snapshot in the history.
     * @returns {Graph} The latest graph snapshot.
     */
    getLatestSnapshot() {
        return this.history[this.history.length - 1];
    }
}
