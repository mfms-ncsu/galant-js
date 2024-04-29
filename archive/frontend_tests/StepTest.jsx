import './StepTest.scss';

import App from 'pages/GraphView/App';

import { Link } from 'react-router-dom';

/**
 * A React component providing a page to test the stepping behavior API.
 * 
 * @returns {HTML} - The HTML representation of the component.
 * 
 * @author Art Schell
 */
export default function StepTest() {
	return <div className="StepTest">
		<div className="scrollable">
			<h1>Step Test</h1>
			<p>This page is meant for testing the stepping behavior of the API. Perform the following tests:</p>
			<p>1. Download <Link to="/tests/step/graph.txt" target="_blank" download>graph.txt</Link>. 
				Press the Upload Graph button and upload this file.</p>
			<p>2. Download <Link to="/tests/step/algorithm.js" target="_blank" download>algorithm.js</Link>. 
				Press the Upload Algorithm button and upload this file.</p>
			<p>3. Press the Forward button. "Automatic step" should appear in the graph window.</p>
			<p>4. Press the Forward button. Node A should be marked.</p>
			<p>5. Press the Forward button. Node B should be marked.</p>
			<p>6. Press the Forward button. Node C should be marked.</p>
			<p>7. Press the Forward button. All nodes should become unmarked.</p>
			<p>8. Press the Forward button. "Functional step" should appear in the graph window.</p>
			<p>9. Press the Forward button. All nodes should become marked.</p>
			<p>10. Press the Forward button. All nodes should become unmarked.</p>
			<p>11. Press the Forward button. "Manual step" should appear in the graph window.</p>
			<p>12. Press the Forward button. All nodes should become marked.</p>
			<p>13. Press the Forward button. All nodes should become unmarked.</p>
			<p>14. Press the Forward button. All nodes should become marked, and "Functional step" should appear in the graph window.</p>
			<p>15. Press the Forward button. All nodes should become unmarked.</p>
			<p>16. Press the Forward button. "Auto step was re-enabled" should appear in the graph window.</p>
		</div>
        <App />
    </div>;
}
