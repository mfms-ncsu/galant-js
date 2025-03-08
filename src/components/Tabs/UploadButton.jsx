import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import PrimaryButton from 'components/Buttons/PrimaryButton';

/**
 * Returns component for uploading files and adding them as tabs.
 */
export default function UploadButton({onUpload, acceptFileType}) {
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
        <PrimaryButton className="mx-2 mb-1">
            <label htmlFor="file-upload" className="cursor-pointer flex items-center"> 
                <ArrowUpTrayIcon className="inline h-4 me-2 fill-white stroke stroke-white"/>
                Upload
            </label>
            <input id="file-upload" type="file" accept={acceptFileType} multiple className="hidden" onChange={onFileUploadEvent}></input>
        </PrimaryButton>
    );
}
