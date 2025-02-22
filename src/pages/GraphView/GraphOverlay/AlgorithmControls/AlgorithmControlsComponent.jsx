import { ArrowLeftIcon, ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import PrimaryButton from "components/Buttons/PrimaryButton";
import SecondaryButton from "components/Buttons/SecondaryButton";
import ExitButton from "components/Buttons/ExitButton";
import { useEffect, useState } from "react";
import { useAlgorithmContext } from 'pages/GraphView/utils/AlgorithmContext';
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

    /**
     * Method called when the "Skip to end" button is clicked
     */
    function skipToEnd() {
        algorithm.skipToEnd();
        setTimeout(updateStepText, 10);
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

    return (
        <div className="absolute left-0 bottom-0 w-full p-1 flex flex-row items-center justify-between">
            <div className="flex flex-col items-center bg-white rounded-lg font-semibold text-lg">
                <p className='text-black whitespace-nowrap' hidden={!debug}>DEBUG MODE (1)</p>
                <p id="algorithm-name" className="text-black whitespace-nowrap">{algorithm.name}</p>
                <div className="flex justify-center items-center space-x-4 mt-1">
                    <PrimaryButton onClick={() => backButtonPress()}>
                        <ArrowLeftIcon className="h-5 fill-white stroke-1 stroke-white" />
                    </PrimaryButton>
                    <p className="select-none">{stepText}</p>
                    <PrimaryButton onClick={() => frontButtonPress()}>
                        {!algorithm.fetchingSteps ?
                            <ArrowRightIcon className="h-5 fill-white stroke-1 stroke-white"/>
                        :
                            <ArrowPathIcon className="h-5 fill-white stroke-1 stroke-white animate-spin"/>
                        }
                    </PrimaryButton>
                </div>
            </div>
                <PrimaryButton onClick={exportGraph}>Export Graph (s)</PrimaryButton>
                <ExitButton onClick={terminateAlgorithm}>Exit (x)</ExitButton>
                <SecondaryButton onClick={skipToEnd}>Skip to End</SecondaryButton>
            </div>
        </div>
    );
}
