import { useEffect, useState } from "react";
import TabInterface from "interfaces/TabInterface/TabInterface";
import SharedWorker from "globals/SharedWorker";
import PrimaryButton from "components/Buttons/PrimaryButton";
import ExitButton from "components/Buttons/ExitButton";
import FileParser from "interfaces/FileParser/FileParser";
import { CheckIcon, ArrowDownTrayIcon, ArrowPathIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid";

/**
 * Create button for loading the graph/algorithm.
 */
function LoadButton({ tab, editorType }) {
    const [showLoadedMessage, setShowLoadedMessage] = useState(false);
    const [loadError, setLoadError] = useState("");

    // Effect hook to handle keyboard shortcut for loading graph/algorithm
    useEffect(() => {
        function onKeyPress(event) {
            // If user is typing into the editor text area, ignore.
            // !!! this defeats the purpose of a kbd shortcut !!!
            // if (event.target.tagName.toLowerCase() === "textarea") return;

            // Only if user enters designated keyboard shortcut
            //  cmd-l or ctrl-l the graph/algorithm in text area is loaded
            // @todo function modifier(event) that returns true if it's a meta or ctrl
            if (event.code === "KeyL" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                load();
            }
        }
        document.addEventListener("keydown", onKeyPress);
        return () => document.removeEventListener("keydown", onKeyPress);
    }, [load]);

    // loads in a graph/algorithm into a shared worker by sending a message to its port and preparing the necessary data
    function load() {
        try {
            
            // Try to parse the file using the FileParser.
            // It would be nice for us to not have to do this, but I
            // don't know of any other way to do error checking here.
            //
            // Since the SharedWorker that loads the graph and this
            // tab operate in different threads, there's no way to know
            // if the SharedWorder runs into an error while parsing
            // a Graph, meaning that we can't give a detailed error
            // message if it does.
            //
            // So, we try to load the graph here, and if we're
            // successful, we send the graph to the SharedWorker, who
            // parses it again.

            if (editorType === "Graph") {
                let temp = FileParser.loadGraph(tab.name, tab.content);
            }

            // Send the message using shared worker
            SharedWorker.postMessage({
                "message": (editorType === "Algorithm") ? "algo-init" : "graph-init",
                "payload": tab.content,
                "name": tab.name
            });

            // Show the loaded message
            setShowLoadedMessage(true);
            setLoadError(""); // Clear any existing error

            // Hide the message after 3 seconds
            setTimeout(() => {
                setShowLoadedMessage(false);
            }, 3000);

        } catch (e) {
            setLoadError("Failed to load " + editorType.toLowerCase() + ": " + e.message);
        }
    }

    function clearError() {
        setLoadError("");
    }

    return tab && (
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

/**
 * Button for exporting the tab content as a file.
 */
function DownloadButton({ editorType, tab }) {
    // Register the cmd/ctrl-S keyboard shortcut
    useEffect(() => {
        function handleKeydown(event) {
            if (event.code === "KeyS" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                TabInterface.downloadTab(tab, editorType);
            }
        }
        document.addEventListener("keydown", handleKeydown);
        return () => document.removeEventListener("keydown", handleKeydown);
    }, [tab]);

    return tab && tab.content.length >= 0 && (
        <PrimaryButton onClick={() => TabInterface.downloadTab(tab, editorType)}>
            <ArrowDownTrayIcon className="inline h-4 me-2 stroke-2 stroke-white" />
            Download File
        </PrimaryButton>
    );
}

/**
 * This component shows the overlay for the graph editor. Notably, this  includes the buttons positioned 
 * to the bottom right corner. Function  expects handlers for when these buttons are clicked.
 */
export default function Overlay({ tab, saved, editorType }) {
    return (
        <div className="absolute bottom-0 right-0 p-2">
            <div className="space-y-2">
                <div className={`flex items-center ml-auto w-fit text-xl font-semibold ${saved ? "fill-green-600 text-green-600" : "font-semibold"}`}>
                    {saved ?
                        <CheckIcon className="h-6 me-2 stroke stroke-green-600" />
                        :
                        <ArrowPathIcon className="h-6 me-2 stroke stroke-black animate-spin" />
                    }
                    <span>{saved ? "Saved" : "Saving"}</span>
                </div>

                <LoadButton editorType={editorType} tab={tab} />
                <DownloadButton editorType={editorType} tab={tab} />
            </div>
        </div>
    );
}
