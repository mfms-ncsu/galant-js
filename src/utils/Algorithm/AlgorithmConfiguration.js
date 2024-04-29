
/**
 * Manages and documents all the possible configuration options a user can define
 * @note Please document all the options as you add them.
 * @author Julian Madrigal
 */
export class AlgorithmConfiguration {
    /**
     * Allow the algorithm to take control of managing the positions of nodes
     * @type {boolean}
     * @default false
     */
    controlNodePosition = false;

    constructor(config) {
        if (config) this.applyOptions(config);
    }


    /**
     * Applies the configuration options to the class object.
     * This will only apply options on an allow-list basis.
     * This allow-list is attributes that already exist(!undefined) in the class object
     * Since methods also exist, a check occurs to avoid overwriting functions
     * @param {Object} config Configuration object containing options to apply
     */
    applyOptions(config) {
        for (const option in config) {
            if (this[option] === undefined || typeof this[option] === "function") continue;
            this[option] = config[option];
        }        
    }
}