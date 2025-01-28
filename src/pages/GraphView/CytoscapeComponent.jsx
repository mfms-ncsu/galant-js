import { React, useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { useGraphContext } from "pages/GraphView/utils/GraphContext";
import cytoscape from "cytoscape";
import nodeHtmlLabel from "cytoscape-node-html-label";
import coseBilkent from "cytoscape-cose-bilkent";

/**
 * NEW IMPORTS
 */
import NewGraph from "graph/Graph";


cytoscape.use(coseBilkent); // This registers coseBilkent as a extension
nodeHtmlLabel(cytoscape);

/**
 * A React component that displays a cytoscape instance.
 * Reads graph data from GraphContext, which is defined in GraphView/index.js
 * @author Julian Madrigal
 * @author Andrew Lanning
 */
export default function CytoscapeComponent() {
    const graphContext = useGraphContext();
    const graph = graphContext.graph;
    let cytoscapeInstance = graphContext.cytoscape.instance;
    const cytoscapeElement = useRef();


    /**
     * Initialize cytoscape on mount (When cytoscapeElement ref is set to the div element)
     */
    useEffect(() => {
        if (cytoscapeInstance) return;

        // Create the cytoscape object
        const cy = cytoscape({
            container: cytoscapeElement.current,
            elements: NewGraph.cytoscapeManager.getElements(),
            style: NewGraph.cytoscapeManager.getStyle(),
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
                    const hideWeight = graphContext.preferences.style.node.hideWeight;
                    const hideLabel = graphContext.preferences.style.node.hideLabel;

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

        graphContext.cytoscape.setInstance(cy);

        // Allows cypress to access cytoscape via window.cytoscape and read the graph state
        window.cytoscape = cy;
    }, [cytoscapeElement])


    /**
     * Update elements when the graph updates
     */
    useEffect(() => {
        if (!cytoscapeInstance) return;
        cytoscapeInstance.elements().remove();// Remove elements
        cytoscapeInstance.add(NewGraph.cytoscapeManager.getElements()); // Get new elements
        cytoscapeInstance.style().resetToDefault(); // Reset style
        cytoscapeInstance.style(NewGraph.cytoscapeManager.getStyle()).update(); // Update style
    }, [cytoscapeInstance, graph, graphContext.preferences.style]);

    return (
        <div className="w-full h-full">
            <div className="flex justify-center">
                <p className="absolute z-10 font-semibold">{graph.message}</p>
            </div>
            <div id="cytoscape-instance" ref={cytoscapeElement} className="w-full h-full bg-white ring-2 ring-slate-300 rounded-md" />
        </div>
    );
}
