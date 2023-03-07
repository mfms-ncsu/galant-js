import React, { useState } from "react";
import AlgorithmConsole from "./AlgorithmConsole";

function AlgoConsoleManager() {
    const [textAreaValue, setTextAreaValue] = useState("");

    function handleButtonClick(message) {
        setTextAreaValue(textAreaValue + "message");
    };

    return (
        <>
            <AlgorithmConsole onChange={setTextAreaValue} textAreaValue={textAreaValue} />
            <button id= "messagebutton" hidden onClick={e => handleButtonClick(e.target.value)}></button>
        </>
    );
}

export default AlgoConsoleManager;




