import './GraphInput.scss'

import { useState } from "react";

import { parseText } from 'backend/FileToPredicate';

/**
 * This function loads an upload graph button and parses the graph input into a text area on the bottom right of the screen
 * 
 * @param {Object} props - The React properties of the component include:
 * @property {Function(Predicates)} handleChange - A callback function called whenever a file is uploaded.
 * 
 * @returns {HTML} - The HTML representation of the component.
 * 
 * @author Rishab Karwa
 */
function GraphInput(props) {
	/** @var {string} - The text contents of the currently loaded file. */
    var [textValue, setTextValue] = useState("");
	/** @var {string} - The filename of the currently loaded file. */
    var [fileName, setFileName] = useState("");

    /**
     * This function parses the file from the selected upload graph button
     * 
     * @param {event} e - the event of selecting a file from the upload graph button
     */
    function handleChange(e) {

        setFileName(e.target.files[0].name);
        var file = e.target.files[0];

        //create a file reader and pass it the event
        let reader = new FileReader();
        reader.onerror = (e) => alert(e.target.error.name);
        reader.readAsText(file);

        //This function uses the file reader to call the parseText function
        reader.onload = (e) => {
            var file = e.target.result;
            setTextValue(file);
            //parse it into graph components
            props.handleChange(parseText(file));
        };
    };
    return <div className="GraphInput">
        <p>
        <button onClick={() => document.getElementById('filePicker').click()}>
            Upload Graph
        </button>
        <input id="filePicker" hidden type={"file"} onChange={handleChange} />
        {' '}
        {fileName}
        </p>
        <textarea value={textValue} disabled></textarea>
    </div>;
};

export default GraphInput;