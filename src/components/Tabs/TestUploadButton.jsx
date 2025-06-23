import React, { useRef, useEffect } from 'react';

export default function FileOpenButton({ acceptFileType, onFileRead }) {
  const inputRef = useRef(null);

  // Determine accepted file extensions
  const accept =
    acceptFileType === "algorithm"
      ? ".js"
      : acceptFileType === "graph"
      ? ".gph,.sgf"
      : "";

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        inputRef.current && inputRef.current.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // File input change handler
  const handleChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof onFileRead === 'function') {
        onFileRead(event.target.result);
      }
    };
    reader.readAsText(file);

    // Reset so user can re-select the same file if needed
    e.target.value = '';
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        Open File (Ctrl+O)
      </button>
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept={accept}
        onChange={handleChange}
      />
    </>
  );
}