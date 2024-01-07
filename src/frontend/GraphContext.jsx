import React, {useEffect, useRef, useState} from 'react';

import {enablePatches, applyPatches} from "immer";
import Graph from 'backend/Graph/Graph';
import AlgorithmHandler from 'backend/Algorithm/AlgorithmHandler';
import Toast from 'react-bootstrap/Toast';
import { ToastContainer } from 'react-bootstrap/esm';


enablePatches();

const GraphContext = React.createContext({
    graph: null,
    startGraph: () => {},
    loadGraph: () => {},
    updateGraph: () => {},
    registerOnLoad: () => {},
    postWorker: () => {},
    status: null,
    stepForward: () => {},
    stepBack: () => {}
});

//start shared worker here

export function GraphProvider({ children }) {
    const [graph, setGraph] = useState(() => new Graph({}, {}, false, ""));
    const [startGraph, setStartGraph] = useState(() => new Graph({}, {}, false, ""));
    const [isReady, setIsReady] = useState(false);

    const [toasts, setToasts] = useState([]);


    /** @var {status} - The current status */
    const [status, setStatus] = useState({displayState: 0, algorithmState: 0, canStepForward: false, canStepBack: false});
    /** @var {string} - The current loaded algorithm */
    const [algorithm, setAlgorithm] = useState("");
    

    /* useEffect(() => {
        if (algHandler != null) {
            registerOnLoad((graph) => algHandler.setGraph(graph));
            console.log(graph);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [algHandler]); */

    useEffect(() => {
        var date = new Date();

        var time = date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
        //console.log(time);

        setToasts([
            {
                "group": "Main",
                "date": time,
                "message": "Program Loaded Successfully"
            }
        ]);
    }, [])
    

    /** @var {string} - used for setting error box */
    var [algErrorMessage, setAlgErrorMessage] = useState("");
    var [algErrorTextValue, setAlgErrorTextValue] = useState("");
    var [algErrorTitle, setAlgErrorTitle] = useState("");
    var [algErrorIsPrompt, setAlgErrorIsPrompt] = useState(false);
    var [algPromptResult, setAlgPromptResult] = useState("");
    function clearErrors(e) {
        setAlgErrorMessage("");
        setAlgErrorTextValue("");
        setAlgErrorTitle("");
        if (algErrorIsPrompt) {
            algoH.current.enterPromptResult(algPromptResult); //TODO
        }
    }
    function setAlgError(errorObject, algFromThread) {
        setAlgErrorIsPrompt(false);
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
    function setAlgPrompt(promptMessage, promptError) {
        setAlgErrorTitle(promptMessage);
        setAlgErrorMessage(promptError);
        setAlgPromptResult("");
        setAlgErrorIsPrompt(true);
    }

    function addNewMessage(message) {
        console.log(message);
    }

    let algoH = useRef();
    
    const [loadGraph, setLoadGraph] = useState(() => (graph) => {
        console.log(graph);
        setGraph(graph);
        setStartGraph(graph);
        algoH.current.setGraph(graph);
    });

    function registerOnLoad(onLoad) {
        setLoadGraph(() => (g) => {
            loadGraph(g);
            onLoad(g);
        })
    }

    let graphRef = useRef();
    graphRef.current = graph;
    function updateGraph(patches) {
        let newGraph = applyPatches(graphRef.current, patches);
        setGraph(newGraph);
    }

    function applyAlgorithm(alg) {
        algoH.current.setAlgorithm(alg);
        setAlgorithm(alg);
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            algoH.current.enterPromptResult(document.getElementById('the-input-box').value);
            setAlgErrorMessage("");
            setAlgErrorTextValue("");
            setAlgErrorTitle("");
        }
    }

    const sharedworkerContainer = useRef(); 

    useEffect(() => {
        //init algorithm
        algoH.current = new AlgorithmHandler(graph, algorithm, updateGraph, addNewMessage, setStatus, setAlgError, setAlgPrompt);

        sharedworkerContainer.sharedworker = new SharedWorker('./worker.js');
        sharedworkerContainer.sharedworker.port.onmessage = ({data}) => {
            console.log(data);
            setIsReady(true);
            //everyone should update their graphs when they receive a graph init
            if(data['message'] === 'graph-init') {
                loadGraph(data['graph']);
                addToast("Graph", "A new Graph has been loaded successfully.")
                //console.log(algoH.current.graph);
            } else if (data['message'] === 'graph-update') {
                updateGraph(data['patches']);
            //if new worker sync the graph with everyone
            } else if (data['message'] === 'algo-init') {
                applyAlgorithm(data['algorithm']);
                //console.log(algoH.current);
                addToast("Algorithm", "A new Algorithm has been loaded successfully.")
            } else if (data['message'] === 'algo-step-forward') {
                algoH.current.stepForward();
            } else if (data['message'] === 'algo-step-back') {
                algoH.current.stepBack();
            }
        };

        postWorker({"message": "alive"});

        document.addEventListener('keydown', handleKeyPress, true);

    // eslint-disable-next-line
    }, []);
    
    
    function postWorker(text) {
        sharedworkerContainer.sharedworker.port.postMessage([text]);
    }

    function stepForward() {
        algoH.current.stepForward();
    }

    function stepBack() {
        algoH.current.stepBack();
    }


    function closeTab(index) {
        console.log(index);
        var temp = [...toasts];
        temp = temp.splice(index, index);
        setToasts(temp);
    }

    function addToast(group, message) {
        var date = new Date();

        var time = (date.getHours().toString()).padStart(2, '0') + ":" + (date.getMinutes().toString()).padStart(2, '0') + ":" + (date.getSeconds().toString()).padStart(2, '0');
        var toa = [...toasts, {
            "group": group,
            "date": time,
            "message": message
        }]

        console.log(toa);
        setToasts(toa);

    }

    
    return <GraphContext.Provider value={{graph, startGraph, loadGraph, updateGraph, registerOnLoad, postWorker, status, stepForward, stepBack}}>
        { (algErrorTitle && algErrorIsPrompt) &&
            <div className="alg-prompt-mask">
                <div id="algPrompt" className="alg-prompt">
                    <span className="alg-promptTitle">{algErrorTitle}</span>
                    <span data-testid="alg-errorMessage">{algErrorMessage}</span>
                    <input id='the-input-box' className='alg-prompt-box' onChange={(e) => setAlgPromptResult(e.target.value)} autofocus ></input>
                    <button onClick={clearErrors}>Okay</button>
                </div>
            </div>
        }
        { (algErrorMessage && !algErrorIsPrompt) && 
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
        <div className='toasts-map'>
        <ToastContainer position='top-end'>
        {toasts.map((value, index) => (
            <Toast onClose={() => closeTab(index)}>
                <Toast.Header>
                    <strong className="me-auto">{value["group"]}</strong>
                    <small>{value["date"]}</small>
                </Toast.Header>
                <Toast.Body>{value["message"]}</Toast.Body>
            </Toast>
        ))}
        </ToastContainer>
        </div>

        {isReady ? children : null}
        
    </GraphContext.Provider>
};

export default GraphContext;
