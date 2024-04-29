
/**
 * @typedef LayoutPreferences contains layout preferences for cytoscape
 * @property {'preset' | 'graph'} name Name of layout to use.
*/



/**
 * Default Layout that should be loaded at start
 * @type {LayoutPreferences}
 */
export const defaultLayout = {
    name: 'preset'
}



/**
 * Create the cytoscape layout definition considering the preferences provided
 * @param {LayoutPreferences} preferences Any preferences that should go into the creation of cytoscape.
 * @returns {Object} Definition of layout that can be read by cytoscape
 */
export function createCytoscapeLayout(preferences) {
    return {
        name: preferences.name
    }
}