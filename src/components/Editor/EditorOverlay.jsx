import { useEffect, useState, useRef } from "react";
import { ArrowDownTrayIcon, ArrowPathIcon, ArrowUpRightIcon, CheckIcon } from "@heroicons/react/24/solid";
import { parseText } from 'utils/FileToPredicate.js';
/**
 * @typedef {import('../../pages/GraphEditor/EditorGroup').Tab} Tab A tab of the editor
*/


/**
 * Starts download of a file
 * @param {*} name 
 * @param {*} content 
 */
function downloadFile(name, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = name;
    link.href = URL.createObjectURL(blob);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Create button for downloading the graph
 * Having it a separate function allows it to return null if tab is null. Maintains readability.
 * @param {Object} props
 * @param {Tab} props.tab 
 * @returns {React.ReactElement}
 */
function DownloadComponent({tab}) {
    // Keyboard shortcut for downloading file
    useEffect(() => {

        function onKeyPress(event) {
            // If user is typing into the text editor, ignore.
            if (event.target.tagName.toLowerCase() === 'textarea') return;

            // Only if user enters designated keyboard shortcut - s - the file is downloaded
            // if (!event.metaKey) return;
            if (event.key === 's') {
                downloadFile(tab.name, tab.content);
            }
            
        }

        document.addEventListener('keydown', onKeyPress);
        return () => document.removeEventListener('keydown', onKeyPress);
    }, [tab])

    if (!tab || tab.content.length <= 0) return;

    return (
        <button onClick={() => downloadFile(tab.name, tab.content)} className="flex items-center justify-evenly space-x-2 px-3 py-2 rounded-full font-semibold shadow bg-gradient-to-r from-indigo-500 to-blue-500 text-white outline-2 outline-blue-200 hover:outline">
            <ArrowDownTrayIcon className="w-4 h-4 stroke-2 stroke-white"/>
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
 * @param {function} props.tab The tab that should be related to the overlay
 * @param {function} props.saved Whether the changes have been saved to localstorage
 * @param {React.ReactElement} props.LoadComponent Component to display for loading
 */
export default function EditorOverlayComponent({onLoad, tab, saved, LoadComponent}) {
    return (
        <div className="absolute bottom-0 right-0 p-2">
            <div className="flex flex-col space-y-2 pr-3 pb-3">
                <div className={`flex items-center space-x-2 h-6 w-fit ml-auto px-2 py-1 rounded-full ${saved ? 'fill-green-500 text-green-700' : 'font-semibold'}`}>
                    {saved ? 
                        <CheckIcon className="h-full" />
                    : 
                        <ArrowPathIcon className="h-full animate-spin"/>
                    }
                    <span>{saved ? 'Saved' : 'Saving'}</span>
                </div>
                <LoadComponent tab={tab}/>
                <DownloadComponent tab={tab}/>
            </div>
        </div>
    )

}