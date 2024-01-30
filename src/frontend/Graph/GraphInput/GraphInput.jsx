import './GraphInput.scss'

import React, { useState, useRef } from 'react';
//fully featured editor in browser
import Editor from "@monaco-editor/react";
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
    //var [textValue, setTextValue] = useState("");
	/** @var {string} - The filename of the currently loaded file. */
    // eslint-disable-next-line
    var [fileName, setFileName] = useState("");
    var [errorMessage, setErrorMessage] = useState("");
    var [errorTextValue, setErrorTextValue] = useState("");
    var [errorFilename, setErrorFilename] = useState("");
    var [tabAmount, setTabAmount] = useState(1);
    const [tabs,setTabs] = useState([{
        'key': 0,
        'filename': 0,
        'content': 'Upload a Graph or Edit one Here.' 
    }]);
    var [currentTab, setCurrentTab] = useState(0);

    const editorRef = useRef(null);
    // eslint-disable-next-line
    const [sharedworker, setSharedWorker] = useState(new SharedWorker('./worker.js'));



    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        editorRef.current.setValue(tabs[0]['content']);
        //if editor mounted we can setup everything
        //console.log(tabs);
        document.getElementById('filename-editor').value = tabs[currentTab]['filename'];
        editorRef.current.setValue(tabs[currentTab]['content']);
        //console.log(currentTab);
        document.getElementById("editor-button").disabled = false;
    }

    function currentChange(index) {
        //console.log(index);
        //console.log(tabs);
        if(editorRef.current != null && document.getElementById('filename-editor') != null) {

            //save current state
            var tempTabs = [...tabs]; //copy
            tempTabs[currentTab]['filename'] = document.getElementById('filename-editor').value;
            tempTabs[currentTab]['content'] = editorRef.current.getValue();

            setTabs(tempTabs);

            //move on
            setCurrentTab(index);
            document.getElementById('filename-editor').value = tabs[index]['filename'];
            editorRef.current.setValue(tabs[index]['content']);
        } else {
            console.log("DOM not loaded");
        }
    }

    function addTab() {
        
        setTabs([...tabs, {
        'key': tabAmount,
        'filename': tabAmount,
        'content': 'Upload a Graph or Edit one Here.' 
        }]);
        setTabAmount(tabAmount + 1);

    }

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
        if (ext !== "txt" && ext !== "gph" && ext !== "sgf") {
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

            editorRef.current.setValue(file);
            document.getElementById('filename-editor').value = filename;

            currentChange(currentTab);
        };
    };

    function clearErrors(e) {
        setErrorMessage("");
        setErrorTextValue("");
        setErrorFilename("");
    }

    function uploadGraph(e) {
        var predicates = {}
        try {
            predicates = parseText(editorRef.current.getValue());       
            sharedworker.port.postMessage([{
                'message': 'graph-init',
                'graph': predicates
            }]);
            //console.log("posted graph");
        } catch (e) {
            // there was an error. So we need to handle it (display the error message)
            setErrorMessage(e.message);
            setErrorTextValue(editorRef.current.getValue());
            setErrorFilename(fileName);
        }
    }

    //https://code.tutsplus.com/how-to-save-a-file-with-javascript--cms-41105t
    function saveFile() {
        var tempLink = document.createElement("a");
        tempLink.setAttribute('hidden', true);
      
        var taBlob = new Blob([editorRef.current.getValue()], {type: 'text/plain'});
      
        tempLink.setAttribute('href', URL.createObjectURL(taBlob));
        tempLink.setAttribute('download', tabs[currentTab]['filename']);
        tempLink.click();
      
        URL.revokeObjectURL(tempLink.href);
    }

    function handleClick(e) {
        e.target.value = ''
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

        <div className="uploadButton">        
            <button className="file-picker" id="editor_button">
                <label htmlFor="file-picker">Upload Graph</label>
            </button>
        </div>

        <br />

        <div className="tab-locations">
            {tabs.map(value => (
                <button key="{value['key']}" onClick={() => currentChange(value['key'])}>{value['filename']}</button>
            ))}
            <button onClick={addTab}>+</button>
        </div>
        <label>Filename: </label>
        <input id='filename-editor'></input>
        <input id="file-picker" hidden type={"file"} onChange={handleFile} onClick={handleClick} accept=".txt,text/plain,.gph,.sgf"/>
        
        <div className=''>
        <Editor
            height="60vh"
            defaultLanguage='markdown'
            defaultValue=''
            onMount={handleEditorDidMount}
        />
        </div>
        <div>
            <button id="save-locally" onClick={saveFile}>Save File</button>
            <button id="editor-button" data-testid="editor-button" onClick={uploadGraph}>Load Graph</button>
        </div>

    </div>;
};

export default GraphInput;
