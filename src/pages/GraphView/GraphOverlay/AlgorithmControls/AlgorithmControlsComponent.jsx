import { ArrowLeftIcon, ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useAlgorithmContext } from 'pages/GraphView/utils/AlgorithmContext';
import { useGraphContext } from "pages/GraphView/utils/GraphContext";
import { StringifyGraphSnapshot } from "pages/GraphView/utils/PredicateToFile";
import { applyPositions, roundPositions, extractPositions, transformPositions } from "pages/GraphView/utils/GraphUtils";
import { XCircleIcon } from "@heroicons/react/16/solid";
import { usePromptService } from "pages/GraphView/utils/PromptService";
import SharedWorker from "pages/GraphView/utils/SharedWorker";

/**
 * AlgorithmControls component renders controls for stepping through an algorithm.
 * @returns {JSX.Element} - Returns the JSX for AlgorithmControls component.
 */
export default function AlgorithmControls() {
    // Retrieve algorithm context
    const graphContext = useGraphContext();
    const cytoscapeInstance = graphContext.cytoscape.instance;
    const { algorithm, setAlgorithm } = useAlgorithmContext();
    const PromptService = usePromptService(); 

    // Function to handle pressing the front button
    function frontButtonPress() {
        if (!algorithm || !algorithm.canStepForward) return;
        algorithm.stepForward();
    } 

    // Function to handle pressing the back button
    function backButtonPress() {
        if (!algorithm || !algorithm.canStepBack) return;
        algorithm.stepBack();
    }

    function exportGraph() {
        if (algorithm.currentIndex <= 0) return;
        const algorithmSnapshot = algorithm.steps[algorithm.currentIndex];
        const graphSnapshot = algorithmSnapshot.graph;
        const positions = extractPositions(graphSnapshot);
        const transformedPositions = transformPositions(positions, 1 / graphSnapshot.scalar);
        const finalPositions = roundPositions(transformedPositions);
        const finalGraph = applyPositions(graphSnapshot, finalPositions);

        const content = StringifyGraphSnapshot(finalGraph);
        const blob = new Blob([content], { type: 'text/plain' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = algorithmSnapshot.graph.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function terminateAlgorithm() {
        const positions = {};
        for (const node of cytoscapeInstance.nodes()) {
            positions[node.id()] = node.position();
        }
        const newGraph = applyPositions(graphContext.baseGraph, positions);

        // Only prompt to save nodes if the algorithm isn't the one that moved them
        if (algorithm.configuration.controlNodePosition) {
            setAlgorithm(null);
            return;
        }

        // Prompt for confirmation of saving nodes
        const saveGraph = PromptService.addPrompt({
            type: "confirmation",
            message: "Save node positions to editor?",
            confirmationText: "Save",
            cancelPrompt: "Don't Save"
        }, confirmed => {
            if (confirmed) {
                SharedWorker.saveGraph(newGraph);
            }
            graphContext.setBaseGraph(newGraph);
            setAlgorithm(null);
        });
    }

    // Effect hook to handle keyboard shortcuts for stepping through algorithm
    useEffect(() => {
        function handleKeyPress(event) {
            // If user is typing into an input field, ignore.
            if (event.target.tagName.toLowerCase() === 'input') return;
            // Left Arrow to step back in the algorithm
            if (event.key === 'ArrowLeft') backButtonPress();
            // Right arrow to step forward in the algorithm
            else if (!event.metaKey && event.key === 'ArrowRight') frontButtonPress();
            // Esc key to terminate algorithm
            else if (event.key === 'Escape') terminateAlgorithm();
            // S Key to export graph
            else if (event.key === 's') exportGraph();
            // Cmd + Right arrow to skip to end of the algorithm
            else if (event.metaKey && event.key === 'ArrowRight') algorithm.skipToEnd();
        }

        document.addEventListener('keydown', handleKeyPress, true)

        
        return () => document.removeEventListener('keydown', handleKeyPress, true);
    }, [algorithm]);

    // Return if no algorithm is available
    if (!algorithm) return null;

    // Make the step text
    const stepText = `Step ${algorithm.currentIndex}` + (algorithm.completed ? ` / ${algorithm.steps.length - 1}` : '');

    
    return (
        <div id="algorithm-controls" className="relative mt-auto mb-2">
            <div className="flex justify-center items-center space-x-1">
                <div />
                <p id="algorithm-name" className="text-lg text-gray-500 whitespace-nowrap">{algorithm.name}</p>
                <XCircleIcon id="terminate-algorithm" onClick={terminateAlgorithm} className="h-5 fill-gray-500 pointer-events-auto cursor-pointer hover:fill-black"/>
            </div>
            
            <div className="flex justify-center items-center space-x-4 mt-auto">
                <button id="step-back" className="h-12 w-12 p-3 rounded bg-blue-300 pointer-events-auto disabled:opacity-75" disabled={!algorithm.canStepBack()} onClick={() => backButtonPress()}>
                    <ArrowLeftIcon className="fill-white stroke-1 stroke-white" />
                </button>
                
                <p className="p-4 px-6 bg-gray-200 text-2xl pointer-events-auto">{stepText}</p>
                <button id="step-forward" className={`relative h-12 w-12 p-3 rounded bg-blue-300 pointer-events-auto disabled:opacity-75 ${algorithm.fetchingSteps && 'cursor-progress'}`} disabled={!algorithm.canStepForward()} onClick={() => frontButtonPress()}>
                    {!algorithm.fetchingSteps ?
                        <ArrowRightIcon className="fill-white stroke-1 stroke-white"/>
                    :
                        <ArrowPathIcon className="fill-gray-500 animate-spin"/>
                    }
                </button>
            </div>


            <button id="export-graph" className={`${(algorithm.currentIndex <= 0 || !algorithm.configuration.controlNodePosition) && 'hidden'} absolute bottom-0 right-0 py-2 px-4 bg-gradient-to-r from-indigo-500 to-blue-500 shadow rounded-full font-semibold text-white pointer-events-auto`} onClick={exportGraph}>Export Graph</button>
            <button id="skip-to-end" className="h-120 w-120 p-3 rounded bg-green-100 pointer-events-auto" disabled={!algorithm.canStepForward()} onClick={() => algorithm.skipToEnd()}>Skip to End</button>
        </div>
    );
}