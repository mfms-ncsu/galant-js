import './App.scss';

import Graph from 'frontend/Graph/Graph';
import Algorithm from 'frontend/Algorithm/Algorithm';
/**
 * A react component for the main app page.
 * 
 * @param {Object} props - This component has no properties.
 * 
 * @returns {HTML} - The HTML representation of the component.
 */
function App(props) {
    return <div className="App">
        <Algorithm />
        <Graph />
    </div>;
}

export default App;