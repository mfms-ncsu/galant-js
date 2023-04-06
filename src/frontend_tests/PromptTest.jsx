import './PromptTest.scss';

import App from 'frontend/App';

import { Link } from 'react-router-dom';

/**
 * A React component providing a page to test the prompt section of the API.
 * 
 * @returns {HTML} - The HTML representation of the component.
 * 
 * @author Art Schell
 */
export default function PromptTest() {
	return <div className="PromptTest">
		<div className="scrollable">
			<h1>Prompt Test</h1>
			<p>This page is meant for testing the GraphInput class. Perform the following tests:</p>
			<p>1. Download <Link to="/tests/prompt/algorithm.js" target="_blank" download>algorithm.js</Link>. 
				Press the Upload Algorithm button and upload this file.</p>
			<p>2. Press the Forward button. You should be prompted for a message.</p>
            <p>3. Enter "hello world" into the prompt box. "hello world" should appear in the graph window.</p>
			<p>4. Press the Forward button. You should be prompted for true/false.</p>
			<p>5. Enter "hello world". You should be prompted again with an error saying you must pick true/false.</p>
			<p>6. Enter "false". "You entered false" should appear in the graph window.</p>
			<p>7. Press the Forward button. You should be prompted for an integer.</p>
			<p>8. Enter "hello world". You should be prompted again with an error saying you must pick an integer.</p>
            <p>9. Enter "3.7". "Counted to 3" should appear in the graph window.
                The numbers 0 to 3 should appear in the console.</p>
			<p>10. Press the Forward button. You should be prompted for a number.</p>
			<p>11. Enter "hello world". You should be prompted again with an error saying you must pick a number.</p>
            <p>12. Enter "3.7". "The sum of 3 and 3.7 is 6.7" should appear in the graph window.</p>
			<p>13. Press the Forward button. You should recieve an error saying you cannot use promptNode without any nodes.</p>
			<p>14. Download <Link to="/tests/prompt/graph_noedges.txt" target="_blank" download>graph_noedges.txt</Link>. 
				Press the Upload Graph button and upload this file.</p>
            <p>15. Repeat steps 2-12 to get back to where you were.</p>
			<p>16. Press the Forward button. You should be prompted for a node.</p>
            <p>17. Enter "hello world". You should be prompted again with an error saying you must pick node A, B, or C.</p>
            <p>18. Enter "B". Node B should be marked.</p>
			<p>19. Press the Forward button. You should recieve an error saying you cannot use promptEdge without any edges.</p>
			<p>20. Download <Link to="/tests/prompt/graph.txt" target="_blank" download>graph.txt</Link>. 
				Press the Upload Graph button and upload this file.</p>
            <p>21. Repeat steps 15-18 to get back to where you were.</p>
			<p>22. Press the Forward button. You should be prompted for an edge.</p>
            <p>23. Enter "hello world". You should be prompted again with an error saying you must pick edge A B, B A, B C, or C A.</p>
            <p>24. Enter "B A". You should be prompted for a color.</p>
            <p>25. Enter "hello world". You should be prompted again with an error saying you must pick red, green, or blue.</p>
            <p>26. Enter "red". The edge pointing from B to A should turn red.</p>
            <p>27. Repeatedly press the Back button to return to the start of the algorithm.</p>
            <p>28. Repeatedly press the Forward button. The algorithm should replay, and you should never be prompted again.</p>
		</div>
        <App />
    </div>;
}