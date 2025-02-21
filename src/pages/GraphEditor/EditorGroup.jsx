/**
 * @fileoverview Defines the editor group for Graph
 * @author Julian Madrigal
 * @author Vitesh Kambara
 */

import { useEffect, useState, useRef, useMemo } from "react";
import Editor from '@monaco-editor/react';
import EditorOverlayComponent from "../../components/Editor/EditorOverlay"
import TabListComponent from "../../components/Editor/TabListComponent";
import { addTab, getSelectedTab } from "../../components/Editor/TabUtils";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import examples from './Examples.json';

/**
 * @typedef {import("components/Editor/TabComponent").Tab} Tab
 */

/**
 * Create button for loading the graph to the graph viewer
 * Having it a separate function allows it to return null if tab is null. Maintains readability.
 * @param {Object} props Props
 * @param {Tab} props.tab Tab to load
 * @returns {React.ReactElement} React component
 */
function LoadGraphComponent({tab}) {
    const sharedWorker = useMemo(() => new SharedWorker('./worker.js'), []);
    const [showLoadedMessage, setShowLoadedMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        function onKeyPress(event) {
            if (event.target.tagName.toLowerCase() === 'textarea') return;
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
            setShowLoadedMessage(true);
            setErrorMessage('');
            setTimeout(() => {
                setShowLoadedMessage(false);
            }, 3000);
        } catch (e) {
            console.error(e.message);
            setErrorMessage('Failed to load');
            setShowLoadedMessage(false);
        }
    }

    function clearError() {
        setErrorMessage('');
    }

    return (
        <div>
            {showLoadedMessage && (
                <div className="absolute top-0 left-0 right-0 p-2 bg-green-500 text-white text-center">
                    Graph loaded!
                </div>
            )}
            {errorMessage && (
                <div className="absolute top-0 left-0 right-0 p-2 bg-red-500 text-white text-center">
                    {errorMessage}
                    <button onClick={clearError} className="ml-4 px-2 py-1 bg-red-700 rounded">Clear Error</button>
                </div>
            )}
            <button className="flex items-center justify-evenly space-x-2 px-3 py-2 rounded-full font-semibold shadow bg-gradient-to-r from-indigo-500 to-blue-500 text-white outline-2 outline-blue-200 hover:outline" onClick={loadGraph}>
                <ArrowUpRightIcon className="w-4 h-4 stroke-2 stroke-white"/>
                <span>Load Graph</span>
            </button>
        </div>
    )
}

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
    const [tabs, setTabs] = useState([]);
    const [saved, setSaved] = useState(true);
    const selectedTab = getSelectedTab(tabs);

    function onEditorChange(value, event) {
        selectedTab.content = value;
        setTabs([...tabs]);
    }

    useEffect(() => {
        const storageItem = localStorage.getItem(`GraphFiles`);
        if (storageItem) {
            const dataList = JSON.parse(storageItem);
            setTabs(dataList.map(data => {
                const newTab = {name: data.name, content: data.content};
                return newTab;
            }));
        }
    }, []);

    // Listen for storage events for when a graph is saved
    useEffect(() => {
        function onStorage(event) {
            if (event.key !== "GraphFiles") return;
            
            // Get the old and new list of tabs
            const oldList = JSON.parse(event.oldValue);
            const newList = JSON.parse(event.newValue);

            // Figure out which graph to mark as selected
            let newSelected = 0;
            newList.forEach((graph, i) => {
                if (oldList[i]) {
                    if (oldList[i].content !== graph.content) {
                        newSelected = i;
                    }
                } else {
                    newSelected = i;
                }
            });

            // Set tabs
            setTabs(newList.map((data, i) => {
                return {
                    name: data.name,
                    content: data.content,
                    selected: (i === newSelected) ? true : false,
                }
            }));
        }

        window.addEventListener("storage", onStorage);
        return () => { window.removeEventListener("storage", onStorage) };
    }, []);

    useEffect(() => {
        function saveToStorage() {
            const dataList = tabs.map(tab => ({name: tab.name, content: tab.content}));
            localStorage.setItem(`GraphFiles`, JSON.stringify(dataList));
            setSaved(true);
        }

        const timeOut = setTimeout(saveToStorage, 500);
        return () => clearTimeout(timeOut);
    }, [tabs]);

    return (
        <div className="flex flex-col p-2 pt-0 h-full">
            <TabListComponent tabs={tabs} setTabs={setTabs} examples={examples} acceptFileType=".txt, .gph, .sgf" />
            <EditorComponent tab={selectedTab} onChange={onEditorChange} />
            <EditorOverlayComponent tab={selectedTab} saved={saved} LoadComponent={LoadGraphComponent} />
        </div>
    );
}
