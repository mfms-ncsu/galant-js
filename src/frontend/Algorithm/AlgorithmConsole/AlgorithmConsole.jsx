import './AlgorithmConsole.scss'
import React, { useState } from 'react';

export function AlgorithmConsole(props) {

  // This function updates the text value when called
  return (
    <div className="AlgorithmConsole">
      <label> Console </label>
      <textarea value={props.textAreaValue} disabled > </textarea>
    </div>
  )
};

export default AlgorithmConsole;