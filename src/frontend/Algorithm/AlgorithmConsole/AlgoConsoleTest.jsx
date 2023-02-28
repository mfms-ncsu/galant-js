import React, { useState } from "react";
import AlgorithmConsole from "./AlgorithmConsole";

function AlgoConsoleTest() {
    const [textAreaValue, setTextAreaValue] = useState("");

    const handleButtonClick = () => {
        console.log("h")
        setTextAreaValue(textAreaValue + "New value from button click");
    };

    return (
        <>
            <AlgorithmConsole onChange={setTextAreaValue} textAreaValue={textAreaValue} />
            <button onClick={handleButtonClick}>Update Text Area</button>
        </>
    );
}

export default AlgoConsoleTest;




