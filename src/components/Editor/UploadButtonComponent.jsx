/**
 * @fileoverview Contains and returns @see {@link UploadButtonComponent}
 * @author Julian Madrigal
 */


import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

/**
 * Returns component for uploading files and adding them as tabs.
 * @param {Object} props Props 
 * @param {function} props.onUpload The function that should run when a user uploads
 * @param {string} props.acceptFileType The string of comma seperated file extensions to allow
 * @returns {React.ReactElement} React component
 */
export default function UploadButtonComponent({onUpload, acceptFileType}) {
    function onFileUploadEvent(event) {
        const files = event.target.files;

        const tabs = [];
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const tab = {name: file.name, content: e.target.result};
                tabs.push(tab);
                // If all files have been loaded, go ahead and call the onUpload handler
                if (tabs.length >= files.length) {
                    onUpload(tabs);
                }
            };

            reader.readAsText(file);
        }
    }

    return (
        <div className="relative flex items-center space-x-2 px-2 py-1 rounded-t overflow-hidden font-semibold bg-blue-400 text-white outline-2 outline-offset-1 outline-blue-700 hover:bg-blue-500 focus-within:outline">
            <ArrowUpTrayIcon className="w-4 h-4"/>
            <span className="">Upload</span>
            <input type="file" accept={acceptFileType} multiple className="absolute inset-0 z-10 opacity-0" onChange={onFileUploadEvent}></input>
        </div>
    )
}
