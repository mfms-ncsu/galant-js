/**
 * GraphView component is responsible for rendering and managing the main view of the application.
 * This component includes state management for the base graph, current algorithm, algorithm status,
 * graph edit history, and various context providers for child components.
 * @author Christina Albores
 */
import { useState, useEffect, useRef } from "react";
import HeaderComponent from "./Header";
import CytoscapeComponent from "./Cytoscape"
import Algorithm from "utils/algorithm/Algorithm";
import AlgorithmContext, { createAlgorithmContextObject } from "utils/algorithm/AlgorithmContext";
import { PromptContext } from "utils/services/PromptService";
import PromptServiceObject from "utils/services/PromptService";
import PromptComponent from "components/Prompts/PromptComponent";
import ContextMenu from "components/ContextMenus/ContextMenu"
import NodeContextMenu from "components/ContextMenus/NodeContextMenu";
import EdgeContextMenu from "components/ContextMenus/EdgeContextMenu";
import EditControls from "./Overlays/EditControls";
import SharedWorker from "utils/services/SharedWorker";
import Graph from "utils/graph/Graph";
import AlgorithmControls from "./Overlays/AlgorithmControls";


export default function GraphView() {
    // Define state variables using React hooks
    const [PromptService] = useState(new PromptServiceObject(useState([])));
    const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
    const [algorithmStatus, setAlgorithmStatus] = useState(null);
    const [mode, setMode] = useState("normal") // "normal", "undo", "redo"

    const sentAliveMessage = useRef();

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
                Graph.fileParser.loadGraph(graphText);
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
            Graph.algorithmChangeManager.clear(); // Clear any changes
            let newAlgorithm = new Algorithm(data.name, data.algorithm, PromptService, [algorithmStatus, setAlgorithmStatus]); // Create a new algorithm object
            setCurrentAlgorithm(newAlgorithm); // Set the state
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
                    <PromptContext.Provider value={PromptService}>
                        <PromptComponent />
                        <CytoscapeComponent />
                        <AlgorithmControls />
                        <EditControls />
                        <ContextMenu />
                        <NodeContextMenu />
                        <EdgeContextMenu />
                    </PromptContext.Provider>
                </AlgorithmContext.Provider>
            </div>
        </>);
}
