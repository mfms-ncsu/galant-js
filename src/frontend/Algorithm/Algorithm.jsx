import React, { useState } from 'react';
import AlgoConsoleManager from './AlgorithmConsole/AlgoConsoleManager';
import AlgorithmInput from './AlgorithmInput/AlgorithmInput';
import AlgorithmButton from './AlgorithmButtons/AlgorithmButton';
import './Algorithm.scss'
import AlgorithmConsole from './AlgorithmConsole/AlgorithmConsole';
import { Button, View, StyleSheet } from 'react-native';


function Algorithm(props) {
  /** @var {Predicates} - The current loaded graph, in predicate form */
  const [algorithm, setAlgorithm] = useState({});

  return <div className="Algorithm">
    <AlgorithmInput />
    <AlgorithmButton/>
    <AlgoConsoleManager />
  </div>;
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
  },
  buttonContainer: {
      flex: 1,
  }
});

export default Algorithm;
