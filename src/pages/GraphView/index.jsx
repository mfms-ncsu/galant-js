/**
 * GraphView component is responsible for rendering and managing the main view of the application.
 * This component includes state management for the base graph, current algorithm, algorithm status,
 * graph edit history, and various context providers for child components.
 * @author Christina Albores
 */
import { useState, useEffect, useRef } from "react";
import { createGraphContextObject } from "pages/GraphView/utils/GraphContext";
import { GraphContext } from "pages/GraphView/utils/GraphContext";
import { defaultStylePreferences } from "./utils/CytoscapeStylesheet";
import { defaultLayout } from "./utils/CytoscapeLayout";
import GraphOverlay from "./GraphOverlay/GraphOverlay";
import HeaderComponent from "./HeaderComponent";
import CytoscapeComponent from "./CytoscapeComponent"
import AlgorithmContext, { createAlgorithmContextObject } from "./utils/AlgorithmContext";
import { PromptContext } from "./utils/PromptService";
import PromptServiceObject from "./utils/PromptService";
import PromptComponent from "./GraphOverlay/Prompts/PromptComponent";
import ContextMenu from "./GraphEditOverlay/ContextMenus/ContextMenu";
import NodeContextMenu from "./GraphEditOverlay/ContextMenus/NodeContextMenu";
import EdgeContextMenu from "./GraphEditOverlay/ContextMenus/EdgeContextMenu";
import GraphEditOverlay from "./GraphEditOverlay/GraphEditOverlay";
import SharedWorker from "./utils/SharedWorker";
import Graph from "utils/Graph";


/**
 * NEW IMPORTS
 */
import NewGraph from "graph/Graph";
import NewAlgorthm from "algorithm/Algorithm";


export default function GraphView() {
    // Define state variables using React hooks
    const [PromptService] = useState(new PromptServiceObject(useState([])));
    const [baseGraph, setBaseGraph] = useState(new Graph([], [], false, ""));
    const [graph, setGraph] = useState(baseGraph);
    const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
    const [algorithmStatus, setAlgorithmStatus] = useState(null);
    const [cytoscapeStyleSheetPreferences, setCytoscapeStyleSheetPreferences] = useState(defaultStylePreferences);
    const [cytoscapeLayoutPreferences, setCytoscapeLayoutPreferences] = useState(defaultLayout);
    const [cytoscapeInstance, setCytoscapeInstance] = useState(null); // If we move cytoscape into here, we won"t need setCytoscape anymore (aka no useState at all)
    const [mode, setMode] = useState("normal") // "normal", "undo", "redo"

    const sentAliveMessage = useRef();

    const graphContext = createGraphContextObject(graph, setGraph, baseGraph, setBaseGraph, cytoscapeStyleSheetPreferences, setCytoscapeStyleSheetPreferences, cytoscapeLayoutPreferences, setCytoscapeLayoutPreferences, cytoscapeInstance, setCytoscapeInstance);
    const algorithmContext = createAlgorithmContextObject(currentAlgorithm, setCurrentAlgorithm);
    
    /**
     * Creates SharedWorker instance on mount.
     * Whenever baseGraph or currentAlgorithm updates, onMessage is rewritten to allow reading of most current baseGraph/currentAlgorithm
     */
    useEffect(() => {
        if (!sentAliveMessage.current) {
            sentAliveMessage.current = true;
            SharedWorker.postMessage({ message: "alive" });
        }

        /**
         * Load a new graph.
         */
        function onGraphLoad(data, isInit) {
            // Get the name and graph text from the data
            const { name: graphName, graph: graphText } = data;
            if (!graphText) return;

            // Remove any running algorithm
            setCurrentAlgorithm(null);

            // Load the graph
            try {
                NewGraph.fileParser.loadGraph(graphText);
            } catch (e) {
                alert(e);
            }

            // We have to wait for cytoscape to read graph changes, and add graph.
            if (isInit && window.cytoscape) setTimeout(() => window.cytoscape.fit(), 75);
        }

        /**
         * Load a new algorithm.
         */
        function onAlgorithmLoad(data) {
            // Load the algorithm
            let newAlgorthm = new NewAlgorthm(data.name, data.algorithm, PromptService, [algorithmStatus, setAlgorithmStatus]);
            setCurrentAlgorithm(newAlgorthm);
        }

        SharedWorker.on("graph-init", data => onGraphLoad(data, true));
        SharedWorker.on("graph-rename", onGraphLoad);
        SharedWorker.on("algo-init", onAlgorithmLoad);
        return () => SharedWorker.remove(onGraphLoad, onAlgorithmLoad);
        // eslint-disable-next-line
    }, [window.cytoscape]);


    return (
        <>
            <link rel="manifest" id="manifest-placeholder" href="./manifest.webmanifest" />
            <HeaderComponent />
            <div className="relative w-full h-full">
                <AlgorithmContext.Provider value={algorithmContext}>
                    <GraphContext.Provider value={graphContext}>
                        <PromptContext.Provider value={PromptService}>
                            {/* having trouble figuring out how to get placement of prompts set up the way
                                I want; maybe the w-full, h-full at the top is messing things up.
                                It took a while to get the context menus right
                                and I"m not sure why they now work okay */}
                            <div className="absolute z-10 left-1/4 top-1/4">
                                <div><PromptComponent /></div>
                            </div>
                            <CytoscapeComponent />
                            <GraphOverlay />
                            <GraphEditOverlay setMode={setMode} />
                            <ContextMenu />
                            <NodeContextMenu />
                            <EdgeContextMenu />
                        </PromptContext.Provider>
                    </GraphContext.Provider>
                </AlgorithmContext.Provider>
            </div>
        </>);
}