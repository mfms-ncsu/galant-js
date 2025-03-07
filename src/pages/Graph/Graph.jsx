/**
 * Graph component is responsible for rendering and managing the main view of the application.
 * This component includes state management for the graph, current algorithm, algorithm status,
 * graph edit history, and various context providers for child components.
 * @author Christina Albores
 */
import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { algorithmChangeManagerAtom, graphAtom } from "utils/atoms/atoms";
import Cytoscape from "globals/Cytoscape";
import SharedWorker from "globals/SharedWorker";
import Algorithm from "utils/algorithm/Algorithm";
import AlgorithmContext, { createAlgorithmContextObject } from "utils/algorithm/AlgorithmContext";
import FileParser from "utils/graph/FileParser/FileParser";
import { PromptContext } from "utils/services/PromptService";
import PromptServiceObject from "utils/services/PromptService";
import HeaderComponent from "./Header";
import CytoscapeComponent from "./Cytoscape"
import PromptComponent from "components/Prompts/PromptComponent";
import ContextMenu from "components/ContextMenus/ContextMenu"
import NodeContextMenu from "components/ContextMenus/NodeContextMenu";
import EdgeContextMenu from "components/ContextMenus/EdgeContextMenu";
import EditControls from "./Overlays/EditControls";
import AlgorithmControls from "./Overlays/AlgorithmControls";

export default function Graph() {
    // Define state variables using React hooks
    const [graph, setGraph] = useAtom(graphAtom);
    const [algorithmChangeManager, setAlgorithmChangeManager] = useAtom(algorithmChangeManagerAtom);
    const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
    const algorithmContext = createAlgorithmContextObject(currentAlgorithm, setCurrentAlgorithm);
    const [algorithmStatus, setAlgorithmStatus] = useState(null);
    const [PromptService] = useState(new PromptServiceObject(useState([])));
    const sentAliveMessage = useRef();

    const fileParser = new FileParser(graph, setGraph);
    
    /**
     * Creates SharedWorker instance on mount.
     * Whenever graph updates, onMessage is rewritten to allow reading of most 
     * current graph
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
                setGraph(fileParser.loadGraph(graphName, graphText));
            } catch (e) {
                console.error(e);
            }

            // We have to wait for cytoscape to read graph changes, and add graph.
            if (isInit) setTimeout(() => Cytoscape.fit(), 75);
        }

        /**
         * Load a new algorithm.
         */
        function onAlgorithmLoad(data) {
            // Load the algorithm
            let newAlgorithm = new Algorithm([graph, setGraph], [algorithmChangeManager, setAlgorithmChangeManager], data.name, data.algorithm, PromptService, [algorithmStatus, setAlgorithmStatus]);
            setCurrentAlgorithm(newAlgorithm);
        }

        SharedWorker.on("graph-init", data => onGraphLoad(data, true));
        SharedWorker.on("graph-rename", onGraphLoad);
        SharedWorker.on("algo-init", onAlgorithmLoad);
        return () => SharedWorker.remove(onGraphLoad, onAlgorithmLoad);
    }, [graph]);

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
        </>
    );
}
