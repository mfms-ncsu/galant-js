import { useEffect, useMemo, useRef, useState } from "react";
import MonacoEditor from '@monaco-editor/react';
import Overlay from "./Overlay"
import TabList from "../../components/Tabs/TabList";
import PrimaryButton from "components/Buttons/PrimaryButton";
import ExitButton from "components/Buttons/ExitButton";
import { addTab, getSelectedTab } from "../../components/Tabs/TabUtils";
import algorithms from 'data/algorithms.json';
import graphs from 'data/graphs.json';
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";

/**
 * Create button for loading the graph/algorithm  
 * Having it a separate function allows it to return null if tab is null. Maintains readability.
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
    )
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
 * Returns the editor
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
    )
}

/**
 * EditorGroup for the algorithm page that defines the tabs list and monaco editor into a component
 */
export default function Editor({ editorType }) {
    const [tabs, setTabs] = useState([]); // State for managing tabs
    const selectedTab = getSelectedTab(tabs); // Get the currently selected tab
    const [saved, setSaved] = useState(true); // State for tracking whether changes are saved
    const hasFetched = useRef(); // Ref for tracking whether data has been fetched from localStorage

    // Handler for editor content change
    function onEditorChange(value, event) {
        // Update the content of the selected tab
        selectedTab.content = value;
        // Update the tabs state to trigger re-render
        setTabs([...tabs]);
    }

    useEffect(() => {
        // This prevents double loading of tabs during strict mode
        if (hasFetched.current) return; // If data has been fetched, exit early
        hasFetched.current = true; // Mark that data has been fetched
        const storageItem = localStorage.getItem(`${editorType}Files`); // Get saved data from localStorage
        if (!storageItem) return; // If no data found, exit early

        const dataList = JSON.parse(storageItem); // Parse the stored JSON data

        setTabs(prevTabs => {
            console.log("PREV TABS", prevTabs); // Log previous tabs
            // Add tabs from stored data to the previous tabs
            for (let data of dataList) {
                addTab(data, prevTabs, setTabs, true);
            }

            return [...prevTabs]; // Return a new array to trigger re-render
        })
    }, []);

    useEffect(() => {
        function saveToStorage() {
            const dataList = [];
            for (const tab of tabs) {
                dataList.push({name: tab.name, content: tab.content});
            }
            
            localStorage.setItem(`${editorType}Files`, JSON.stringify(dataList));
            setSaved(true);
        }

        if (tabs.length <= 0) {
            addTab({name: `New ${editorType}`}, tabs, setTabs);
        }

        setSaved(false); // Set to false to inform 'saving' is occurring 
        const timeOut = setTimeout(saveToStorage, 500); // If 'tab's doesn't change for 2 sec, tabs will be saved.

        return () => clearTimeout(timeOut);//If tabs changes, this function will be called.
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
    )
}
