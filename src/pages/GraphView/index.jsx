/**
 * GraphView component is responsible for rendering and managing the main view of the application.
 * This component includes state management for the base graph, current algorithm, algorithm status,
 * graph edit history, and various context providers for child components.
 * @author Christina Albores
 */
import { useState, useEffect, useRef, useMemo } from "react";
import { createGraphContextObject } from "pages/GraphView/utils/GraphContext";
import { enablePatches } from "immer";
import GraphClass from 'utils/Graph';
import { GraphContext } from "pages/GraphView/utils/GraphContext";
import { defaultStylePreferences } from "./utils/CytoscapeStylesheet";
import { defaultLayout } from "./utils/CytoscapeLayout";
import GraphOverlay from "./GraphOverlay/GraphOverlay";
import HeaderComponent from "./HeaderComponent";
import CytoscapeComponent from './CytoscapeComponent'
import AlgorithmContext, { createAlgorithmContextObject } from "./utils/AlgorithmContext";
import { PromptContext } from "./utils/PromptService";
import PromptServiceObject from "./utils/PromptService";
import PromptComponent from "./GraphOverlay/Prompts/PromptComponent";
import Algorithm from "utils/Algorithm/Algorithm";
import ContextMenu from "./GraphEditOverlay/ContextMenus/ContextMenu";
import NodeContextMenu from "./GraphEditOverlay/ContextMenus/NodeContextMenu";
import EdgeContextMenu from "./GraphEditOverlay/ContextMenus/EdgeContextMenu";
import GraphEditHistory from "./utils/GraphEditHistory";
import GraphEditOverlay from "./GraphEditOverlay/GraphEditOverlay";
import SharedWorker from "./utils/SharedWorker";
import Graph from "utils/Graph";
import { useImmer } from "use-immer";
import { applyPositions, applyScalar, calculateGraphScalar } from "./utils/GraphUtils";
import { parseText } from "utils/FileToPredicate";
import { parseSGFText } from "utils/SGFileToPredicate";
import ChangeRecord from "./utils/ChangeRecord";


/**
 * NEW IMPORTS
 */
import NewGraph from 'graph/Graph';


enablePatches();

