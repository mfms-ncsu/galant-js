import './GraphInputTest.scss';
import Graph from 'frontend/Graph/Graph';
import { Link } from 'react-router-dom';


/**
 * A React component providing a page to test the GraphInput class.
 * 
 * To use this test, replace <App /> in the index.js file with this component.
 * 
 * @returns {HTML} - The HTML representation of the component.
 * 
 * @author Art Schell
 */
export default function GraphViewerTest() {
	return <div className="GraphInputTest">
		<div className="scrollable">
			<h1>Graph Input Test</h1>
			<p>This page is meant for testing the GraphInput class. Perform the following tests:</p>
			<p>1. Download <Link to="/tests/graphInput/graph.txt" target="_blank" download>graph.txt</Link>. 
				Press the Upload Graph button and upload this file. The graph should look like this:</p>
			<img src="/tests/graphInput/expected.png" alt="what the expected graph should be"/>
			<p>2. Download <Link to="/tests/graphInput/invalid.txt" target="_blank" download>invalid.txt</Link>. 
				Press the Upload Graph button and upload this file. An error should appear.</p>
		</div>
        <Graph />
    </div>;
}