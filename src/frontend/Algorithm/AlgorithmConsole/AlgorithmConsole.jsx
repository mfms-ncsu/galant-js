import './AlgorithmConsole.scss'

import { useState, useRef, useEffect } from "react";

export default function AlgorithmConsole(props) {
    const [textAreaValue, setTextAreaValue] = useState("");
    let ref = useRef();
    ref.current = textAreaValue;

    let textAreaRef = useRef(null);

    function addNewMessage(message) {
        setTextAreaValue(ref.current + message + "\n");
        textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    };

    useEffect(() => {
        props.onSetupConsole(addNewMessage);
    }, [])

    return <div className="AlgorithmConsole">
        <label> Console </label>
        <textarea value={textAreaValue} disabled ref={textAreaRef} />
    </div>;
}