export default function GraphView() {
    // Define state variables using React hooks
    const [PromptService] = useState(new PromptServiceObject(useState([])));

    const [baseGraph, setBaseGraph] = useState(new Graph([], [], false, ""));
    const [graph, setGraph] = useState(baseGraph);
    const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
    const [algorithmStatus, setAlgorithmStatus] = useState(null);

    const [changeRecordIndex, setChangeRecordIndex] = useState(0);

    const [cytoscapeStyleSheetPreferences, setCytoscapeStyleSheetPreferences] = useState(defaultStylePreferences);
    const [cytoscapeLayoutPreferences, setCytoscapeLayoutPreferences] = useState(defaultLayout);

    const [cytoscapeInstance, setCytoscapeInstance] = useState(null); // If we move cytoscape into here, we won't need setCytoscape anymore (aka no useState at all)

    /** @type {ChangeRecord} */
    const changeRecord = new ChangeRecord();
    changeRecord.setOnUpdateCallback((index) => {
        setChangeRecordIndex(index);
    });

    const [mode, setMode] = useState('normal') //'normal', 'undo', 'redo'

    const graphContext = createGraphContextObject(graph, setGraph, baseGraph, setBaseGraph, cytoscapeStyleSheetPreferences, setCytoscapeStyleSheetPreferences, cytoscapeLayoutPreferences, setCytoscapeLayoutPreferences, cytoscapeInstance, setCytoscapeInstance);
    const algorithmContext = createAlgorithmContextObject(currentAlgorithm, setCurrentAlgorithm);

    const [graphEditHistoryData, updateGraphEditHistory] = useImmer({
        history: [baseGraph],
        current: 0
    })
    const graphEditHistory = new GraphEditHistory(graphEditHistoryData, updateGraphEditHistory);
    const sentAliveMessage = useRef();
    /**
     * Creates SharedWorker instance on mount.
     * Whenever baseGraph or currentAlgorithm updates, onMessage is rewritten to allow reading of most current baseGraph/currentAlgorithm
     */
    useEffect(() => {
        if (!sentAliveMessage.current) {
            sentAliveMessage.current = true;
            SharedWorker.postMessage({ message: "alive" });
        }

        function onGraphLoad(data, isInit) {
            console.log("Got shared worker data", data);
            const { name: graphName, graph: graphText } = data;
            if (!graphText) return;
            let graphData;
            if (graphName != null && graphName.endsWith('.sgf')) {
                graphData = parseSGFText(graphText); // Use SGF parser for SGF files
            } else {
                graphData = parseText(graphText); // Use normal parser for other file types
            }
            const scalar = Math.max(1, calculateGraphScalar(Object.values(graphData.nodes)));
            applyScalar(graphData.nodes, scalar);

            const newGraph = new Graph(graphData.nodes, graphData.edges, graphData.directed, graphData.message, graphName, scalar);
            const newBaseGraph = new Graph(graphData.nodes, graphData.edges, graphData.directed, graphData.message, graphName, scalar);
            setBaseGraph(newBaseGraph); // This also automatically resets edit history
            setGraph(newGraph);



            NewGraph.fileParser.loadGraph(graphText);



            // We have to wait for cytoscape to read graph changes, and add graph. In the future, perhaps have a attribute in graph called 'autoFit' to inform cy to fit on loading of graph.
            if (isInit && cytoscapeInstance) setTimeout(() => cytoscapeInstance.fit(), 75);
        }

        function onAlgorithmLoad(data) {
            new ChangeRecord('algorithm');
            const newAlgo = new Algorithm(data.name, data.algorithm, baseGraph, { PromptService }, [algorithmStatus, setAlgorithmStatus]);
            setCurrentAlgorithm(newAlgo);
        }

        SharedWorker.on('graph-init', data => onGraphLoad(data, true));
        SharedWorker.on('graph-rename', onGraphLoad);
        SharedWorker.on('algo-init', onAlgorithmLoad);
        return () => SharedWorker.remove(onGraphLoad, onAlgorithmLoad);
        // eslint-disable-next-line
    }, [baseGraph, currentAlgorithm, cytoscapeInstance]);


    /**
     * Effect to update the graph based on the current algorithm's status.
     * If a current algorithm exists, it retrieves the current index and snapshot of the algorithm.
     * It then updates the graph based on the algorithm's snapshot.
     * If the algorithm does not control node positions, it applies node positions obtained from the cytoscape instance.
     * Finally, it sets the graph state to the updated graph.
     * If the algorithm controls node positions, it fits the cytoscape instance to the graph.
    */
    useEffect(() => {
        // Check if a current algorithm exists
        if (!currentAlgorithm) return;

        // Retrieve the current index and snapshot of the algorithm
        const currentIndex = currentAlgorithm.currentIndex;
        const algSnapshot = currentAlgorithm.steps[currentIndex];

        // Initialize final graph with the algorithm snapshot
        let finalGraph = algSnapshot.graph;

        // Check if the algorithm controls node positions
        if (!currentAlgorithm.configuration.controlNodePosition) {
            // If not, obtain node positions from the cytoscape instance
            const positions = {};
            for (const node of cytoscapeInstance.nodes()) {
                positions[node.id()] = node.position();
            }
            // Apply node positions to the graph
            finalGraph = applyPositions(algSnapshot.graph, positions);
        }
        // Update the graph state with the final graph
        setGraph(finalGraph);
        // Fit the cytoscape instance to the graph if algorithm controls node positions
        if (currentAlgorithm.configuration.controlNodePosition) {
            cytoscapeInstance.fit();
        }
    }, [algorithmStatus])

    useEffect(() => {
        let newGraph;
        if (changeRecord.list.length < 1) {
            console.log("SET BG")
            console.log(baseGraph.getNodes())
            setGraph(baseGraph);
        }
        if (mode === 'undo') {
            console.log("UNDO");
            newGraph = changeRecord.undoChange(changeRecord.list[changeRecordIndex], graph)
        } else {
            //Need to apply previous change to get to next graph state. Example: must apply change object at index 0 to get to state in index 1
            newGraph = changeRecord.applyChangeToGraph(changeRecord.list[changeRecord.index - 1], graph)
        }
        if (newGraph !== undefined) {
            setGraph(newGraph);
        }
        setMode('normal');
    }, [changeRecordIndex])

    /**
     * Effect triggered when the base graph changes.
     * Reinitializes the algorithm and edit history.
     * If a current algorithm is active, updates it with the new base graph.
    */
    useEffect(() => {
        // Update the graph edit history with the new base graph
        updateGraphEditHistory(draft => {
            draft.history = [baseGraph];
            draft.current = 0;
        })
        // Check if a current algorithm is active
        if (currentAlgorithm) {
            // Reinitialize the current algorithm with the new base graph
            setCurrentAlgorithm(new Algorithm(currentAlgorithm.name, currentAlgorithm.algorithmCode, baseGraph, { PromptService }, [algorithmStatus, setAlgorithmStatus]));
        }
    }, [baseGraph])

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
    and I'm not sure why they now work okay */}
                            <div className="absolute z-10 left-1/4 top-1/4">
                                <div><PromptComponent /></div>
                            </div>
                            <CytoscapeComponent graphEditHistory={graphEditHistory} />
                            <GraphOverlay />
                            <GraphEditOverlay setMode={setMode} />
                            <ContextMenu graphEditHistory={graphEditHistory} changeRecord={changeRecord} />
                            <NodeContextMenu graphEditHistory={graphEditHistory} />
                            <EdgeContextMenu graphEditHistory={graphEditHistory} />
                        </PromptContext.Provider>
                    </GraphContext.Provider>
                </AlgorithmContext.Provider>
            </div>
        </>);
}