import { immerable } from "immer";

/**
 * ChangeManager is an interface for its graph which allows either the
 * algorithm or a user to modify the graph representation. ChangeManager
 * maintains a list of ChangeObjects and an index pointing to the current
 * state between changes.
 * 
 * @author Henry Morris
 * @author Krisjian Smith
 */
export default class ChangeManager {
    /** List of steps containing changes */
    changes;
    /** Enable immer */
    [immerable] = true;
    /** Current index within changes */
    index;
    /** Boolean flag for whether the manager is recording changes */
    isRecording;
    /** Current list of changes in the recording */
    recordedChanges;

    /**
     * Constucts a new ChangeManager.
     */
    constructor() {
        // Create an empty representation of changes
        this.changes = [];
        this.index = 0;

        this.isRecording = false;
        this.recordedChanges = [];
    }
}
