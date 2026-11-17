import WelcomeDialog from "components/Accessibility/WelcomeDialog";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import { useEffect, useRef } from "react";
import { useAtom, getDefaultStore } from "jotai";
import { algorithmAtom, algorithmChangeManagerAtom, userChangeManagerAtom, graphAtom, promptQueueAtom, gskCurrentNodeIdAtom, gskNavigationResetAtom } from "states/_atoms/atoms";
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
import GskExplorer from "components/Accessibility/GskExplorer";

/**
 * Graph component is responsible for rendering and managing the main view of the application.
 * This component handles loading new graph and algorithm objects into the state variables.
 */
export default function Graph() {
    // Define state variables using React hooks
    const [, setGskCurrentNodeId] = useAtom(gskCurrentNodeIdAtom);
    const [, resetGskNavigation] = useAtom(gskNavigationResetAtom);
    const sentAliveMessage = useRef();
    useEffect(() => {
        const store = getDefaultStore();

        /**
         * Starts the selected algorithm.
         * @author Henry Tavares
         */
        function startAlgorithm(name, code) {
            const nextAlgorithm = new Algorithm(name, code);
            store.set(algorithmAtom, nextAlgorithm);
            store.set(algorithmChangeManagerAtom, new ChangeManager());
            nextAlgorithm.start();
        }

        /**
         * Reports a file-loading error.
         * @author Henry Tavares
         */
        function reportLoadError() {
            store.set(promptQueueAtom, [{
                data: { type: "algorithmError", errorObject: new Error("Could not load this file."), algorithmCode: "" },
                callback: () => {}
            }]);
        }

        function onGraphLoad(data) {
            if (!data.payload) {
                return;
            }
            try {
                const nextGraph = FileParser.loadGraph(data.name, data.payload);
                const selectedAlgorithm = store.get(algorithmAtom);
                AlgorithmInterface.stop();
                store.set(promptQueueAtom, []);
                store.set(graphAtom, nextGraph);
                store.set(userChangeManagerAtom, new ChangeManager());
                store.set(algorithmChangeManagerAtom, new ChangeManager());
                resetGskNavigation(value => value + 1);
                setGskCurrentNodeId(null);
                if (selectedAlgorithm) {
                    startAlgorithm(selectedAlgorithm.name, selectedAlgorithm.code);
                }
                SpeechInterface.interruptAndSpeak("Graph loaded. " + data.name);
                setTimeout(() => Cytoscape.fit(Cytoscape.elements(), 100), 25);
            } catch (error) {
                reportLoadError();
            }
        }

        function onAlgorithmLoad(data) {
            try {
                AlgorithmInterface.revert();
                store.set(promptQueueAtom, []);
                startAlgorithm(data.name, data.payload);
                SpeechInterface.interruptAndSpeak("Algorithm loaded. " + data.name);
            } catch (error) {
                reportLoadError();
            }
        }

        SharedWorker.on("graph-init", onGraphLoad);
        SharedWorker.on("graph-rename", onGraphLoad);
        SharedWorker.on("algo-init", onAlgorithmLoad);
        /**
         * Reads feedback from an editor window.
         * @author Henry Tavares
         */
        function onLoadError(data) {
            SpeechInterface.interruptAndSpeak(data.payload);
        }
        SharedWorker.on("load-error", onLoadError);
        SharedWorker.on("ui-feedback", onLoadError);
        if (!sentAliveMessage.current) {
            sentAliveMessage.current = true;
            SharedWorker.postMessage({ message: "alive" });
        }
        return () => {
            SharedWorker.remove(onGraphLoad, onAlgorithmLoad, onLoadError);
            AlgorithmInterface.stop();
        };
    }, [resetGskNavigation, setGskCurrentNodeId]);

    return (
        <>
            <link rel="manifest" id="manifest-placeholder" href="./manifest.webmanifest" />
            <Header />
            <WelcomeDialog />
            <div className="relative w-full h-full">
                <PromptComponent />
                <CytoscapeComponent />
                <GskExplorer />
                <AlgorithmControls />
                <EditControls />
                <ContextMenu />
                <NodeContextMenu />
                <EdgeContextMenu />
            </div>
        </>
    );
}
