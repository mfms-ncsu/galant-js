import './AlgorithmInput.scss'

import { useState, useRef } from "react";
//fully featured editor in browser
import Editor from "@monaco-editor/react";


/**
 * This function loads an upload graph button and parses the graph input into a text area on the bottom right of the screen
 * 
 * @param {Object} props - The React properties of the component include:
 * @property {Function(Predicates)} handleChange - A callback function called whenever a file is uploaded.
 * 
 * @returns {HTML} - The HTML representation of the component.
 * 
 * @author Rishabh Karwa
 */
function AlgorithmInput(props) {
    /** @var {string} - The text contents of the currently loaded file. */
    // eslint-disable-next-line
    var [textValue, setTextValue] = useState("");
    /** @var {string} - The filename of the currently loaded file. */
    // eslint-disable-next-line
    var [fileName, setFileName] = useState("");

    var [tabAmount, setTabAmount] = useState(1);
    const [tabs,setTabs] = useState([{
        'key': 0,
        'filename': 0,
        'content': 'Upload a Graph or Edit one Here.' 
    }]);
    var [currentTab, setCurrentTab] = useState(0);
    
    const editorRef = useRef(null);

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


    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        editorRef.current.setValue(tabs[0]['content']);
        //if editor mounted we can setup everything
        console.log(tabs);
        document.getElementById('filename-editor').value = tabs[currentTab]['filename'];
        editorRef.current.setValue(tabs[currentTab]['content']);
        console.log(currentTab);
    }

    /**
     * This function parses the file from the selected upload algorithm button
     * 
     * @param {event} e - the event of selecting a file from the upload algorithm button
     */
    function onUpload(e) {

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

            editorRef.current.setValue(file);

            //props.onUpload(file); 
        };
    };

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

    function uploadAlgorithm() {
        props.onUpload(editorRef.current.getValue()); //load the algorithm
    }

    function handleClick(e) {
        e.target.value = ''
    }
    
    return <div className="AlgorithmInput">
        <div>
            <button id="editor_button" onClick={() => document.getElementById('algoPicker').click()}>
                Upload Algorithm
            </button>
            <input id="algoPicker" hidden type={"file"} onChange={onUpload} onClick={handleClick}/>
            
        </div>

        <div className="tab-locations">
            {tabs.map(value => (
                <button key="{value['key']}" onClick={() => currentChange(value['key'])}>{value['filename']}</button>
            ))}
            <button onClick={addTab}>+</button>
        </div>
        <label>Fileame: </label>
        <input id='filename-editor'></input>
        
        <Editor
            height="60vh"
            defaultLanguage='javascript'
            defaultValue='Upload a Algorithm or Edit one Here.
            
            '
            onMount={handleEditorDidMount}
        />
        <div className="controls">
            <button id="save-locally" onClick={saveFile}>Save File</button>
            <button id="load-algo"  onClick={uploadAlgorithm}>Load Algorithm</button>
        </div>
    </div>;
};


export default AlgorithmInput;
