import './AlgorithmConsole.scss'

import { useState, useRef } from "react";

export default function AlgorithmConsole(props) {
    const [textAreaValue, setTextAreaValue] = useState("");

    let textAreaRef = useRef(null);

    function addNewMessage(message) {
        setTextAreaValue(textAreaValue + message + "\n");
        textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    };

    props.onSetupConsole(addNewMessage);

    return <div className="AlgorithmConsole">
        <label> Console </label>
        <textarea value={textAreaValue} disabled ref={textAreaRef} />
    </div>;
}
