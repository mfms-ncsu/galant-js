import { useEffect, useState, useRef } from "react";
import { ArrowDownTrayIcon, ArrowPathIcon, ArrowUpRightIcon, CheckIcon } from "@heroicons/react/24/solid";
import { parseText } from 'utils/FileToPredicate.js';

/**
 * Basic heuristic to detect if the content is JavaScript.
 * @param {string} content
 * @returns {boolean}
 */
function isJavascript(content) {
    return /(?:import|export|function|const|let|var)/.test(content);
}

/**
 * Exports the tab content to a file. If the content is detected as JavaScript,
 * the file will be saved with a .js extension, otherwise with a .gph extension.
 * @param {Tab} tab 
 */
function downloadFile(tab) {
    if (!tab) return;
    
    const isJS = isJavascript(tab.content);
    const ext = isJS ? '.js' : '.gph';
    // Remove existing .js or .gph extension and append the correct one.
    const baseName = tab.name.replace(/\.(js|gph)$/, '');
    const defaultName = `${baseName}${ext}`;

    if (window.showSaveFilePicker) {
        (async () => {
            try {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: defaultName,
                    types: [{
                        description: isJS ? 'JavaScript Files' : 'Text Files',
                        accept: isJS ? { 'text/javascript': [ext] } : { 'text/plain': [ext] },
                    }],
                });
                const writableStream = await fileHandle.createWritable();
                await writableStream.write(tab.content);
                await writableStream.close();
            } catch (error) {
                console.error("Error saving file:", error);
            }
        })();
    } else {
        const fileName = window.prompt("Enter the filename to save:", defaultName);
        if (!fileName) return;
        const blob = new Blob([tab.content], { type: isJS ? "text/javascript" : "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

/**
 * Create button for exporting the graph (tab content)
 * Having it a separate function allows it to return null if tab is null. Maintains readability.
 * @param {Object} props
 * @param {Tab} props.tab 
 * @returns {React.ReactElement}
 */
function DownloadComponent({ tab }) {
    // Keyboard shortcut for exporting file
    useEffect(() => {
        function onKeyPress(event) {
            if (event.target.tagName.toLowerCase() === 'textarea') return;
            // Check for Command + S or Control + S
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                event.preventDefault(); // Prevent the default browser behavior
                downloadFile(tab);
            }
        }
        document.addEventListener('keydown', onKeyPress);
        return () => document.removeEventListener('keydown', onKeyPress);
    }, [tab]);

    if (!tab || tab.content.length <= 0) return null;

    return (
        <button onClick={() => downloadFile(tab)} className="flex items-center justify-evenly space-x-2 px-3 py-2 rounded-full font-semibold shadow bg-gradient-to-r from-indigo-500 to-blue-500 text-white outline-2 outline-blue-200 hover:outline">
            <ArrowDownTrayIcon className="w-4 h-4 stroke-2 stroke-white" />
            <span>Download File</span>
        </button>
    )
}

/**
 * This component shows the overlay for the graph editor.
 * Notably, this includes the buttons positioned to the bottom right corner.
 * Function expects handlers for when these buttons are clicked.
 * @param {Object} props Props
 * @param {function} props.onLoad Callback function for when a user wants to load
 * @param {Tab} props.tab The tab that should be related to the overlay
 * @param {boolean} props.saved Whether the changes have been saved to localstorage
 * @param {React.ReactElement} props.LoadComponent Component to display for loading
 */
export default function EditorOverlayComponent({ onLoad, tab, saved, LoadComponent }) {
    return (
        <div className="absolute bottom-0 right-0 p-2">
            <div className="flex flex-col space-y-2 pr-3 pb-3">
                <div className={`flex items-center space-x-2 h-6 w-fit ml-auto px-2 py-1 rounded-full ${saved ? 'fill-green-500 text-green-700' : 'font-semibold'}`}>
                    {saved ?
                        <CheckIcon className="h-full" />
                        :
                        <ArrowPathIcon className="h-full animate-spin" />
                    }
                    <span>{saved ? 'Saved' : 'Saving'}</span>
                </div>
                <LoadComponent tab={tab} />
                <DownloadComponent tab={tab} />
            </div>
        </div>
    )
}