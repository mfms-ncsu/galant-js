import { React, useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import cytoscape from "cytoscape";
import nodeHtmlLabel from "cytoscape-node-html-label";
import coseBilkent from "cytoscape-cose-bilkent";
import Graph from "graph/Graph";


cytoscape.use(coseBilkent); // This registers coseBilkent as a extension
nodeHtmlLabel(cytoscape);

/**
 * A React component that displays a cytoscape instance.
 * Reads graph data from GraphContext, which is defined in GraphView/index.js
 * @author Julian Madrigal
 * @author Andrew Lanning
 */
export default function CytoscapeComponent() {
    // Get a reference to the element into which cytoscape is loaded
    const cytoscapeElement = useRef();

    /**
     * Initialize cytoscape on mount (When cytoscapeElement ref is set to the div element)
     */
    useEffect(() => {
        if (window.cytoscape) return;

        // Create the cytoscape object
        const cy = cytoscape({
            container: cytoscapeElement.current,
            elements: Graph.cytoscapeManager.getElements(),
            style: Graph.cytoscapeManager.getStyle(),
            layout: { name: "preset" },
            autounselectify: true,
            wheelSensitivity: 0.35,
        });

        /**
         * Render node labels
         */
        cy.nodeHtmlLabel([
            {
                query: "node",
                valign: "top",
                valignBox: "top",
                tpl: (data) => {
                    const hideWeight = false; // NOTE: these need to be pulled from somewhere
                    const hideLabel = false;

                    if ((!hideWeight && data.weight) || (!hideLabel && data.label)) {
                        return renderToString(
                            <div className={`flex flex-col items-center justify-center border bg-white border-black  ${data.invisible && "hidden"}`}>
                                <p className="leading-none">{!data.invisibleWeight && !hideWeight ? data.weight : ""}</p>
                                <p className="leading-none">{!data.invisibleLabel && !hideLabel ? data.label : ""}</p>
                            </div>
                        );
                    }
                }
            },
        ]);

        // Allows cypress to access cytoscape via window.cytoscape and read the graph state
        // Also allows this cytoscape instance to be referenced across the application
        window.cytoscape = cy;

        // react-hooks/exhaustive-deps
    }, [cytoscapeElement]);

    /**
     * Create a function to call whenever cytoscape needs to be updated
     */
    window.updateCytoscape = () => {
        if (!window.cytoscape) return;
        window.cytoscape.elements().remove();// Remove elements
        window.cytoscape.add(Graph.cytoscapeManager.getElements()); // Get new elements
        window.cytoscape.style().resetToDefault(); // Reset style
        window.cytoscape.style(Graph.cytoscapeManager.getStyle()).update(); // Update style
    };

    return (
        <div className="w-full h-full">
            <div className="flex justify-center">
                <p className="absolute z-10 font-semibold">{}</p>
            </div>
            <div id="cytoscape-instance" ref={cytoscapeElement} className="w-full h-full bg-white ring-2 ring-slate-300 rounded-md" />
        </div>
    );
}
