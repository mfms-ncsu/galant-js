/**
 * @fileoverview Defines the editor group for Algorithm
 * @author Julian Madrigal
 * @author Vitesh Kambara
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Editor from '@monaco-editor/react';
import EditorOverlayComponent from "../../components/Editor/EditorOverlay"
import TabListComponent from "../../components/Editor/TabListComponent";
import { addTab, getSelectedTab } from "../../components/Editor/TabUtils";
import examples from './Examples.json';
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";

/**
 * @typedef {import("components/Editor/TabComponent").Tab} Tab
 */

/**
 * Create button for loading the algorithm  
 * Having it a separate function allows it to return null if tab is null. Maintains readability.
 * @param {Object} props Props
 * @param {Tab} props.tab Tab to load
 * @returns {React.ReactElement} React component
 */
function LoadAlgorithmComponent({tab}) {
    const sharedWorker = useMemo(() => new SharedWorker('./worker.js'), []);
    // Effect hook to handle keyboard shortcut for loading graph/algorithm
    useEffect(() => {

        function onKeyPress(event) {
            // If user is typing into the editor text area, ignore.
            if (event.target.tagName.toLowerCase() === 'textarea') return;

            // Only if user enters designated keyboard shortcut - l - the algorithm in loaded in
            if (event.key === 'l') loadAlgorithm();
        }

        document.addEventListener('keydown', onKeyPress);
        return () => document.removeEventListener('keydown', onKeyPress);
    }, [loadAlgorithm]);

    if (!tab) return;
    // loads in an algorithm into a shared worker by sending a message to its port and preparing the necessary data
    function loadAlgorithm() {
        
        try {     
            sharedWorker.port.postMessage([{
                'message': 'algo-init',
                'algorithm': tab.content,
                'name': tab.name
            }]);
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <button className="flex items-center justify-evenly space-x-2 px-3 py-2 rounded-full font-semibold shadow bg-gradient-to-r from-indigo-500 to-blue-500 text-white outline-2 outline-blue-200 hover:outline" onClick={loadAlgorithm}>
            <ArrowUpRightIcon className="w-4 h-4 stroke-2 stroke-white"/>
            <span>Load Algorithm</span>
        </button>
    )
}

/**
 * Returns the editor
 * @param {Object} props
 * @param {Tab} props.tab The selected tab that should be displayed in editor
 * @param {function} props.onChange Callback function for when the user manipulates the editor
 * @returns {React.ReactElement} React component
 */
function EditorComponent({tab, onChange}) {
    return tab && (
        <div className="w-full h-full rounded-b-lg bg-white">
            <Editor
                height={"100%"}
                onChange={onChange}
                path={tab.name}
                defaultLanguage="javascript"
                defaultValue={tab.content}
            />
        </div>
    )
}

/**
 * EditorGroup for the algorithm page that defines the tabs list and monaco editor into a component
 * @returns {React.ReactElement} React component
 */
export default function EditorGroup() {
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
        const storageItem = localStorage.getItem(`AlgorithmFiles`); // Get saved data from localStorage
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
            
            localStorage.setItem(`AlgorithmFiles`, JSON.stringify(dataList));
            setSaved(true);
        }


        if (tabs.length <= 0) {
            addTab({name: `New Algorithm`}, tabs, setTabs);
        }

        setSaved(false); // Set to false to inform 'saving' is occuring 
        const timeOut = setTimeout(saveToStorage, 500); // If 'tab's doesn't change for 2 sec, tabs will be saved.

        
        return () => clearTimeout(timeOut);//If tabs changes, this function will be called.
    }, [tabs]);

    return (
        <div className="flex flex-col p-2 pt-0 h-full">
            <TabListComponent tabs={tabs} setTabs={setTabs} examples={examples} acceptFileType=".js" />
            <EditorComponent tab={selectedTab} onChange={onEditorChange} />
            <EditorOverlayComponent tab={selectedTab} saved={saved} LoadComponent={LoadAlgorithmComponent} />
        </div>
    )
}
