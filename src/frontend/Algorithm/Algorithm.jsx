import React, { useState, useContext, useEffect } from 'react';
import AlgorithmConsole from 'frontend/Algorithm/AlgorithmConsole/AlgorithmConsole';
import AlgorithmInput from 'frontend/Algorithm/AlgorithmInput/AlgorithmInput';
import AlgorithmControls from 'frontend/Algorithm/AlgorithmControls/AlgorithmControls';
import './Algorithm.scss'
import AlgorithmHandler from 'backend/Algorithm/AlgorithmHandler';
import GraphContext from 'frontend/GraphContext';

function Algorithm(props) {
    /** @var {status} - The current status */
    const [status, setStatus] = useState({displayState: 0, algorithmState: 0, canStepForward: false, canStepBack: false});
    /** @var {string} - The current loaded algorithm */
    const [algorithm, setAlgorithm] = useState("");

    const [graph, loadGraph, updateGraph, registerOnLoad] = useContext(GraphContext);

    const [algHandler, setAlgHandler] = useState(null);
    useEffect(() => {
        if (algHandler != null) {
            registerOnLoad((graph) => algHandler.setGraph(graph));
        }
    }, [algHandler])

    return <div className="Algorithm">
        <AlgorithmInput onUpload={(alg) => {
            algHandler.setAlgorithm(alg);
            setAlgorithm(alg);
        }}/>
        <AlgorithmControls status={status}
            onForward={() => algHandler.stepForward()}
            onBack={() => algHandler.stepBack()} />
        <AlgorithmConsole onSetupConsole={(addNewMessage) => {
            setAlgHandler(new AlgorithmHandler(graph, algorithm, updateGraph, addNewMessage, setStatus));
        }} />
    </div>;
}

export default Algorithm;
