import { immerable } from "immer";

/**
 * ChangeManager is an interface for its graph which allows either the
 * algorithm or a user to modify the graph representation. ChangeManager
 * maintains a list of ChangeObjects and an index pointing to the current
 * state between changes.
 * References to ChangeManager objects are in AlgorithmInterface and GraphInterface.
 * There are two change managers
 *  - the user or editor change manager, used to record changes made by the user in edit mode; during algorithm execution, changes in node positions only are recorded
 * - the algorithm change manager, used to record changes made by the algorithm during execution; this one is not active in edit mode
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
    constructor(type = "") {
        console.log(`-> ChangeManager(${type})`)
        // for tracing of change managers
        this.type = type;
        // Create an empty representation of changes
        this.changes = [];
        this.index = 0;

        this.isRecording = false;
        this.recordedChanges = [];
    }
}
