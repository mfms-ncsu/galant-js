import React, { useState } from 'react';
import AlgoConsoleManager from './AlgorithmConsole/AlgoConsoleManager';
import AlgorithmInput from './AlgorithmInput/AlgorithmInput';
import AlgorithmButton from './AlgorithmButtons/AlgorithmButton';
import './Algorithm.scss'


function Algorithm(props) {
  /** @var {Predicates} - The current loaded graph, in predicate form */
  const [algorithm, setAlgorithm] = useState({});

  return <div className="Algorithm">
    <AlgorithmInput />
    <AlgorithmButton/>
    <AlgoConsoleManager />
  </div>;
}


export default Algorithm;
