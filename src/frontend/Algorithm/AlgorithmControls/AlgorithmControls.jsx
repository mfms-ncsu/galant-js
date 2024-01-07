import React, { useContext } from 'react';
import './AlgorithmControls.scss';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import { IconButton } from '@mui/material';
import GraphContext from 'frontend/GraphContext.jsx';

import { useEffect } from "react";

export default function AlgorithmControls(props) {

    const {status, stepForward, stepBack} = useContext(GraphContext);

    function frontButtonPress() {
        stepForward();
    } 

    function backButtonPress() {
        stepBack();
    }   

    function handleKeyPress(event) {
        if (event.key === 'ArrowLeft') {
            backButtonPress();
        }
        else if (event.key === 'ArrowRight') {
            frontButtonPress();
        }
    }

    //the windowlistener for back for forward and backward button presses
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress, true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="AlgorithmControls">

            <div className='arrow'>
                <IconButton id='forwardbutton' size="large" disabled={!status.canStepBack} onClick={() => backButtonPress()}>
                    <ArrowCircleLeftRoundedIcon size="large" />
                </IconButton>
            </div>
            <div className='stepcounter'>
                <p>Step {status.displayState}/{status.algorithmState}</p>
            </div>
            <div className='arrow'>
                <IconButton id='forwardbutton' size="large" disabled={!status.canStepForward} onClick={() => frontButtonPress()}>
                    <ArrowCircleRightRoundedIcon size="large" />
                </IconButton>
            </div>

        </div>
    );
}
