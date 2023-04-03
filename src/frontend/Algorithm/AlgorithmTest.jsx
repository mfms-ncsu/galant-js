import './AlgorithmTest.scss';

import Graph from 'frontend/Graph/Graph';
import GraphViewer from 'frontend/Graph/GraphViewer/GraphViewer';
import GraphContext from 'frontend/GraphContext';
import App from 'frontend/App';

import { Link } from 'react-router-dom';

import { useState, useContext } from 'react'

/**
 * A React component providing a page to test the GraphInput class.
 * 
 * To use this test, replace <App /> in the index.js file with this component.
 * 
 * @returns {HTML} - The HTML representation of the component.
 * 
 * @author Art Schell
 */
export default function AlgorithmTest() {
	return <div className="AlgorithmTest">
		<div className="scrollable">
			<h1>Algorithm Test</h1>
			<p>This page is meant for testing the GraphInput class. Perform the following tests:</p>
			<p>1. Download <Link to="/tests/algorithm/graph.txt" target="_blank" download>graph.txt</Link>. 
				Press the Upload Graph button and upload this file.</p>
			<p>2. Download <Link to="/tests/algorithm/markAllNodes.js" target="_blank" download>markAllNodes.js</Link>. 
				Press the Upload Algorithm button and upload this file.</p>
			<p>3. Press the Forward button. Node A should be marked on the graph.
				A message should appear on the on-screen console saying "Marked A".
				"Step 1/1" should appear next to the algorithm controls.</p>
			<p>4. Repeat Step 3 three more times. This time, B, C, and D should be marked.</p>
			<p>5. Press the Forward button. The text "Marked all nodes" should appear in the graph window.
				"Step 5/5" should appear next to the algorithm controls.</p>
			<p>6. Press the Forward Button again. It should become greyed out.
				"Algorithm completed" should appear in the console.</p>
			<p>7. Press the Back button. The text "Marked all nodes" should dissapear from the graph window.
				"Step 4/5" should appear next to the algorithm controls.</p>
			<p>8. Press the Back button four times. The nodes in the graph window should become unmarked.
				"Step 0/5" should appear next to the algorithm controls.</p>
			<p>9. Use the mouse to drag the nodes in the graph to new positions.</p>
			<p>10. Press the Right Arrow key on the keyboard. Node A should become marked.
				The graph nodes should remain in the same positions you dragged them to.
				No new messages should appear in the console.</p>
			<p>11. Press the Left Arrow key on the keyboard. Node A should become unmarked.</p>
			<p>12. Hold the Right Arrow key down. The entire algorithm should run, leaving all nodes marked.</p>
			<p>13. Upload the graph again using the Upload Graph button. The graph should return to its
				original state, including the positions of each node moving back to their original positions.
				"Step 0/0" should appear next to the algorithm controls.</p>
			<p>14. Run through the algorithm again, then reupload the algorithm. The graph and algorithm state should
				be reset in the same way as in Step 13.</p>
			<p>15. Download <Link to="/tests/algorithm/syntaxError.js" target="_blank" download>syntaxError.js</Link>. 
				Press the Upload Algorithm button and upload this file.</p>
			<p>16. Press the Forward button. An error popup should appear, noting that line 2 has a syntax error.
				The error should also appear in the console. No message should appear in the graph window.</p>
			<p>17. Download <Link to="/tests/algorithm/runtimeError.js" target="_blank" download>runtimeError.js</Link>. 
				Press the Upload Algorithm button and upload this file.</p>
			<p>18. Press the Forward button. "Hello World" should appear in the graph window.</p>
			<p>19. Press the Forward button. An error popup should appear, noting that line 2 has a runtime error.
				The error should also appear in the console.</p>
			<p>20. Download <Link to="/tests/algorithm/infiniteLoop.js" target="_blank" download>infiniteLoop.js</Link>. 
				Press the Upload Algorithm button and upload this file.</p>
			<p>21. Press the Forward button. "Infinite Loop" should appear repeatedly in the console.
				The Forward button should be greyed out. After a few seconds, an error popup should appear.
				The error should also appear in the console.</p>
		</div>
        <App />
    </div>;
}