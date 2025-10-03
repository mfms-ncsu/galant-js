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
            setUserChangeManager(new ChangeManager());

            // !!! need to reset the edit change manager here !!!
            // could actually reset both change managers

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
            setAlgorithmChangeManager(new ChangeManager());
            myAlgorithm.start();
        }

        function onAlgorithmStart(data) {
            if (myAlgorithm) {
                myAlgorithm.start();
            } else {
                console.error("No algorithm loaded to start");
            }
        }

        // Register the functions in shared worker
        SharedWorker.on("graph-init", data => onGraphLoad(data, true));
        SharedWorker.on("graph-rename", onGraphLoad);
<<<<<<< HEAD
        // If the graph type is a tree, do the new layout
=======
        // If the graph type is "tree", do a layout appropriate for trees - https://www.npmjs.com/package/cytoscape-dagre
        // In other cases, layout depends on user-specified node positions; Cytoscape is called on only for auto-layout - see ControlSettingsPopover 
>>>>>>> d01e7399d88849ee6db445d7842854483a09bdeb
        if(graph.type == 'tree'){
            // Important Notes:
            // 1. Switched from dagre to Elkjs due to limited sorting functionality
            // 2. "fit: false" prevents issues with resizing during algorithms
            // 3. considerModelOrder allows us to use file-order for tree building and can be configured to use edge order or node order
            //    - The default behavior optimizes trees based on sizing.
            //    - Highly recommend reviewing documentation on Elkjs. 
            Cytoscape.layout({ name: 'elk', animate: false, fit: false,
                elk: {"elk.algorithm": "layered", "elk.layered.considerModelOrder.strategy": "PREFER_NODES", 'elk.direction': 'DOWN', 'elk.edgeRouting': 'SPLINES'} }).run();
        }
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
