import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import TabInterface from "interfaces/TabInterface/TabInterface";
import MonacoEditor from '@monaco-editor/react';
import Overlay from "./Overlay"
import TabList from "../../components/Tabs/TabList";
import PrimaryButton from "components/Buttons/PrimaryButton";
import ExitButton from "components/Buttons/ExitButton";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import algorithms from 'data/algorithms.json';
import graphs from 'data/graphs.json';

/**
 * Create button for loading the graph/algorithm  
 * Having it a separate function allows it to return null if tab is null.
 */
function LoadButton({ tab, editorType }) {
    const sharedWorker = useMemo(() => new SharedWorker('./worker.js'), []);
    const [showLoadedMessage, setShowLoadedMessage] = useState(false);  // State for showing the success message
    const [loadError, setLoadError] = useState(''); // State for showing the error message

    // Effect hook to handle keyboard shortcut for loading graph/algorithm
    useEffect(() => {
        function onKeyPress(event) {
            // If user is typing into the editor text area, ignore.
            if (event.target.tagName.toLowerCase() === 'textarea') return;

            // Only if user enters designated keyboard shortcut - l - the graph/algorithm in loaded in
            if (event.key === 'l') load();
        }

        document.addEventListener('keydown', onKeyPress);
        return () => document.removeEventListener('keydown', onKeyPress);
    }, [load]);

    if (!tab) return;

    // loads in a graph/algorithm into a shared worker by sending a message to its port and preparing the necessary data
    function load() {
        try {     
            if (editorType === "Algorithm") {
                sharedWorker.port.postMessage([{
                    'message': 'algo-init',
                    'algorithm': tab.content,
                    'name': tab.name
                }]);
            } else if (editorType === "Graph") {
                sharedWorker.port.postMessage([{
                    'message': 'graph-init',
                    'graph': tab.content,
                    'name': tab.name
                }]);
            }

            // Show the loaded message
            setShowLoadedMessage(true);
            setLoadError(''); // Clear any existing error

            // Hide the message after 3 seconds
            setTimeout(() => {
                setShowLoadedMessage(false);
            }, 3000);

        } catch (e) {
            console.error(e.message);
            setLoadError('Failed to load'); // Set error message
        }
    }

    function clearError() {
        setLoadError(''); // Clear the error message
    }

    return (
        <>
            {/* Conditionally render the loaded message */}
            {showLoadedMessage && (
                <div className="px-2 py-1 mb-3 bg-green-500 rounded-lg text-lg font-semibold text-white text-center">
                    {editorType} loaded
                </div>
            )}

            {/* Persistently display the error message until cleared */}
            {loadError && (
                <div className="px-2 py-1 mb-3 bg-red-500 rounded-lg font-semibold text-white text-center">
                    {loadError}
                    <ExitButton onClick={clearError}>Clear</ExitButton>
                </div>
            )}

            <PrimaryButton onClick={load}>
                <ArrowUpRightIcon className="inline h-4 me-2 stroke-2 stroke-white"/>
                Load {editorType}
            </PrimaryButton>
        </>
    );
}

// Header component responsible for displaying the header section
function Header() {
    return (
        // Header section containing logo and documentation link
        <div className="flex items-start justify-between px-2 pt-1 w-auto h-12 bg-neutral-300">
            <img src="img/galant_full_logo_without_words.svg" alt="logo" className="h-full w-auto"/>

            <PrimaryButton>
                <a target="_blank" href="/documentation.pdf">User Manual</a>
            </PrimaryButton>
        </div>
    )
}

/**
 * Returns the monaco editor
 */
function InnerEditor({tab, editorType, onChange}) {
    return tab && (
        <div className="w-full h-full mt-2">
            <MonacoEditor
                onChange={onChange}
                path={tab.name}
                defaultLanguage={(editorType === "Algorithm") ? "javascript" : "markdown"}
                defaultValue={tab.content}
            />
        </div>
    );
}

/**
 * EditorGroup that defines the tabs list and monaco editor into a component
 */
export default function Editor({ editorType, tabsAtom }) {
    const [tabs, setTabs] = useAtom(tabsAtom); // State for managing tabs
    const selectedTab = TabInterface.getSelectedTab(tabs); // Get the currently selected tab
    const [saved, setSaved] = useState(true); // State for tracking whether changes are saved

    // Handler for editor content change
    function onEditorChange(value) {
        // Update the content of the selected tab
        selectedTab.content = value;

        // Update the tabs state to trigger re-render
        setTabs([...tabs]);

        // Set saved to false
        setSaved(false);
    }

    // Once tabs' value updates, set saved back to true
    useEffect(() => {
        setSaved(true);
    }, [tabs]);

    return (
        <>
            <Header />
            <div className="flex flex-col h-full">
                <TabList tabs={tabs} setTabs={setTabs} examples={(editorType === "Algorithm") ? algorithms : graphs} acceptFileType={(editorType === "Algorithm") ? ".js" : ".txt, .gph, .sgf"} />
                <InnerEditor tab={selectedTab} onChange={onEditorChange} />
                <Overlay tab={selectedTab} saved={saved} editorType={editorType} LoadButton={LoadButton} />
            </div>
        </>
    );
}
