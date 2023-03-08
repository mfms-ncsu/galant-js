import React, { useState } from 'react';
import AlgorithmConsole from 'frontend/Algorithm/AlgorithmConsole/AlgorithmConsole';
import AlgorithmInput from 'frontend/Algorithm/AlgorithmInput/AlgorithmInput';
import AlgorithmControls from 'frontend/Algorithm/AlgorithmControls/AlgorithmControls';
import './Algorithm.scss'


function Algorithm(props) {
    /** @var {string} - The current loaded algorithm */
    const [algorithm, setAlgorithm] = useState("");
    /** @var {Predicates} - The function to add a message to the console */
    let addNewMessage = null;

    return <div className="Algorithm">
        <AlgorithmInput onUpload={(alg) => {addNewMessage("uploaded alg"); setAlgorithm(alg);}}/>
        <AlgorithmControls status={{algorithmState: 0, displayState: 0, canStepBack: true, canStepForward: true}}
            onForward={() => addNewMessage("forward")}
            onBack={() => addNewMessage("back")} />
        <AlgorithmConsole onSetupConsole={(func) => addNewMessage = func} />
    </div>;
}

export default Algorithm;
