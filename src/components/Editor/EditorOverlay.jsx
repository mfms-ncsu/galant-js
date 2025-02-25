import { useEffect } from "react";
import PrimaryButton from "components/Buttons/PrimaryButton";
import { ArrowDownTrayIcon, ArrowPathIcon, CheckIcon } from "@heroicons/react/24/solid";

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

    // Keyboard shortcut for downloading file
    useEffect(() => {
        function handleKeydown(event) {
            if (event.keyCode === 83 && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                downloadFile(tab);
            }
        }
        document.addEventListener("keydown", handleKeydown);
        return () => document.removeEventListener("keydown", handleKeydown);
    }, [tab]);

    if (!tab || tab.content.length <= 0) return null;

    return (
        <PrimaryButton onClick={() => downloadFile(tab)}>
            <ArrowDownTrayIcon className="inline h-4 me-2 stroke-2 stroke-white" />
            Download File
        </PrimaryButton>
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
            <div className="space-y-2">
                <div className={`flex items-center ml-auto w-fit text-xl font-semibold ${saved ? 'fill-green-600 text-green-600' : 'font-semibold'}`}>
                    {saved ?
                        <CheckIcon className="h-6 me-2 stroke stroke-green-600" />
                        :
                        <ArrowPathIcon className="h-6 me-2 stroke stroke-black animate-spin" />
                    }
                    <span>{saved ? 'Saved' : 'Saving'}</span>
                </div>

                <LoadComponent tab={tab} />
                <DownloadComponent tab={tab} />
            </div>
        </div>
    )
}
