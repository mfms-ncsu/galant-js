import { React, useEffect, useRef } from 'react';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from "@heroicons/react/24/solid";
import GraphEditHistory from "../utils/GraphEditHistory";
import { useGraphContext } from "../utils/GraphContext";
import { useAlgorithmContext } from "../utils/AlgorithmContext";
import { StringifyGraphSnapshot } from '../utils/PredicateToFile';
import { saveGraph } from '../utils/SharedWorker';

/**
 * GraphEditOverlay component represents an overlay for editing graph with functionalities like undo, redo, save, and revert.
 * @param {Object} props - The props for the GraphEditOverlay component.
 * @param {GraphEditHistory} props.graphEditHistory - An instance of GraphEditHistory to track graph edits.
 * @returns {JSX.Element} - Returns the JSX for GraphEditOverlay component.
 */
export default function GraphEditOverlay({graphEditHistory}) {
    // useRef to hold a reference to a SharedWorker instance
    const sharedworkerContainer = useRef();        
    sharedworkerContainer.sharedworker = new SharedWorker('./worker.js');

    // useContext gets access graph and algorithm contexts
    const graphContext = useGraphContext();
    const algorithmContext = useAlgorithmContext();

    // Function to save the graph state
    function save() {
        console.log("setting base graph");
        if (graphEditHistory.current <= 0) { // Trying to save base graph..
            graphEditHistory.revert();
            return;
        }
        graphContext.setBaseGraph(graphEditHistory.getCurrentSnapshot()); // Setting the base graph will automatically reset the edit history.
        
        let newGraphText = StringifyGraphSnapshot(graphEditHistory.getCurrentSnapshot());
        // Communicate with shared worker
        saveGraph(graphEditHistory.getCurrentSnapshot());
    }

    // Function to revert graph edits
    function revert() {
        graphEditHistory.revert(); 
    }

    // Function to perform undo operation
    function undo() {
        graphEditHistory.undo();
    }

    // Function to perform redo operation
    function redo() {
        graphEditHistory.redo();
    }

    // Effect hook to handle keyboard shortcuts for undo, redo, revert, and save
    useEffect(() => {
        if (graphEditHistory.history.length <= 1 || algorithmContext.algorithm) return;
        function onKeyDown(event) {
            const key = event.key;
            if (event.target.tagName.toLowerCase() === 'input') return; // If user is typing into an input field, ignore.

            if (key === 'z') undo();
            else if (key === 'y') redo();
            else if (key === 'r') revert();
            else if (key === 's') save();
        }

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        }
    }, [graphEditHistory])

    
    return graphEditHistory.history.length > 1 && !algorithmContext.algorithm && (
        <div id="edit-overlay" className="absolute inset-0 flex flex-col p-4 pointer-events-none">
            <div className="w-fit mx-auto">
                <p className="p-2 rounded shadow backdrop-blur bg-gradient-to-r from-indigo-500/90 to-blue-500/75 text-white">You're in edit mode</p>
                <button className="block mx-auto pointer-events-auto backdrop-blur-sm hover:font-semibold hover:underline" onClick={revert}>Revert</button>
            </div>

            <div className="mt-auto mb-4">
                <div className="flex space-x-12 w-fit mx-auto">
                    <button className="relative p-1 pointer-events-auto stroke-0 stroke-black hover:stroke-1" onClick={undo}>
                        <ArrowUturnLeftIcon className="w-6 h-6"/>
                        <label className="absolute -bottom-2 left-0 text-sm">z</label>
                    </button>
                    <span>{graphEditHistory.current} / {graphEditHistory.history.length - 1}</span>
                    <button className="relative p-1 pointer-events-auto stroke-0 stroke-black hover:stroke-1" onClick={redo}>
                        <ArrowUturnRightIcon className="w-6 h-6"/>
                        <label className="absolute -bottom-2 right-0 text-sm">y</label>
                    </button>
                </div>
                <button className="block mt-4 mx-auto p-2 rounded-full font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-white ring-indigo-500 pointer-events-auto shadow-sm hover:shadow-lg" onClick={save}>Save Changes</button>
            </div>
        </div>
    )
}
