import { React, useEffect, useRef } from 'react';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from "@heroicons/react/24/solid";
import GraphEditHistory from "../utils/GraphEditHistory";
import { useGraphContext } from "../utils/GraphContext";
import { useAlgorithmContext } from "../utils/AlgorithmContext";
import ChangeRecord from '../utils/ChangeRecord';
import Graph from '../../../utils/Graph';

/**
 * NEW IMPORTS
 */
import NewGraph from 'graph/Graph';


/**
 * GraphEditOverlay component represents an overlay for editing graph with functionalities like undo, redo, save, and revert.
 * @param {Object} props - The props for the GraphEditOverlay component.
 * @param {GraphEditHistory} props.graphEditHistory - An instance of GraphEditHistory to track graph edits.
 * @returns {JSX.Element} - Returns the JSX for GraphEditOverlay component.
 */
export default function GraphEditOverlay({ setMode }) {
    // useRef to hold a reference to a SharedWorker instance
    const sharedworkerContainer = useRef();
    sharedworkerContainer.sharedworker = new SharedWorker('./worker.js');

    /** @type {ChangeRecord} */
    const changeRecord = ChangeRecord.getInstance();

    // useContext gets access graph and algorithm contexts
    const graphContext = useGraphContext();
    const algorithmContext = useAlgorithmContext();

    // Function to save the graph state
    function save() {
        if (changeRecord.index <= 0) { // Trying to save base graph..
            changeRecord.clear()
            return;
        }
    }

    // Function to revert graph edits (node movements, etc.)
    function revert() {
        const baseGraph = graphContext.baseGraph;
        const currentGraph = graphContext.graph;

        if (!baseGraph || !currentGraph) return;

        // Reset all nodes and edges in the current graph to match the base graph
        const nodesToReset = currentGraph.getNodes();
        const baseNodes = baseGraph.getNodes();

        nodesToReset.forEach(node => {
            const baseNode = baseNodes.find(base => base.id === node.id);
            if (baseNode) {
                node.x = baseNode.x;  // Reset position to base graph state
                node.y = baseNode.y;
                node.label = baseNode.label;  // Reset any other properties as needed
            }
        });

        graphContext.setGraph(new Graph(nodesToReset, currentGraph.getEdges(), currentGraph.directed, currentGraph.message, currentGraph.name));
        changeRecord.clear();
        setMode("revert");
    }


    // Function to perform undo operation
    function undo() {
        NewGraph.userChangeManager.undo();
        setMode("undo");
    }

    // Function to perform redo operation
    function redo() {
        NewGraph.userChangeManager.redo();
    }

    // Effect hook to handle keyboard shortcuts for undo, redo, revert, and save
    useEffect(() => {
        // Check if there are changes in the graph and an algorithm is loaded
        if (changeRecord.list.length <= 1) return;

        // Check if either a graph or an algorithm is loaded
        if (graphContext.graph && algorithmContext.algorithm) {
            setMode("edit");  // Set mode to edit when both are loaded
        }

        function onKeyDown(event) {
            const key = event.key;
            console.log("-> onKeyDown, key =", key)
            if (event.target.tagName.toLowerCase() === 'input') return;

            if (key === 'z') undo();
            else if (key === 'y') redo();
            else if (key === 'r') revert();
            else if (key === 's') save();
            console.log("<- onKeyDown")
        }

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        }
    }, [changeRecord.index, graphContext.graph, algorithmContext.algorithm]);

    // Ensure the revert button appears when an algorithm AND graph are loaded
    return changeRecord.list.length > 0 && (graphContext.graph || algorithmContext.algorithm) && (
        <div id="edit-overlay" className="absolute inset-0 flex flex-col p-4 pointer-events-none">
            <div className="w-fit mx-auto">
                <p className="p-2 rounded shadow backdrop-blur bg-gradient-to-r from-indigo-500/90 to-blue-500/75 text-white">You're in edit mode</p>
                <button className="block mx-auto pointer-events-auto backdrop-blur-sm hover:font-semibold hover:underline" onClick={revert}>Revert</button>
            </div>
            <div className="mt-auto mb-4">
                <div className="flex space-x-12 w-fit mx-auto">
                    <button className="relative p-1 pointer-events-auto stroke-0 stroke-black hover:stroke-1" onClick={undo}>
                        <ArrowUturnLeftIcon className="w-6 h-6" />
                        <label className="absolute -bottom-2 left-0 text-sm">z</label>
                    </button>
                    <span>{changeRecord.index} / {changeRecord.list.length}</span>
                    <button className="relative p-1 pointer-events-auto stroke-0 stroke-black hover:stroke-1" onClick={redo}>
                        <ArrowUturnRightIcon className="w-6 h-6" />
                        <label className="absolute -bottom-2 right-0 text-sm">y</label>
                    </button>
                </div>
                <button className="block mt-4 mx-auto p-2 rounded-full font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-white ring-indigo-500 pointer-events-auto shadow-sm hover:shadow-lg" onClick={save}>Save Changes</button>
            </div>
        </div>
    );
}
