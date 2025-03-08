import { React, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { algorithmChangeManagerAtom, graphAtom } from "states/_atoms/atoms";
import CytoscapeInterface from "interfaces/CytoscapeInterface/CytoscapeInterface";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import Cytoscape from "globals/Cytoscape";
import { renderToString } from "react-dom/server";

/**
 * A React component that renders the cytoscape instance.
 */
export default function CytoscapeComponent() {
    const [graph] = useAtom(graphAtom);
    const [algorithmChangeManager] = useAtom(algorithmChangeManagerAtom)
    const cytoscapeElement = useRef();
    const [message, setMessage] = useState(null);

    /**
     * Initialize cytoscape on mount (When cytoscapeElement ref is set to the div element)
     */
    useEffect(() => {
        // Return if window.cytoscape has already been mounted
        if (Cytoscape.container()) return;

        // Initialize the cytoscape instance
        Cytoscape.mount(cytoscapeElement.current);
        Cytoscape.add(CytoscapeInterface.getElements(graph));
        Cytoscape.style(CytoscapeInterface.getStyle(graph)).update();
        Cytoscape.nodeHtmlLabel([{
            query: "node",
            valign: "top",
            valignBox: "top",
            tpl: (data) => {
                const showWeights = graph.showNodeWeights;
                const showLabels = graph.showNodeLabels;

                if ((showWeights && !data.weightHidden) || (showLabels && !data.labelHidden)) {
                    // This flag determines whether or not there is anything to render. If both the weight
                    // and label of the node are empty, then we should not draw the label
                    let hasWeight = data.weight !== undefined && data.weight !== "" && showWeights && !data.weightHidden;
                    let hasLabel = data.label !== undefined && data.label !== "" && showLabels && !data.labelHidden;
                    let hasWeightOrLabel = hasWeight || hasLabel;

                    return renderToString(
                        <div className=
                            {`flex flex-col items-center justify-center border bg-white border-black  ${(data.hidden || !hasWeightOrLabel) && "hidden"}`
                            }>
                            <p className="leading-none">
                                {(!data.weightHidden && showWeights) ? data.weight : ""}
                            </p>
                            <p className="leading-none">
                                {(!data.labelHidden && showLabels) ? data.label : ""}
                            </p>
                        </div>
                    );
                }
            }
        }]);

        // Allows cypress to access cytoscape via window.cytoscape and read the graph state
        // Also allows this cytoscape instance to be referenced across the application
        window.cytoscape = Cytoscape;

        // react-hooks/exhaustive-deps
    }, [cytoscapeElement]);

    /**
     * Create a function to call whenever cytoscape needs to be updated
     */
    useEffect(() => {
        Cytoscape.elements().remove();// Remove elements
        Cytoscape.add(CytoscapeInterface.getElements(graph)); // Get new elements
        Cytoscape.style().resetToDefault(); // Reset style
        Cytoscape.style(CytoscapeInterface.getStyle(graph)).update(); // Update style
    }, [graph]);

    /**
     * Function to call whenever the messages need to be updated
     */
    useEffect(() => {
        const newMessage = GraphInterface.getMessage(algorithmChangeManager);
        setMessage(newMessage);
    }, [graph, algorithmChangeManager]);

    return (
        <div className="w-full h-full">
            <div className="flex justify-center">
                {message && <p className="absolute z-10 px-2 py-1 rounded-b-lg bg-black text-white text-lg font-semibold">{message}</p>}
            </div>
            <div id="cytoscape-instance" ref={cytoscapeElement} className="w-full h-full bg-white" />
        </div>
    );
}
