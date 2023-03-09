import './GraphInput.scss'

import { useState } from "react";
import { parseText } from 'src/backend/FileToPredicate.js';

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
    var [errorMessage, setErrorMessage] = useState("");

    /**
     * This function parses the file from the selected upload graph button
     * 
     * @param {event} e - the event of selecting a file from the upload graph button
     */
    function handleFile(e) {
        setErrorMessage("")
        var error = false;
        var ext = e.target.files[0].name.match(/.([^.]+)$/)[1];
        if (ext !== "txt") {
            setErrorMessage("Unaccepted File Type: '." + ext + "'");
            error = true;
        }

        if (!error) {
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
                var predicates = {}
                try {
                    predicates = parseText(file);
                } catch (e) {
                    // there was an error. So we need to handle it (display the error message)
                    setErrorMessage(e.message)
                }
                props.setGraph(predicates);
            };
        }
    };
    return <div className="GraphInput">
        { errorMessage &&
            <div data-testid="errorMessage" id="error" className="graph-input-error">
                {errorMessage}
            </div>
        }   
        <p>
            <button className="file-picker">
                <label htmlFor="file-picker">Upload Graph</label>
            </button>
            <input id="file-picker" hidden type={"file"} onChange={handleFile} accept=".txt,text/plain"/>
            <span className="filename">{fileName}</span>
        </p>
        <textarea id="graph-text" value={textValue} disabled></textarea>
    </div>;
};

export default GraphInput;