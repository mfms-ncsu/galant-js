import './AlgorithmConsole.scss'

import { useState, useRef, useEffect } from "react";

export default function AlgorithmConsole(props) {
    const [textAreaValue, setTextAreaValue] = useState("");
    let ref = useRef();
    ref.current = textAreaValue;

    let textAreaRef = useRef(null);

    function addNewMessage(message) {
        let newText = ref.current + message + "\n";
        setTextAreaValue(newText);
        ref.current = newText;
        textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    };

    useEffect(() => {
        props.onSetupConsole(addNewMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className="AlgorithmConsole">
        <label> Console </label>
        <textarea value={textAreaValue} disabled ref={textAreaRef} />
    </div>;
}
