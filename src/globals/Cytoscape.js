import cytoscape from "cytoscape";
import nodeHtmlLabel from "cytoscape-node-html-label";
import coseBilkent from "cytoscape-cose-bilkent";
import dagre from "cytoscape-dagre";
import elk from 'cytoscape-elk';

/** Set up add-ons to cytoscape */
cytoscape.use(coseBilkent);
cytoscape.use(elk);
nodeHtmlLabel(cytoscape);

/**
 * Uses the IIFE archetype to immediately execute a function which
 * returns the single instance of cytoscape.
 */
const Cytoscape = (() => {
    // Declare the instance
    let instance;

    if (!instance) {
        // Initialize the instance
        instance = cytoscape();
    }

    // Return the instance
    return instance;
})();

export default Cytoscape;
