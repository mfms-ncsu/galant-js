import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { algorithmAtom, algorithmChangeManagerAtom, userChangeManagerAtom, graphAtom, promptQueueAtom } from "states/_atoms/atoms";
import Cytoscape from "globals/Cytoscape";
import SharedWorker from "globals/SharedWorker";
import Algorithm from "states/Algorithm/Algorithm";
import ChangeManager from "states/ChangeManager/ChangeManager";
import FileParser from "interfaces/FileParser/FileParser";
import Header from "./Header";
import CytoscapeComponent from "./Cytoscape"
import PromptComponent from "components/Prompts/PromptComponent";
import ContextMenu from "components/ContextMenus/ContextMenu"
import NodeContextMenu from "components/ContextMenus/NodeContextMenu";
import EdgeContextMenu from "components/ContextMenus/EdgeContextMenu";
import EditControls from "./Overlays/EditControls";
import AlgorithmControls from "./Overlays/AlgorithmControls";
import AlgorithmInterface from "interfaces/AlgorithmInterface/AlgorithmInterface"

/**
 * Graph component is responsible for rendering and managing the main view of the application.
 * This component handles loading new graph and algorithm objects into the state variables.
 */
export default function Graph() {
    // Define state variables using React hooks
    const [graph, setGraph] = useAtom(graphAtom);
    const [algorithmChangeManager, setAlgorithmChangeManager] = useAtom(algorithmChangeManagerAtom);
    const [userChangeManager, setUserChangeManager] = useAtom(userChangeManagerAtom);
    const [algorithm, setAlgorithm] = useAtom(algorithmAtom);
    const [promptQueue, setPromptQueue] = useAtom(promptQueueAtom);
    const sentAliveMessage = useRef();
    let algorithmLoading = false;
    let myAlgorithm = null;
    
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
            if ( algorithmLoading ) {
                algorithmLoading = false;
                return;
            }
            // Get the name and graph text from the data
            const { name: graphName, payload: graphText } = data;
            if (!graphText) return;

            // Remove any running algorithm
            setAlgorithm(null);

            // Load the graph
            setGraph(FileParser.loadGraph(graphName, graphText));
            // @todo should get rid of any messages from a running algorithm
            setUserChangeManager(new ChangeManager("Graph.jsx-user"));

            // We have to wait for cytoscape to read graph changes, and add graph.
            if (isInit) setTimeout(() => Cytoscape.fit(Cytoscape.elements(), 100), 25);
            
        }

        // Load a new algorithm
        function onAlgorithmLoad(data) {
            algorithmLoading = true
            
            // Undo any changes the old algorithm made
            // @todo this should happen when the algorithm is terminated
            //       and the algorithm change manager should be set to null
            AlgorithmInterface.revert();

            // Clear the PromptQueue if one exists
            setPromptQueue([]);
            
            // Load the algorithm and reset the ChangeManager
            // The following might also work:
            //   setAlgorithm(new Algorithm(data.name, data.payload));
            //   algorithm.start();
            // But this way we can handle errors more gracefully.
            myAlgorithm = new Algorithm(data.name, data.payload);
            setAlgorithm(myAlgorithm);
            setAlgorithmChangeManager(new ChangeManager("Graph.jsx-algorithm"));
            myAlgorithm.start();
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