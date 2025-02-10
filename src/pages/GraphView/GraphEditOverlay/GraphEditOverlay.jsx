import { React, useEffect, useRef, useState } from "react";
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from "@heroicons/react/24/solid";
import Graph from "graph/Graph";

/**
 * GraphEditOverlay component represents an overlay for editing graph with functionalities like undo, redo, save, and revert.
 * @param {Object} props - The props for the GraphEditOverlay component.
 * @returns {JSX.Element} - Returns the JSX for GraphEditOverlay component.
 */
export default function GraphEditOverlay({ setMode }) {
    // useRef to hold a reference to a SharedWorker instance
    const sharedworkerContainer = useRef();
    sharedworkerContainer.sharedworker = new SharedWorker("./worker.js");

    // Function to save the graph state
    function save() {
        // Get the graph as a JSON object
        const graphData = {
            name: "Saved Graph",
            content: Graph.toGraphString(),
        };

        const storageItem = localStorage.getItem(`GraphFiles`); // Get the existing local storage
        const dataList = (storageItem) ? JSON.parse(storageItem) : []; // Parse it
        
        // Attempt to overwrite the existing graph
        let added = false;
        dataList.forEach((graph, i) => {
            if (graph.name === graphData.name) {
                dataList[i] = graphData;
                added = true;
            }
        });

        // If there isn't one, save it
        !added && dataList.push(graphData);

        localStorage.setItem(`GraphFiles`, JSON.stringify(dataList)); // Set the local storage


    }

    // Function to revert graph edits (node movements, etc.)
    function revert() {
        Graph.userChangeManager.revert();
        setMode("revert");
    }

    // Function to perform undo operation
    function undo() {
        Graph.userChangeManager.undo();
        setMode("undo");
    }

    // Function to perform redo operation
    function redo() {
        Graph.userChangeManager.redo();
    }

    // Add event listener for keyboard shortcuts
    useEffect(() => {
        function onKeyDown(event) {
            const key = event.key;
            if (event.target.tagName.toLowerCase() === "input") return;

            if (key === "z") undo();
            else if (key === "y") redo();
            else if (key === "r") revert();
            else if (key === "s") save();
        }

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        }
    }, []);

    const [index, setIndex] = useState(0);
    const [length, setLength] = useState(0);
    window.updateStep = () => {
        let newIndex = Graph.userChangeManager.getIndex();
        let newLength = Graph.userChangeManager.getLength();
        setIndex(newIndex);
        setLength(newLength);
    };


    return length > 0 && (
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
                    <span>{index} / {length}</span>
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
