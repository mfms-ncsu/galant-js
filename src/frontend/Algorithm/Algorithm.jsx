import React, { useState, useContext, useEffect, useRef } from 'react';
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


    /** @var {string} - used for setting error box */
    var [algErrorMessage, setAlgErrorMessage] = useState("");
    var [algErrorTextValue, setAlgErrorTextValue] = useState("");
    var [algErrorTitle, setAlgErrorTitle] = useState("");
    function clearErrors(e) {
        setAlgErrorMessage("");
        setAlgErrorTextValue("");
        setAlgErrorTitle("");
    }
    function setAlgError(errorObject, algFromThread) {
        // if its a timeout error, we've set the line number to -1. And we don't need to do put the line here.
        if (errorObject.lineNumber === -1) {
            setAlgErrorTitle("Timeout Error. Likely an infinite loop.")
            setAlgErrorMessage(errorObject.toString())
            setAlgErrorTextValue("Your code took longer than 5 seconds to execute.\nFor technical reasons, we're not able to discern where in your code this occured.\nSorry!")
        } else {
            // its a regular error, so generate the data to go in the popup.
            setAlgErrorTitle("Error on line " + errorObject.lineNumber);
            setAlgErrorMessage(errorObject.toString());

            // we need to add the line numbers here
            // get the number of lines in the algorithm
            let splitAlg = algFromThread.toString().split(/\r\n|\r|\n/);
            let numLines = splitAlg.length;
            // make sure we offset by enough characters
            let offsetSize = ("" + numLines).length;
            let adjustedAlgText = "";
            splitAlg.forEach(function (line, i) {
                // generate the line number and offset
                // we star the line if it is the bad one
                let starTags = ["  ", "   "]
                // eslint-disable-next-line
                if (i + 1 == errorObject.lineNumber) {
                    starTags = ["**", "** "];
                }
                let offset = starTags[0] + ("" + (i + 1)).padStart(offsetSize) + starTags[1]
                adjustedAlgText = adjustedAlgText.concat("\n", offset, line)
            })

            setAlgErrorTextValue(adjustedAlgText)
        }
    }

    /* eslint-disable-next-line no-unused-vars */
    const [graph, startGraph, loadGraph, updateGraph, registerOnLoad] = useContext(GraphContext);


    const [algHandler, setAlgHandler] = useState(() => null);
    useEffect(() => {
        if (algHandler != null) {
            registerOnLoad((graph) => algHandler.setGraph(graph));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [algHandler])
    let ref = useRef();
    ref.current = algHandler;

    return <div className="Algorithm">
        { algErrorMessage &&
            <div className="alg-error-mask">
                <div id="algError" className="alg-parse-error">
                    <span className="alg-filename">{algErrorTitle}</span>
                    <span data-testid="alg-errorMessage">{algErrorMessage}</span>
                    <div className="alg-code-block-container">
                        <pre id="alg-text">{algErrorTextValue}</pre>
                    </div>
                    <button onClick={clearErrors}>Okay</button>
                </div>
            </div>
        }
        <AlgorithmInput onUpload={(alg) => {
            algHandler.setAlgorithm(alg);
            setAlgorithm(alg);
        }}/>
        <AlgorithmControls status={status}
            onForward={() => ref.current.stepForward()}
            onBack={() => ref.current.stepBack()} />
        <AlgorithmConsole onSetupConsole={(addNewMessage) => {
            setAlgHandler(new AlgorithmHandler(graph, algorithm, updateGraph, addNewMessage, setStatus, setAlgError));
        }} />
    </div>;
}

export default Algorithm;
