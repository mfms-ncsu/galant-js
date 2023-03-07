import './AlgorithmControls.scss'

import Forward from "./forward_arrow.png"
import Backward from "./backward_arrow.png"

import { useEffect } from "react"

export default function AlgorithmControls(props) {

    function frontButtonPress() {
        if (!document.getElementById("forwardbutton").disabled) {
            props.onForward();
        }
    } 

    function backButtonPress() {
        if (!document.getElementById("backbutton").disabled) {
            props.onBack();
        }
    }   

    function handleKeyPress(event) {
        if (event.key === 'ArrowLeft') {
            frontButtonPress();
        }
        else if (event.key === 'ArrowRight') {
            backButtonPress();
        }
    }

    //the windowlistener for back for forward and backward button presses
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress, true)
    }, [])

    return (
        <div className="AlgorithmControls" style={{
        }}>
            <button id="backbutton"
                disabled={!props.status.canStepBack}
                onClick={backButtonPress}>
                <img src={Backward} alt="backward arrow"/>
            </button>
            <button id="forwardbutton"
                disabled={!props.status.canStepForward}
                onClick={frontButtonPress}>
                <img src={Forward} alt="forward arrow"/>
            </button>
        </div>
    );
}
