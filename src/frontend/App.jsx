import './App.scss';

import reactManifest from "react-manifest"
import Graph from 'frontend/Graph/Graph';
import {GraphProvider} from 'frontend/GraphContext';
import AlgorithmControls from 'frontend/Algorithm/AlgorithmControls/AlgorithmControls';
import GraphPanel from './Graph/GraphPanel/GraphPanel';
import {useState} from 'react';
import Navbar from './Navbar/Navbar';

/**
 * A react component for the main app page.
 *
 * @param {Object} props - This component has no properties.
 *
 * @returns {HTML} - The HTML representation of the component.
 */
function App(props) {
    let [displaySidebar, setdisplaySidebar] = useState(false);

    return <div className="App">
        <link rel="manifest" id="manifest-placeholder" href="./manifest.webmanifest"  />
        <Navbar setdisplaySidebar={setdisplaySidebar} displaySidebar={displaySidebar} />
        <GraphProvider>
            <Graph displaySidebar={displaySidebar} />
            <AlgorithmControls />
        </GraphProvider>
    </div>;
}

export default App;
