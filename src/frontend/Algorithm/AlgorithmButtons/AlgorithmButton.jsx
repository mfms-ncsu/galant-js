import Forward from "./forward_arrow.png"
import Backward from "./backward_arrow.png"
import './AlgorithmButton.scss'
import { useEffect } from "react"


function handleKeyPress(event) {
  if (event.key === 'ArrowLeft') {
    backButtonPress()
  }
  else if (event.key === 'ArrowRight') {
    frontButtonPress()
  }
}

function backButtonPress() {
  if (!document.getElementById("backbutton").disabled) {
    console.log("back")
  }
}

function frontButtonPress() {
  if (!document.getElementById("forwardbutton").disabled) {
    console.log("front")
  }
}



function AlgorithmButton(props) {

  //the windowlistener for back for forward and backward button presses
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, true)
  }, [])

  return (
    <div className="AlgorithmButton" style={{
      display: "flex",
      justifyContent: "center",
    }}>
      <button id = "backbutton" disabled={!props.back} onClick={backButtonPress}><img src={Backward} alt="backward arrow"  /></button>
      <button id = "forwardbutton" disabled={!props.front} onClick={frontButtonPress}><img src={Forward} alt="forward arrow" /></button>
    </div>
  );
}

export default AlgorithmButton;
