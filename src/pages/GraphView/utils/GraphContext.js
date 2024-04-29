/**
 * @fileoverview Contains the GraphContext that will be imported by any components that need the context.
 * @author Julian Madrigal
 */

import {useContext, createContext} from 'react';

/**
 * @typedef {import("./CytoscapeStylesheet").StyleSheetPreferences} StyleSheetPreferences Contains preferences that users can change that will be considered during creating of stylesheet
 * @typedef {import("./CytoscapeLayout").LayoutPreferences} LayoutPreferences contains layout preferences for cytoscape
 * @typedef {import('cytoscape').Core} CytoscapeInstance It is your entry point to Cytoscape.js: All of the library’s features are accessed through this object. http://js.cytoscape.org/#core
 * @typedef {import('utils/Graph').default} Graph
 */


/**
 * @typedef {Object} GraphContextObject Contains all functions and helpers provided by GraphContext
 * 
 * @property {Graph} graph The current graph rendered in cytoscape
 * @property {Function} setGraph Set the current rendered graph
 * 
 * @property {Graph} baseGraph The base graph, the one loaded in, and untouched
 * @property {Function} setBaseGraph set the base graph
 * 
 * @property {Object} preferences
 * @property {StyleSheetPreferences} preferences.style Preferences for stylesheet
 * @property {Function} preferences.setStylePreferences
 * 
 * @property {LayoutPreferences} preferences.layout Preferences for layout
 * @property {Function} preferences.setLayoutPreferences
 * 
 * @property {Object} cytoscape
 * @property {CytoscapeInstance} cytoscape.instance
 * @property {Function} cytoscape.setInstance
 */


/**
 * Helper function only used by the function setting GraphContextProvider.
 * Formats the values into the format of {@link GraphContextObject}
 * @return {GraphContextObject} GraphContextObject
 */
export function createGraphContextObject(graph, setGraph, baseGraph, setBaseGraph, stylePreferences, setStylePreferences, layoutPreferences, setLayoutPreferences, cytoscapeInstance, setCytoscapeInstance) {
    return {
        graph,
        setGraph,
        baseGraph,
        setBaseGraph,
        preferences: {
            style: stylePreferences,
            layout: layoutPreferences,
            setStylePreferences: setStylePreferences,
            setLayoutPreferences: setLayoutPreferences
        },
        cytoscape: {
            instance: cytoscapeInstance,
            setInstance: setCytoscapeInstance
        }
    }
}

export const GraphContext = createContext();


/**
 * Provides access to GraphContext's object
 * @returns {GraphContextObject} Object provided by GraphContext
 */
export function useGraphContext() {
    return useContext(GraphContext);
}


export default GraphContext;