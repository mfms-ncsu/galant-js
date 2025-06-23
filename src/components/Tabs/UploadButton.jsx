import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import React, { useRef, useEffect } from 'react';

/**
 * Returns component for uploading files and adding them as tabs.
 */
export default function UploadButton({onFileUpload, acceptFileType}) {
    const inputRef = useRef(null);

    // Keyboard shortcut for uploading files
    useEffect(() => {
        function onKeyPress(event) {
            if (event.code === "KeyO" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
                inputRef.current && inputRef.current.click();
            }
        }
        document.addEventListener("keydown", onKeyPress);
        return () => document.removeEventListener("keydown", onKeyPress);
    }, []);

    function handleChange(event) {
        console.log("onFileUploadEvent called, event =", event);
        const file = event.target.files && event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            if (typeof onFileUpload === 'function') {
                onFileUpload(event.target.result);
            }
       };
       reader.readAsText(file);
       event.target.value = ''; // Clear the input value to allow re-uploading the same file
    }

    return (
        <PrimaryButton className="m-1">
      <button
        type="button"
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        Open File (Ctrl+O)
      </button>

            <label htmlFor="file-upload
            " className="cursor-pointer flex items-center"> 
                <ArrowUpTrayIcon className="inline h-4 me-2 fill-black stroke stroke-black"/>
                Upload File
            </label>
            <input id="file-upload" type="file" accept={acceptFileType} multiple className="hidden" onChange={onFileUpload}></input>
        </PrimaryButton>
    );
}
