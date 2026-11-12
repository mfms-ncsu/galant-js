import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import { React, useEffect } from "react";
import shortcuts, { matchesShortcut, shortcutLabel, shortcutHint } from "config/keyboardShortcuts";
import { useAtom } from "jotai";
import { graphAtom, graphTabsAtom, userChangeManagerAtom, speechSpeedAtom } from "states/_atoms/atoms";
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from "@heroicons/react/24/solid";

import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import PrimaryButton from "components/Buttons/PrimaryButton";
import TabInterface from "interfaces/TabInterface/TabInterface";

/**
 * GraphEditOverlay component represents an overlay for editing graph with 
 * functionalities like undo, redo, save, and revert.
 */
export default function EditControls() {
    const [graph, setGraph] = useAtom(graphAtom);
    const [tabs, setTabs] = useAtom(graphTabsAtom);
    const [userChangeManager, setUserChangeManager] = useAtom(userChangeManagerAtom);
    const [, setSpeechSpeed] = useAtom(speechSpeedAtom);

    // Function to save the graph state
    function save() {
        // Get the graph as a JSON object
        const graphData = {
            name: GraphInterface.getFileName(graph) ?? 'New Graph',
            content: GraphInterface.toString(graph),
        };

        //Update the EditorTabs
        setTabs(TabInterface.updateTab(tabs, graphData));
        SpeechInterface.interruptAndSpeak("Graph copied to the editor. Download it there to save a file.");
        // !!! solved the problem of not updating correctly !!!
        window.open('/grapheditor', 'Graph Editor', `width=${window.screen.width / 2}, height=${window.screen.height}`);
    }

    // Function to revert graph edits (node movements, etc.)
    function revert() {
        let [newGraph, newChangeManager] = GraphInterface.revert(graph, userChangeManager);
        setGraph(newGraph);
        setUserChangeManager(newChangeManager);
        SpeechInterface.interruptAndSpeak("Graph edits reverted.");
    }

    // Function to perform undo operation
    function undo() {
        if (userChangeManager.index === 0) {
            SpeechInterface.interruptAndSpeak("No edit to undo.");
            return;
        }
        let [newGraph, newChangeManager] = GraphInterface.undo(graph, userChangeManager);
        setGraph(newGraph);
        setUserChangeManager(newChangeManager);
        SpeechInterface.interruptAndSpeak("Edit undone.");
    }

    // Function to perform redo operation
    function redo() {
        if (userChangeManager.index >= userChangeManager.changes.length) {
            SpeechInterface.interruptAndSpeak("No edit to redo.");
            return;
        }
        let [newGraph, newChangeManager] = GraphInterface.redo(graph, userChangeManager);
        setGraph(newGraph);
        setUserChangeManager(newChangeManager);
        SpeechInterface.interruptAndSpeak("Edit restored.");
    }

    // Increase speech speed up to 4.5x.
    function increaseSpeechSpeed() {
        setSpeechSpeed(currentSpeed => Math.min(currentSpeed + 0.25, 10));
    }

    // Decrease speech speed down to 1x.
    function decreaseSpeechSpeed() {
        setSpeechSpeed(currentSpeed => Math.max(currentSpeed - 0.25, 0.25));
    }

    // Add event listener for keyboard shortcuts
    useEffect(() => {
        function onKeyDown(event) {
            if (matchesShortcut(event, shortcuts.undo)) {
                undo();
            } else if (matchesShortcut(event, shortcuts.redo)) {
                redo();
            } else if (matchesShortcut(event, shortcuts.revertGraph)) {
                revert();
            } else if (matchesShortcut(event, shortcuts.saveGraph)) {
                save();
            } else if (matchesShortcut(event, shortcuts.increaseSpeechSpeed)) {
                increaseSpeechSpeed();
            } else if (matchesShortcut(event, shortcuts.decreaseSpeechSpeed)) {
                decreaseSpeechSpeed();
            } else {
                return;
            }
            event.preventDefault();
        }

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        }
    }, [graph]);

    return userChangeManager.changes.length > 0 && (
        <div id="edit-overlay" className="absolute left-0 right-0 bottom-1 flex flex-col items-center pointer-events-none">
            <div className="flex flex-col items-center">
                <div className="flex space-x-6">
                    <button className="relative pointer-events-auto stroke-0 stroke-black hover:stroke-1 transition-all" onClick={undo} data-cy="change-back">
                        <ArrowUturnLeftIcon className="w-6 h-6" />
                        <label className="absolute -bottom-2 left-0 text-sm">{shortcutLabel(shortcuts.undo)}</label>
                    </button>
                    <span>{userChangeManager.index} / {userChangeManager.changes.length}</span>
                    <button className="relative pointer-events-auto stroke-0 stroke-black hover:stroke-1 transition-all" onClick={redo} data-cy="change-forward">
                        <ArrowUturnRightIcon className="w-6 h-6" />
                        <label className="absolute -bottom-2 right-0 text-sm">{shortcutLabel(shortcuts.redo)}</label>
                    </button>
                </div>
                <div className="flex w-fit mt-4 gap-x-4">
                    <PrimaryButton onClick={revert}>Revert{shortcutHint(shortcuts.revertGraph)}</PrimaryButton>
                    <PrimaryButton onClick={save}>Save Changes{shortcutHint(shortcuts.saveGraph)}</PrimaryButton>
                </div>
            </div>
        </div>
    );
}
