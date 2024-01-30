import React, { useState } from 'react';
import AlgorithmInput from 'frontend/Algorithm/AlgorithmInput/AlgorithmInput';
import './Algorithm.scss'

function Algorithm(props) {
    const [sharedworker] = useState(new SharedWorker('./worker.js'));

    return <div className="Algorithm">
        
        <AlgorithmInput onUpload={(alg) => {
            sharedworker.port.postMessage([{
                'message': 'algo-init',
                'algorithm': alg
            }]);
        }}/>
    </div>;
}

export default Algorithm;
