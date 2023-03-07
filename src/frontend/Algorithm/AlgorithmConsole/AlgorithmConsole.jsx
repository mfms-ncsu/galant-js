import React, { useState } from "react";
import AlgorithmConsole from "./AlgorithmConsole";

export default function AlgorithmConsole(props) {
    const [textAreaValue, setTextAreaValue] = useState(null);

    if (textAreaValue = null) {
        setTextAreaValue("");

        function addNewMessage(message) {
            setTextAreaValue(textAreaValue + message);
        };

        props.onSetupConsole(addNewMessage);
    }

    return <div className="AlgorithmConsole">
        <label> Console </label>
        <textarea value={props.textAreaValue} disabled > </textarea>
    </div>;
}




