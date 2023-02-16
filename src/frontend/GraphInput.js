import { useState } from "react";
import { parseText } from '../backend/FileToPredicate';

/**
 * This function loads an upload graph button and parses the graph input into a text area on the bottom right of the screen
 * @author rskarwa
 * @returns a dynamically rendered HTML page with an upload graph button and text area
 */
function GraphInput() {

    //use state allows a field to dynamically change upon an event
    var [textValue, setTextValue] = useState("");
    var [fileName, setFileName] = useState("");

    /**
     * This function parses the file from the selected upload graph button
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
        return parseText(file)
      };
  
    };
    return (
      <div style={{ display: "block" }}>
        <label htmlFor="filePicker" style={{ position: "absolute", top: 0, left: 0, background: "grey", padding: "1px 7px 2pxx", appearance: "button", color: "buttontext" }}>
          Upload Graph
        </label>
        <input id="filePicker" style={{ visibility: "hidden" }} type={"file"} onChange={handleChange} />
        <div
        >{fileName}</div>
        <textarea
          cols={60}
          rows={15}
          value={textValue}
          onChange={setTextValue}
          style={{ marginTop: 15, position: "absolute", bottom: 30, right: 30 }}
        ></textarea>
      </div>
    );
  };
  
  export default GraphInput;