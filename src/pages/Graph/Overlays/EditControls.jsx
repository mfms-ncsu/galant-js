import { React, useEffect } from "react";
import { useAtom } from "jotai";
import { graphAtom, graphTabsAtom, userChangeManagerAtom } from "states/_atoms/atoms";
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

    // Function to save the graph state
    function save() {
        // Get the graph as a JSON object
        const graphData = {
            name: GraphInterface.getFileName(graph) ?? 'New Graph',
            content: GraphInterface.toString(graph),
        };

        //Update the EditorTabs
        setTabs(TabInterface.updateTab(tabs, graphData));
    }

    // Function to revert graph edits (node movements, etc.)
    function revert() {
        let [newGraph, newChangeManager] = GraphInterface.revert(graph, userChangeManager);
        setGraph(newGraph);
        setUserChangeManager(newChangeManager);
    }

    // Function to perform undo operation
    function undo() {
        let [newGraph, newChangeManager] = GraphInterface.undo(graph, userChangeManager);
        setGraph(newGraph);
        setUserChangeManager(newChangeManager);
    }

    // Function to perform redo operation
    function redo() {
        let [newGraph, newChangeManager] = GraphInterface.redo(graph, userChangeManager);
        setGraph(newGraph);
        setUserChangeManager(newChangeManager);
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
    }, [graph]);

    return userChangeManager.changes.length > 0 && (
        <div id="edit-overlay" className="absolute left-0 right-0 bottom-1 flex flex-col items-center pointer-events-none">
            <div className="flex flex-col items-center">
                <div className="flex space-x-6">
                    <button className="relative pointer-events-auto stroke-0 stroke-black hover:stroke-1 transition-all" onClick={undo} data-cy="change-back">
                        <ArrowUturnLeftIcon className="w-6 h-6" />
                        <label className="absolute -bottom-2 left-0 text-sm">z</label>
                    </button>
                    <span>{userChangeManager.index} / {userChangeManager.changes.length}</span>
                    <button className="relative pointer-events-auto stroke-0 stroke-black hover:stroke-1 transition-all" onClick={redo} data-cy="change-forward">
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
