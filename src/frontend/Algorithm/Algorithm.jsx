import React, { useState } from 'react';
import AlgorithmConsole from 'frontend/Algorithm/AlgorithmConsole/AlgorithmConsole';
import AlgorithmInput from 'frontend/Algorithm/AlgorithmInput/AlgorithmInput';
import AlgorithmControls from 'frontend/Algorithm/AlgorithmControls/AlgorithmControls';
import './Algorithm.scss'

function Algorithm(props) {
  /** @var {string} - The current loaded algorithm */
  const [algorithm, setAlgorithm] = useState("");
  /** @var {Predicates} - The function to add a message to the console */
  const [addNewMessage, setAddNewMessage] = useState(() => void 0);

  return <div className="Algorithm">
    <AlgorithmInput onUpload={setAlgorithm}/>
    <AlgorithmControls onForward={console.log("forward")} onBack={console.log("back")} />
    <AlgorithmConsole onSetupConsole={setAddNewMessage} />
  </div>;
}

export default Algorithm;
