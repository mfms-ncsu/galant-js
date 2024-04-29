/**
 * @fileoverview Defines the editor group for Graph
 * @author Julian Madrigal
 * @author Vitesh Kambara
 */

import { useEffect, useState, useRef, useMemo } from "react";
import Editor from '@monaco-editor/react';
import EditorOverlayComponent from "../../components/Editor/EditorOverlay"
import TabListComponent from "../../components/Editor/TabListComponent";
import { addTab, getSelectedTab, getTabByName } from "../../components/Editor/TabUtils";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";

import examples from './Examples.json';

/**
 * @typedef {import("components/Editor/TabComponent").Tab} Tab
 */



/**
 * Create button for loading the graph to the graph viewer
 * Having it a separate function allows it to return null if tab is null. Maintains readability.
 * @param {Object} props Props
 * @param {import('../../types/Tab').Tab} props.tab Tab to load
 * @returns {React.ReactElement} React component
 */
function LoadGraphComponent({tab}) {
    const sharedWorker = useMemo(() => new SharedWorker('./worker.js'), []);
    // Keyboard shortcut for loading in a graph from Graph Editor
    // Effect hook to handle keyboard shortcut for loading graph/algorithm
    useEffect(() => {

        function onKeyPress(event) {
            // If user is typing into the editor text area, ignore.
            if (event.target.tagName.toLowerCase() === 'textarea') return;

            // Only if user enters designated keyboard shortcut - l - the graph is loaded in
            if (event.key === 'l') loadGraph();
        }

        document.addEventListener('keydown', onKeyPress);
        return () => document.removeEventListener('keydown', onKeyPress);
    }, [loadGraph]);

    if (!tab) return;

    function loadGraph() {
        try {   
            sharedWorker.port.postMessage([{
                'message': 'graph-init',
                'graph': tab.content,
                'name': tab.name
            }]);
        } catch (e) {
            console.error(e.message);
        }
    }
    
    return (
        <button className="flex items-center justify-evenly space-x-2 px-3 py-2 rounded-full font-semibold shadow bg-gradient-to-r from-indigo-500 to-blue-500 text-white outline-2 outline-blue-200 hover:outline" onClick={loadGraph}>
            <ArrowUpRightIcon className="w-4 h-4 stroke-2 stroke-white"/>
            <span>Load Graph</span>
        </button>
    )
}



/**
 * Returns the editor
 * @param {Tab} tab 
 * @returns {React.ReactElement}
 */
function EditorComponent({tab, onChange}) {
    return tab && (
        <div className="w-full h-full rounded-b-lg bg-white">
            <Editor
                height={"100%"}
                onChange={onChange}
                path={tab.name}
                defaultLanguage="markdown"
                value={tab.content}
            />
        </div>
    )
}


export default function EditorGroup() {
    // useRef to hold a reference to a SharedWorker instance
    const sharedWorker = useRef();
    const [tabs, setTabs] = useState([]);
    const [saved, setSaved] = useState(true);
    const hasFetched = useRef();
    
    const selectedTab = getSelectedTab(tabs);

    function onEditorChange(value, event) {
        selectedTab.content = value;
        setTabs([...tabs]);
    }

    // Updates graph whenever a graph-update message is sent by graph view
    useEffect(() => {
        if (!sharedWorker.current) {
            sharedWorker.current = new SharedWorker('./worker.js');
        }

        sharedWorker.current.port.onmessage = (({data}) => {
            if (!data.message || data.message !== 'graph-update') return;
            const graphName = data.name;
            const graphText = data.graph;
            console.log(graphName, graphText);

            const tab = getTabByName(tabs, graphName);
            if (tab) {
                tab.content = graphText;
                setTabs([...tabs]);
                sharedWorker.current.port.postMessage([{
                    'message': 'graph-rename',
                    'graph': tab.content,
                    'name': tab.name
                }]);
            } else {
                const tabData = {
                    name: 'New Graph',
                    content: graphText
                }
                const tab = addTab(tabData, tabs, setTabs);
                // Graph rename updates the graph. Similar to graph-init except no auto-camera on load
                sharedWorker.current.port.postMessage([{
                    'message': 'graph-rename',
                    'graph': tab.content,
                    'name': tab.name
                }]);
            }
        })
    // Since we set tabs, we need to always have the latest list of tabs
    }, [tabs]);

    // Fetches the graph files stored locally in localstorage and adds them to the tabs list.
    useEffect(() => {
        // This prevents double loading of tabs during strict mode
        if (hasFetched.current) return;
        hasFetched.current = true;
        const storageItem = localStorage.getItem(`GraphFiles`);
        if (!storageItem) return;

        const dataList = JSON.parse(storageItem);

        setTabs((prevTabs) => {
            for (let data of dataList) {
                addTab(data, prevTabs, setTabs, true);
            }

            return [...prevTabs];
        })
    }, []);


    // Save changes to local storage whenever any of the tabs are modified
    useEffect(() => {
        function saveToStorage() {
            const dataList = [];
            for (const tab of tabs) {
                dataList.push({name: tab.name, content: tab.content});
            }
            
            localStorage.setItem(`GraphFiles`, JSON.stringify(dataList));
            setSaved(true);
        }


        if (tabs.length <= 0) {
            addTab({name: `New Graph`}, tabs, setTabs);
        }

        setSaved(false); // Set to false to inform 'saving' is occuring 
        const timeOut = setTimeout(saveToStorage, 500); // If 'tab's doesn't change for 0.5 sec, tabs will be saved.

        
        return () => clearTimeout(timeOut);//If tabs changes, this function will be called.
    }, [tabs]);

    return (
        <div className="flex flex-col p-2 pt-0 h-full">
            <TabListComponent tabs={tabs} setTabs={setTabs} acceptFileType=".txt, .gph, .sgf" examples={examples} />
            <EditorComponent tab={selectedTab} onChange={onEditorChange} />
            <EditorOverlayComponent tab={selectedTab} saved={saved} LoadComponent={LoadGraphComponent} />
        </div>
    )
}