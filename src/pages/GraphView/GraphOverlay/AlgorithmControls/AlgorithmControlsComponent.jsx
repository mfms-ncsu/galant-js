import { ArrowLeftIcon, ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useAlgorithmContext } from 'pages/GraphView/utils/AlgorithmContext';
import { XCircleIcon } from "@heroicons/react/16/solid";
import Graph from "graph/Graph";

/**
 * AlgorithmControls component renders controls for stepping through an algorithm.
 * @returns {JSX.Element} - Returns the JSX for AlgorithmControls component.
 */
export default function AlgorithmControls() {
    // Retrieve algorithm context
    const { algorithm, setAlgorithm } = useAlgorithmContext();

    const [debug, setDebug] = useState(false);
    const [stepText, setStepText] = useState("Step 0");
    
    /**
     * Updates the text in the step counter to show the current
     * algorithm step
     */
    function updateStepText() {
        setStepText(`Step ${algorithm.getStepNumber()}` + (algorithm.completed ? ` / ${algorithm.getTotalSteps()}` : ''));
    }
    
    // Function to handle pressing the forward button
    function frontButtonPress() {
        if (!algorithm || !algorithm.canStepForward()) return;
        algorithm.stepForward();
        setTimeout(updateStepText, 10); // A timeout is required to
                                        // fix a race condition
    } 

    // Function to handle pressing the backward button
    function backButtonPress() {
        if (!algorithm || !algorithm.canStepBack()) return;
        algorithm.stepBack();
        setTimeout(updateStepText, 10);
    }

    /**
     * Function to export the graph to a file using the File System Access API on Chrome based browser.
     */
    async function exportGraph() {
        if (window.showSaveFilePicker) {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: 'graph.gph',
                types: [
                    {
                        description: 'Graph Files',
                        accept: {'text/plain': ['.gph']},
                    },
                ],
            });
            const writableStream = await fileHandle.createWritable();
            const content = Graph.toGraphString();
            await writableStream.write(content);
            await writableStream.close();
        } else {
            await exportGraphFallback();
        }
    }

    /**
     * Fallback function to export the graph if the browser does not support the 
     * File System Access API(This API only supported by chrome and edge).
     */
    async function exportGraphFallback() {
        // Prompt user for the desired file name, defaulting to "graph.gph"
        const fileName = window.prompt("Enter the filename to save:", "graph.gph");

        // Check if the user cancelled the prompt
        if (!fileName) {
            return; // Exit the function if the user cancelled
        }

        const content = Graph.toGraphString();
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Toggles the debug mode of algorithm execution, which allows
     * the user to step through individual actions inside a "step"
     * function
     */
    function debugMode() {
        if (algorithm) {
            algorithm.toggleDebugMode();
            setDebug(algorithm.debugMode);
        }
    }

    function terminateAlgorithm() {
        // Set the algorithm to null
        setAlgorithm(null);

        // Undo all changes made by the algorithm
        Graph.algorithmChangeManager.revert();
        Graph.algorithmChangeManager.clear();
    }

    // Effect hook to handle keyboard shortcuts for stepping through the algorithm
    useEffect(() => {
        function handleKeyPress(event) {
            if (event.target.tagName.toLowerCase() === 'input') return;
            if (event.key === 'ArrowLeft') backButtonPress();
            else if (!event.metaKey && event.key === 'ArrowRight') frontButtonPress();
            else if (event.key === 'x') terminateAlgorithm();
            else if (event.key === 's') exportGraph();
            else if (event.key === '1') debugMode();
            else if (event.metaKey && event.key === 'ArrowRight') algorithm.skipToEnd();
        }

        document.addEventListener('keydown', handleKeyPress, true)
        return () => document.removeEventListener('keydown', handleKeyPress, true);
    }, [algorithm]);

    // Return if no algorithm is available
    if (!algorithm) return null;

    // Create the step text

    return (
        <div>
            <div id="algorithm-controls" className="absolute bottom-1 left-1 mt-auto mb-2">
                <div className="flex justify-center items-center space-x-1">
                    <p id="algorithm-name" className="text-black whitespace-nowrap">{algorithm.name}</p>
                </div>

                <div className="flex justify-center items-center space-x-1">
                    <p className='text-black whitespace-nowrap' hidden={!debug}>DEBUG MODE - Press 1 to toggle </p>
                </div>
                <div className="flex justify-center items-center space-x-4 mt-auto">
                    <button id="step-back" className="h-8 w-8 p-3 rounded bg-blue-300 pointer-events-auto disabled:opacity-75" disabled={!algorithm.canStepBack()} onClick={() => backButtonPress()}>
                        <ArrowLeftIcon className="fill-black stroke-1 stroke-black" />
                    </button>
                
                    <p className="p-2 px-3 bg-gray-200 pointer-events-auto">{stepText}</p>
                    <button id="step-forward" className={`relative h-8 w-8 p-3 rounded bg-blue-300 pointer-events-auto disabled:opacity-75 ${algorithm.fetchingSteps && 'cursor-progress'}`} disabled={!algorithm.canStepForward()} onClick={() => frontButtonPress()}>
                        {!algorithm.fetchingSteps ?
                            <ArrowRightIcon className="fill-black stroke-1 stroke-black"/>
                        :
                            <ArrowPathIcon className="fill-gray-500 animate-spin"/>
                        }
                    </button>
                </div>
            </div>

            <div className="absolute bottom-1 right-1">
                <button id="export-graph" className={`${algorithm.currentIndex <= 0 && 'hidden'} absolute bottom-20 right-0 py-2 px-4 bg-gradient-to-r from-indigo-500 to-blue-500 shadow rounded-full font-semibold text-white pointer-events-auto`} onClick={exportGraph}>Export Graph</button>

                <button id="terminate-algorithm" className="flex items-center h-6 w-15 space-x-4 px-2 py-1 bg-red-100 text-black rounded shadow-lg hover:bg-gray-300 cursor-alias">
                    <label><span>Exit (x)</span></label>
                    <XCircleIcon id="terminate-algorithm" onClick={terminateAlgorithm} className="h-5 fill-gray-500 pointer-events-auto cursor-pointer hover:fill-black"/>
                </button>

                <button id="skip-to-end" className="h-6 w-15 p-1 rounded bg-green-100 pointer-events-auto" disabled={!algorithm.canStepForward()} onClick={() => algorithm.skipToEnd()}>Skip to End</button>
            </div>
        </div>
    );
}
