import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { algorithmAtom, algorithmChangeManagerAtom, graphAtom, promptQueueAtom } from "states/_atoms/atoms";
import Cytoscape from "globals/Cytoscape";
import SharedWorker from "globals/SharedWorker";
import Algorithm from "states/Algorithm/Algorithm";
import FileParser from "interfaces/FileParser/FileParser";
import Header from "./Header";
import CytoscapeComponent from "./Cytoscape"
import PromptComponent from "components/Prompts/PromptComponent";
import ContextMenu from "components/ContextMenus/ContextMenu"
import NodeContextMenu from "components/ContextMenus/NodeContextMenu";
import EdgeContextMenu from "components/ContextMenus/EdgeContextMenu";
import EditControls from "./Overlays/EditControls";
import AlgorithmControls from "./Overlays/AlgorithmControls";

/**
 * Graph component is responsible for rendering and managing the main view of the application.
 * This component handles loading new graph and algorithm objects into the state variables.
 */
export default function Graph() {
    // Define state variables using React hooks
    const [graph, setGraph] = useAtom(graphAtom);
    const [algorithmChangeManager, setAlgorithmChangeManager] = useAtom(algorithmChangeManagerAtom);
    const [_, setAlgorithm] = useAtom(algorithmAtom);
    const [promptQueue, setPromptQueue] = useAtom(promptQueueAtom);
    const sentAliveMessage = useRef();
    
    /**
     * Creates SharedWorker instance on mount. Whenever graph updates, onMessage 
     * is rewritten to allow reading of most current graph.
     */
    useEffect(() => {
        if (!sentAliveMessage.current) {
            sentAliveMessage.current = true;
            SharedWorker.postMessage({ message: "alive" });
        }

        // Load a new graph
        function onGraphLoad(data, isInit) {
            // Get the name and graph text from the data
            const { name: graphName, payload: graphText } = data;
            if (!graphText) return;

            // Remove any running algorithm
            setAlgorithm(null);

            // Load the graph
            setGraph(FileParser.loadGraph(graphName, graphText));

            // We have to wait for cytoscape to read graph changes, and add graph.
            if (isInit) setTimeout(() => Cytoscape.fit(Cytoscape.elements(), 100), 25);
        }

        // Load a new algorithm
        function onAlgorithmLoad(data) {
            // Load the algorithm
            setAlgorithm(new Algorithm(data.name, data.payload));
        }

        // Register the functions in shared worker
        SharedWorker.on("graph-init", data => onGraphLoad(data, true));
        SharedWorker.on("graph-rename", onGraphLoad);
        SharedWorker.on("algo-init", onAlgorithmLoad);
        return () => SharedWorker.remove(onGraphLoad, onAlgorithmLoad);
    }, [graph]);

    return (
        <>
            <link rel="manifest" id="manifest-placeholder" href="./manifest.webmanifest" />
            <Header />
            <div className="relative w-full h-full">
                <PromptComponent />
                <CytoscapeComponent />
                <AlgorithmControls />
                <EditControls />
                <ContextMenu />
                <NodeContextMenu />
                <EdgeContextMenu />
            </div>
        </>
    );
}
