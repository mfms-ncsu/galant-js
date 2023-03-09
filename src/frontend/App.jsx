import './App.scss';

import Graph from 'src/frontend/Graph/Graph';

/**
 * A react component for the main app page.
 * 
 * @param {Object} props - This component has no properties.
 * 
 * @returns {HTML} - The HTML representation of the component.
 */
function App(props) {
    return <div className="App">
        <Graph />
    </div>;
}

export default App;