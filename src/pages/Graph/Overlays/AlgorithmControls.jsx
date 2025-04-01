import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { algorithmAtom, algorithmChangeManagerAtom, graphAtom, promptQueueAtom } from "states/_atoms/atoms";
import AlgorithmInterface from "interfaces/AlgorithmInterface/AlgorithmInterface";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import ChangeManager from "states/ChangeManager/ChangeManager";
import { ArrowLeftIcon, ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import PrimaryButton from "components/Buttons/PrimaryButton";
import SecondaryButton from "components/Buttons/SecondaryButton";
import ExitButton from "components/Buttons/ExitButton";

/**
 * AlgorithmControls component renders controls for stepping through an algorithm.
 */
export default function AlgorithmControls() {
    const [graph] = useAtom(graphAtom);
    const [algorithmChangeManager, setAlgorithmChangeManager] = useAtom(algorithmChangeManagerAtom);
    const [algorithm, setAlgorithm] = useAtom(algorithmAtom);
    const [_, setPromptQueue] = useAtom(promptQueueAtom);
    const [debug, setDebug] = useState(false);

    /**
     * Function to export the graph to a file using the File System Access API 
     * on Chrome based browser.
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
            const content = GraphInterface.toString(graph);
            await writableStream.write(content);
            await writableStream.close();
        } else {
            await exportGraphFallback();
        }
    }

    /**
     * Fallback function to export the graph if the browser does not support the 
     * File System Access API (This API is only supported by chromium browsers).
     */
    async function exportGraphFallback() {
        // Prompt user for the desired file name, defaulting to "graph.gph"
        // TODO: Fix this
        // For some reason, the graph in this method is just a
        // default graph. It has no nodes, no header comments, it's
        // just what gets returned when you call new Graph(). Even when
        // there is an actual graph loaded.
        //
        // No idea why. If you start running an algorithm, though, it
        // then loads the correct graph, and will save it as expected.
        const fileName = window.prompt("Enter the filename to save:", "graph.gph");

        // Check if the user cancelled the prompt
        if (!fileName) {
            return; // Exit the function if the user cancelled
        }

        const content = GraphInterface.toString(graph);
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
            let newAlgorithm = AlgorithmInterface.toggleDebugMode(algorithm);
            setAlgorithm(newAlgorithm);
            setDebug(algorithm.debugMode);
        }
    }

    // Function to handle pressing the forward button
    function frontButtonPress() {
        if (!algorithm || !AlgorithmInterface.canStepForward(algorithm)) return;
        AlgorithmInterface.stepForward(algorithm);
    } 

    // Function to handle pressing the backward button
    function backButtonPress() {
        if (!algorithm || !AlgorithmInterface.canStepBack()) return;
        AlgorithmInterface.stepBack(algorithm);
    }

    // Kills the algorithm
    function terminateAlgorithm() {
        // Remove any prompts the algorithm had up
        setPromptQueue([]);
    
        // Tell the algorithm to undo all changes
        AlgorithmInterface.revert();

        // Set the algorithm to null and reset its changeManager
        setAlgorithm(null);
        setAlgorithmChangeManager(new ChangeManager());
    }

    // Effect hook to handle keyboard shortcuts for stepping through the algorithm
    useEffect(() => {
        function handleKeyPress(event) {
            if (event.target.tagName.toLowerCase() === 'input') return;
            if (event.key === 'ArrowLeft') backButtonPress();
            else if (!event.metaKey && event.key === 'ArrowRight') frontButtonPress();
            else if (event.key === 'Escape') terminateAlgorithm();
            else if (event.key === 'x') exportGraph();
            else if (event.key === '1') debugMode();
        }

        document.addEventListener('keydown', handleKeyPress, true)
        return () => document.removeEventListener('keydown', handleKeyPress, true);
    }, [graph, algorithm]);

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
                    <p className="select-none">Step {algorithmChangeManager.index}</p>
                    <PrimaryButton onClick={() => frontButtonPress()}>
                        {!algorithm.fetchingSteps ?
                            <ArrowRightIcon className="h-5 fill-white stroke-1 stroke-white"/>
                        :
                            <ArrowPathIcon className="h-5 fill-white stroke-1 stroke-white animate-spin"/>
                        }
                    </PrimaryButton>
                </div>
            </div>

            <div className="space-y-1">
                <PrimaryButton onClick={exportGraph}>Export Graph (x)</PrimaryButton>
                <ExitButton onClick={terminateAlgorithm}>Exit (esc)</ExitButton>
            </div>
        </div>
    );
}
