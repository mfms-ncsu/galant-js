import './GraphInput.scss'

import { useState } from "react";
import { parseText } from 'backend/FileToPredicate.js';

/**
 * This function loads an upload graph button and parses the graph input into a text area on the bottom right of the screen
 * 
 * @param {Object} props - The React properties of the component include:
 * @property {Function(Predicates)} handleChange - A callback function called whenever a file is uploaded.
 * 
 * @returns {HTML} - The HTML representation of the component.
 * 
 * @author Rishab Karwa
 * @author Yuval Sherman
 */
function GraphInput(props) {
	/** @var {string} - The text contents of the currently loaded file. */
    var [textValue, setTextValue] = useState("");
	/** @var {string} - The filename of the currently loaded file. */
    var [fileName, setFileName] = useState("");
    var [errorMessage, setErrorMessage] = useState("");
    var [errorTextValue, setErrorTextValue] = useState("");
    var [errorFilename, setErrorFilename] = useState("");

    /**
     * This function parses the file from the selected upload graph button
     * 
     * @param {event} e - the event of selecting a file from the upload graph button
     */
    function handleFile(e) {
        var filename = e.target.files[0].name;
        setErrorMessage("")
        if (!e.target.files[0].name.includes(".")) {
            setErrorMessage("Unaccepted File Type: No Extension");
            return;
        }
        var ext = e.target.files[0].name.match(/.([^.]+)$/)[1];
        if (ext !== "txt") {
            setErrorMessage("Unaccepted File Type: '." + ext + "'");
            setErrorFilename(filename);
            return;
        }
        var file = e.target.files[0];

        //create a file reader and pass it the event
        let reader = new FileReader();
        reader.onerror = (e) => alert(e.target.error.name);
        reader.readAsText(file);

        //This function uses the file reader to call the parseText function
        reader.onload = (e) => {
            var file = e.target.result;
            //parse it into graph components
            var predicates = {}
            try {
                predicates = parseText(file);
                props.onUpload(predicates);
                setTextValue(file);
                setFileName(filename);
            } catch (e) {
                // there was an error. So we need to handle it (display the error message)
                setErrorMessage(e.message);
                setErrorTextValue(file);
                setErrorFilename(filename);
            }
        };
    };

    function handleClick(e) {
        e.target.value = ''
    }

    function clearErrors(e) {
        setErrorMessage("");
        setErrorTextValue("");
        setErrorFilename("");
    }

    return <div className="GraphInput">
        { errorMessage &&
            <div className="error-mask">
                <div id="error" className="graph-input-error">
                    <span className="filename">{errorFilename}</span>
                    <span data-testid="errorMessage">{errorMessage}</span>
                    <textarea id="graph-text" value={errorTextValue} disabled></textarea>
                    <button onClick={clearErrors}>Okay</button>
                </div>
            </div>
        }
        
        <button className="file-picker">
            <label htmlFor="file-picker">Upload Graph</label>
        </button>
        <input id="file-picker" hidden type={"file"} onChange={handleFile} onClick={handleClick} accept=".txt,text/plain"/>
        <span className="filename">{fileName}</span>
        
        <textarea id="graph-text" value={textValue} disabled></textarea>
    </div>;
};

export default GraphInput;