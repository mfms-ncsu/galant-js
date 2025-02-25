import { React, useEffect, useRef, useState } from "react";
import PrimaryButton from "components/Buttons/PrimaryButton";
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from "@heroicons/react/24/solid";
import Graph from "utils/graph/Graph";

/**
 * GraphEditOverlay component represents an overlay for editing graph with functionalities like undo, redo, save, and revert.
 * @param {Object} props - The props for the GraphEditOverlay component.
 * @returns {JSX.Element} - Returns the JSX for GraphEditOverlay component.
 */
export default function EditControls() {
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
    }

    // Function to perform undo operation
    function undo() {
        Graph.userChangeManager.undo();
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
        <div id="edit-overlay" className="absolute left-0 right-0 bottom-1 flex flex-col items-center pointer-events-none">
            <div className="flex flex-col items-center">
                <div className="flex space-x-6">
                    <button className="relative pointer-events-auto stroke-0 stroke-black hover:stroke-1 transition-all" onClick={undo}>
                        <ArrowUturnLeftIcon className="w-6 h-6" />
                        <label className="absolute -bottom-2 left-0 text-sm">z</label>
                    </button>
                    <span>{index} / {length}</span>
                    <button className="relative pointer-events-auto stroke-0 stroke-black hover:stroke-1 transition-all" onClick={redo}>
                        <ArrowUturnRightIcon className="w-6 h-6" />
                        <label className="absolute -bottom-2 right-0 text-sm">y</label>
                    </button>
                </div>
                <div className="flex w-fit mt-4 gap-x-4">
                    <PrimaryButton onClick={revert}>Revert</PrimaryButton>
                    <PrimaryButton onClick={save}>Save Changes</PrimaryButton>
                </div>
            </div>
        </div>
    );
}
