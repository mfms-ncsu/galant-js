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
     * Initialize Cytoscape on mount or update it otherwise
     */
    useEffect(() => {
        // Return if window.cytoscape has already been mounted

        // TODO: To get the Node HTML labels to update properly, we need to
        // restart cytoscape with each change. There must be a more efficient
        // way to do this.
        if (!Cytoscape.container()) {
        
            // Initialize the cytoscape instance
            Cytoscape.mount(cytoscapeElement.current);
            Cytoscape.add(CytoscapeInterface.getElements(graph));
            Cytoscape.style(CytoscapeInterface.getStyle(graph)).update();
            Cytoscape.minZoom(0.1);
            Cytoscape.maxZoom(10);
            Cytoscape.autounselectify(true); // Disable multi-select for now (until supported in ChangeRecords)
        }
        
        Cytoscape.nodeHtmlLabel([{
            query: "node",
            valign: "top",
            valignBox: "top",
            halign: "center",
            halignBox: "center",
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
        Cytoscape.startBatch(); //Pauses rendering
        Cytoscape.elements().remove();// Remove elements
        Cytoscape.add(CytoscapeInterface.getElements(graph)); // Get new elements
        Cytoscape.style().resetToDefault(); // Reset style
        Cytoscape.style(CytoscapeInterface.getStyle(graph)).update(); // Update style
        Cytoscape.endBatch(); //Resumes rendering

        // If the graph type is "tree", do a layout appropriate for trees - https://www.npmjs.com/package/cytoscape-dagre
        // In other cases, layout depends on user-specified node positions; Cytoscape is called on only for auto-layout - see ControlSettingsPopover 
        if ( graph.type == 'tree' ) {
            // Important Notes:
            // 1. Switched from dagre to Elkjs due to limited sorting functionality
            // 2. "fit: false" prevents issues with resizing during algorithms
            // 3. considerModelOrder allows us to use file-order for tree building and can be configured to use edge order or node order
            //    - The default behavior optimizes trees based on sizing.
            //    - Highly recommend reviewing documentation on Elkjs. 
            // 4. Prevents cytoscape from rendering the container until the layout is finished running

            // Pause redraws during layout
            Cytoscape.startBatch(); 

            // Define the ELK layout
            const layout = Cytoscape.layout({ name: 'elk', animate: false, fit: false,
                elk: {"elk.algorithm": "layered", "elk.layered.considerModelOrder.strategy": "PREFER_NODES", 'elk.direction': 'DOWN', 'elk.edgeRouting': 'SPLINES'} });
            
            // Run the layout and resume rendering on completion
            layout.run();
            
            layout.once('layoutstop', () => {
                Cytoscape.endBatch(); // resume redraws
                Cytoscape.fit(Cytoscape.elements(), 100);
            });
        }

        // If it's a tree, clear the background grid immediately
        if (graph.type === "tree" && backgroundCanvas.current) {
            const ctx = backgroundCanvas.current.getContext("2d");
            ctx.clearRect(0, 0, backgroundCanvas.current.width, backgroundCanvas.current.height);
        }

        // Define a function to handle window resize events
        // - if it's a layered graph, we want x and y to scale independently
        // - otherwise, we simply want to center the graph
        const handleResize = () => {
            if ( graph.type === "layered" ) {
                let newScalar = GraphInterface.getScalar(graph);
                setGraph((prevGraph) => ({
                    ...prevGraph,
                    scalar: newScalar,
                }));
            }
            else {
                // perform a fit with padding of 100px (autoCamera)
                Cytoscape.fit(Cytoscape.elements(), 100);
            }
        };
        window.onresize = handleResize;
        
        return () => {
            // Cleanup listener on unmount or dependency change
            window.onresize = null;
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
        //If there is a tree, do not draw the grid
        if ( graph.type == 'tree'){ 
            return;
        }
        
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
            <canvas ref={backgroundCanvas} className="absolute top-0 left-0 pointer-events-none"/>
            <div className="flex justify-center">
                {message && <p className="absolute z-10 px-2 py-1 rounded-b-lg bg-black text-white text-lg font-semibold">{message}</p>}
            </div>
            <div id="cytoscape-instance" data-cy="cytoscape-instance" ref={cytoscapeElement} className="w-full h-full bg-transparent" />
        </div>
    );
}
