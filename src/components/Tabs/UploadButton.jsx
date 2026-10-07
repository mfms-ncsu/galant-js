import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import React, { useEffect, useRef } from "react";
import shortcuts, { matchesShortcut, shortcutHint } from "config/keyboardShortcuts";

export default function UploadButton({onFileUpload, acceptFileType}) {
  const fileInputRef = useRef(null);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    function onKeyPress(event) {
        if (matchesShortcut(event, shortcuts.openFile)) {
            event.preventDefault();
            openFileDialog()
        }
    }
    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, []);

  function onUploadEvent(event) {
        const files = event.target.files;
        if (files.length === 0) return;
        const tabs = [];
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const tab = {name: file.name, content: e.target.result};
                tabs.push(tab);
                if (tabs.length >= files.length) {
                    onFileUpload(tabs);
                }
            };
            reader.readAsText(file);
        }
  }

    return (
        <PrimaryButton className="m-1" onClick={openFileDialog}>
            <label className="cursor-pointer flex items-center"> 
                <ArrowUpTrayIcon className="inline h-4 me-2 fill-black stroke stroke-black"/>
                Open{shortcutHint(shortcuts.openFile)}
            </label>
            <input ref={fileInputRef} type="file" accept={acceptFileType} multiple className="hidden" onChange={onUploadEvent}></input>
        </PrimaryButton>
    );

}
