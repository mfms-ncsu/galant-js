import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import React from 'react';

/**
 * Returns component for uploading files and adding them as tabs.
 */
export default function UploadButton({onFileUpload, acceptFileType}) {
    // Keyboard shortcut for uploading files
    // Does not work in any browser for some reason, so we need to use the button instead
    React.useEffect(() => {
        function onKeyPress(event) {
            if (event.code === "KeyO" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              onUploadEvent(event)
            }
        }
        document.addEventListener("keydown", onKeyPress);
        return () => document.removeEventListener("keydown", onKeyPress);
    }, []);

    function onUploadEvent(event) {
        const files = event.target.files;
        const tabs = [];
        // This appears to be the way to read multiple files in a single input event
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const tab = {name: file.name, content: e.target.result};
                tabs.push(tab);
                // If all files have been loaded, go ahead and call the onUpload handler
                // This seems like an odd way to do it, but it works; why not do this outside of the loop?
                // This is because FileReader is asynchronous, so we need to wait for all files to be read before calling the handler.
                // If we called the handler inside the loop, it would be called multiple times, once for each file.
                // This way, we only call it once all files have been read.
                // This is a common pattern when dealing with asynchronous operations in JavaScript.
                // It ensures that we only proceed when all asynchronous operations have completed.
                // This is especially important when dealing with file uploads, as we want to ensure that all files are processed before proceeding.
                if (tabs.length >= files.length) {
                    onFileUpload(tabs);
                }
            };
            reader.readAsText(file);
        }
    }

    return (
        <PrimaryButton className="m-1">
            <label htmlFor="file-upload" className="cursor-pointer flex items-center"> 
                <ArrowUpTrayIcon className="inline h-4 me-2 fill-black stroke stroke-black"/>
                Upload File
            </label>
            <input id="file-upload" type="file" accept={acceptFileType} multiple className="hidden" onChange={onUploadEvent}></input>
        </PrimaryButton>
    );
}
