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
    const [graph, setGraph] = useAtom(graphAtom);
    const [algorithmChangeManager] = useAtom(algorithmChangeManagerAtom)
    const cytoscapeElement = useRef();
    const backgroundCanvas = useRef();
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
        Cytoscape.minZoom(0.1);
        Cytoscape.maxZoom(10);
        Cytoscape.autounselectify(true); // Disable multi-select for now (until supported in ChangeRecords)
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

        // Define a function to handle resize events
        const handleResize = () => {
            let newScalar = GraphInterface.getScalar(graph);
            setGraph((prevGraph) => ({
                ...prevGraph,
                scalar: newScalar,
            }));
        };

        // Ensure we do not add duplicate listeners
        Cytoscape.off("resize", handleResize);
        Cytoscape.on("resize", handleResize);

        return () => {
            Cytoscape.off("resize", handleResize); // Cleanup listener on unmount or dependency change
        };

    }, [graph]);

    /**
     * Function to call whenever the messages need to be updated
     */
    useEffect(() => {
        const newMessage = GraphInterface.getMessage(algorithmChangeManager);
        setMessage(newMessage);
    }, [graph, algorithmChangeManager]);

    useEffect(() => {
        // Draw the background grid once and add an event listener to re-draw it when the viewport changes
        const graphScalar = GraphInterface.getScalar(graph);
        drawGrid(graphScalar.x, graphScalar.y);
    
        // Define the event handler separately
        const handleViewportChange = () => {
            drawGrid(graphScalar.x, graphScalar.y);
        };
    
        // Add event listener once
        Cytoscape.off('viewport', handleViewportChange); // Ensure no duplicate listeners
        Cytoscape.on('viewport', handleViewportChange);
    
        return () => {
            Cytoscape.off('viewport', handleViewportChange); // Cleanup when effect runs again or unmounts
        };
    }, [graph?.scalar]);

    // Helper function to draw a background grid aligned with the graph's scaling
    const drawGrid = (scaleX, scaleY) => {
        if (!backgroundCanvas.current || !window.cytoscape) return;

        const canvas = backgroundCanvas.current;
        const ctx = canvas.getContext('2d');
        const { width, height } = cytoscapeElement.current.getBoundingClientRect();

        // Get Cytoscape's pan and zoom values
        const zoom = window.cytoscape.zoom();
        const pan = window.cytoscape.pan();

        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);

        // If the grid scale is less than 10px, don't draw anything (for performance reasons)
        if (scaleX < 10 || scaleY < 10) return;

        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.lineWidth = 1;

        const scaledGridSizeX = scaleX * zoom;
        const scaledGridSizeY = scaleY * zoom;

        // Offset the grid based on Cytoscape's pan values
        const startX = (pan.x % scaledGridSizeX) -  scaledGridSizeX;
        const startY = (pan.y % scaledGridSizeY) - scaledGridSizeY;

        for (let x = startX; x < width; x += scaledGridSizeX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = startY; y < height; y += scaledGridSizeY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Transform Cytoscape's (0,0) to canvas space
        const originX = pan.x;
        const originY = pan.y;

        // Draw a small cross at the transformed origin
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;

        // Horizontal line of the cross
        ctx.beginPath();
        ctx.moveTo(originX - 10, originY);
        ctx.lineTo(originX + 10, originY);
        ctx.stroke();

        // Vertical line of the cross
        ctx.beginPath();
        ctx.moveTo(originX, originY - 10);
        ctx.lineTo(originX, originY + 10);
        ctx.stroke();
    };

    return (
        <div className="relative w-full h-full">
            <canvas ref={backgroundCanvas} className="absolute top-0 left-0 pointer-events-none" />
            <div className="flex justify-center">
                {message && <p className="absolute z-10 px-2 py-1 rounded-b-lg bg-black text-white text-lg font-semibold">{message}</p>}
            </div>
            <div id="cytoscape-instance" ref={cytoscapeElement} className="w-full h-full bg-transparent" />
        </div>
    );
}
