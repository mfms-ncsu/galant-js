import { React, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { algorithmChangeManagerAtom, graphAtom } from "states/_atoms/atoms";
import Cytoscape from "globals/Cytoscape";
import { renderToString } from "react-dom/server";
import CytoscapeManager from "interfaces/CytoscapeManager/CytoscapeManager";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";

/**
 * A React component that displays a cytoscape instance.
 * Reads graph data from GraphContext, which is defined in GraphView/index.js
 * @author Julian Madrigal
 * @author Andrew Lanning
 */
export default function CytoscapeComponent() {
    const cytoscapeManager = new CytoscapeManager();
    const [graph, setGraph] = useAtom(graphAtom);
    const [algorithmChangeManager, setAlgorithmChangeManager] = useAtom(algorithmChangeManagerAtom)
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
        Cytoscape.add(cytoscapeManager.getElements(graph));
        Cytoscape.style(cytoscapeManager.getStyle(graph)).update();
        Cytoscape.nodeHtmlLabel([{
            query: "node",
            valign: "top",
            valignBox: "top",
            tpl: (data) => {
                // TODO
                const showWeights = true;
                const showLabels = true;

                if ((showWeights && !data.weightHidden) || (showLabels && !data.labelHidden)) {
                    // This flag determines whether or not there is anything to render. If both the weight
                    // and label of the node are empty, then we should not draw the label
                    let hasWeight = 
                        data.weight !== undefined &&
                        data.weight !== "" &&
                        showWeights &&
                        !data.weightHidden;

                    let hasLabel =
                        data.label !== undefined &&
                        data.label !== "" &&
                        showLabels &&
                        !data.labelHidden;

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
        Cytoscape.add(cytoscapeManager.getElements(graph)); // Get new elements
        Cytoscape.style().resetToDefault(); // Reset style
        Cytoscape.style(cytoscapeManager.getStyle(graph)).update(); // Update style
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
