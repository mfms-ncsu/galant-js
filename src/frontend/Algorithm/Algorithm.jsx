import React, { useState } from 'react';
import AlgoConsoleTest from './AlgorithmConsole/AlgoConsoleTest';
import AlgorithmInput from './AlgorithmInput/AlgorithmInput';
import './Algorithm.scss'
import AlgorithmConsole from './AlgorithmConsole/AlgorithmConsole';

function Algorithm(props) {
  /** @var {Predicates} - The current loaded graph, in predicate form */
  const [algorithm, setAlgorithm] = useState({});

  return <div className="Algorithm">
    <AlgorithmInput />
    <AlgoConsoleTest />
  </div>;
}

export default Algorithm;
