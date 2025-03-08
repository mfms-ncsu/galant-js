import { useEffect } from "react";
import PrimaryButton from "components/Buttons/PrimaryButton";
import { ArrowDownTrayIcon, ArrowPathIcon, CheckIcon } from "@heroicons/react/24/solid";

/**
 * Exports the tab content to a file. If the content is detected as JavaScript,
 * the file will be saved with a .js extension, otherwise with a .gph extension.
 * @param {Tab} tab 
 */
function downloadFile(type, tab) {
    if (!tab) return;
    const isAlgorithm = type === 'Algorithm';
    
    //Update the file extension if it is missing or incorrect
    let name = tab.name;
    if (isAlgorithm && !tab.name.match(/\.js$/)) {
        name = name.replace(/[a-z]+$/).concat('.js')
    }
    if (!isAlgorithm && !tab.name.match(/\.(?:gph|sgf)$/)) {
        name = name.replace(/[a-z]+$/).concat('.gph')
    }
    const ext = name.match(/\.[a-zA-Z0-9]+$/);

    if (window.showSaveFilePicker) {
        (async () => {
            try {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: name,
                    types: [{
                        description: isAlgorithm ? 'JavaScript Files' : 'Text Files',
                        accept:isAlgorithm ? { 'text/javascript': [ext] } : { 'text/plain': [ext] },
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
        const fileName = window.prompt("Enter the filename to save:");
        if (!fileName) return;
        const blob = new Blob([tab.content], { type: isAlgorithm ? "text/javascript" : "text/plain" });
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
 */
function DownloadButton({ editorType, tab }) {
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
        <PrimaryButton onClick={() => downloadFile(editorType, tab)}>
            <ArrowDownTrayIcon className="inline h-4 me-2 stroke-2 stroke-white" />
            Download File
        </PrimaryButton>
    );
}

/**
 * This component shows the overlay for the graph editor.
 * Notably, this includes the buttons positioned to the bottom right corner.
 * Function expects handlers for when these buttons are clicked.
 */
export default function Overlay({ tab, saved, editorType, LoadButton }) {
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

                <LoadButton editorType={editorType} tab={tab} />
                <DownloadButton editorType={editorType} tab={tab} />
            </div>
        </div>
    );
}
