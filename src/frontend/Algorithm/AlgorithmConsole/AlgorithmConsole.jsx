import './AlgorithmConsole.scss'
import React, { useState } from 'react';

export function AlgorithmConsole(props) {


  // call the `onChange` method passed from parent component 
  // when the value of the textarea changes
  // React.useEffect(() => {
  //   console.log("g")
  //   props && props(value);
  // }, [value]);


  // This function updates the text value when called
  return (
    <div className="AlgorithmConsole">
      <label> Console </label>
      <textarea value={props.textAreaValue} disabled > </textarea>
    </div>
  )
};

export default AlgorithmConsole;