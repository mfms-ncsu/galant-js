import './GraphViewerTest.scss';

import GraphViewer from 'frontend/Graph/GraphViewer/GraphViewer';

import { useState } from 'react'

/**
 * A React component providing a page to test the GraphViewer class.
 * 
 * To use this test, replace <App /> in the index.js file with this component.
 * 
 * @returns {HTML} - The HTML representation of the component.
 * 
 * @author Art Schell
 */
function GraphViewerTest() {
	/** @var {Predicate} - The Predicate form of the currently displayed graph. */
	let [graph, setGraph] = useState(plainGraph)
  
	return <div className="GraphViewerTest">
		<div class="scrollable">
			<h1>Graph Viewer Test</h1>
			<p>This page is meant for testing the GraphViewer class. Perform the following tests:</p>
			<p>1. Press <button onClick={() => setGraph(plainGraph)}>{"Load Plain Graph"}</button>.
				An all-black graph with node numbers but no labels should appear.</p>
			<p>2. Press <button onClick={() => setGraph(labeledGraph)}>{"Load Labeled Graph"}</button>.
				Labels should appear for every node and edge. The labels should appear on top of the edges.</p>
			<p>3. Press <button onClick={() => setGraph(weightedGraph)}>{"Load Weighted Only Graph"}</button>.
				The labels should be replaced by weights. There should be integer, decimal, and negative weights.</p>
			<p>4. Press <button onClick={() => setGraph(weightedLabeledGraph)}>{"Load Weighted Labeled Graph"}</button>.
				Both the weights and labels should appear in the same box. The weights should be above the labels. </p>
			<p>5. Press <button onClick={() => setGraph(coloredGraph)}>{"Load Colored Graph"}</button>.
				The weights and labels should dissapear. The graph should now have red and blue nodes and edges.</p>
			<p>6. Press <button onClick={() => setGraph(directedGraph)}>{"Load Directed Graph"}</button>.
				The colors should return to black. Each edge should now be directional, showing an arrow.</p>
			<p>7. Press <button onClick={() => setGraph(markedGraph)}>{"Load Marked Graph"}</button>.
				The arrows should disappear. Now, some vertices should be 'marked' by being shaded orange.
				Some vertices and edges should be 'highlighted' by being displayed in bold.</p>
			<p>8. Using the mouse, you should be able to move the graph nodes and camera around.</p> 
			<p>9. Repeat tests 1-7. The same changes should take place,
				with the nodes and camera remaining in their new positions.</p>
			<p>10. Drag the nodes on top of each other, such that the structure of the graph is unclear.
				Press the Auto-Layout button on the graph viewer and the nodes should move to reasonable positions.</p> 
			<p>11. Move the camera far away from the nodes such that they are no longer in view by panning or zooming.
				Press the Auto-Camera button on the graph viewer and the camera should move to a reasonable position.</p> 
		</div>
        <GraphViewer predicates={graph}></GraphViewer>
    </div>;
}

/** @const {Predicate} - The predicates for a plain graph with no extra visual properties. */
const plainGraph = {
	node: {
		'1': {x: 0, y: 0},
		'2': {x: 100, y: 0},
		'3': {x: 100, y: 100},
		'4': {x: 200, y: 0},
		'5': {x: 200, y: 100},
	},
	undirected: {
		1: {source: '1', target: '2'},
		2: {source: '2', target: '3'},
		3: {source: '2', target: '4'},
		4: {source: '4', target: '5'},
		5: {source: '5', target: '1'},
	},
	directed: {},
};

/** @const {Predicate} - The predicates for a graph with labels. */
const labeledGraph = {
	node: {
		'1': {x: 0, y: 0, label: 'Node A'},
		'2': {x: 100, y: 0, label: 'Node B'},
		'3': {x: 100, y: 100, label: 'Node C'},
		'4': {x: 200, y: 0, label: 'Node D'},
		'5': {x: 200, y: 100, label: 'Node E'},
	},
	undirected: {
		1: {source: '1', target: '2', label: 'Edge AB'},
		2: {source: '2', target: '3', label: 'Edge BC'},
		3: {source: '2', target: '4', label: 'Edge BD'},
		4: {source: '4', target: '5', label: 'Edge DE'},
		5: {source: '5', target: '1', label: 'Edge EA'},
	},
	directed: {},
};

/** @const {Predicate} - The predicates for a graph with weights. */
const weightedGraph = {
	node: {
		'1': {x: 0, y: 0, weight: 3},
		'2': {x: 100, y: 0, weight: 5},
		'3': {x: 100, y: 100, weight: 99},
		'4': {x: 200, y: 0, weight: 0.2},
		'5': {x: 200, y: 100, weight: 4},
	},
	undirected: {
		1: {source: '1', target: '2', weight: 67},
		2: {source: '2', target: '3', weight: 703},
		3: {source: '2', target: '4', weight: 727},
		4: {source: '4', target: '5', weight: 3.14},
		5: {source: '5', target: '1', weight: -30},
	},
	directed: {},
};

/** @const {Predicate} - The predicates for a graph with labels and weights. */
const weightedLabeledGraph = {
	node: {
		'1': {x: 0, y: 0, label: 'Node A', weight: 3},
		'2': {x: 100, y: 0, label: 'Node B', weight: 5},
		'3': {x: 100, y: 100, label: 'Node C', weight: 99},
		'4': {x: 200, y: 0, label: 'Node D', weight: 0.2},
		'5': {x: 200, y: 100, label: 'Node E', weight: 4},
	},
	undirected: {
		1: {source: '1', target: '2', label: 'Edge AB', weight: 67},
		2: {source: '2', target: '3', label: 'Edge BC', weight: 703},
		3: {source: '2', target: '4', label: 'Edge BD', weight: 727},
		4: {source: '4', target: '5', label: 'Edge DE', weight: 3.14},
		5: {source: '5', target: '1', label: 'Edge EA', weight: -30},
	},
	directed: {},
};

/** @const {Predicate} - The predicates for a graph with colors. */
const coloredGraph = {
	node: {
		'1': {x: 0, y: 0, color: 'red'},
		'2': {x: 100, y: 0, color: 'blue'},
		'3': {x: 100, y: 100, color: 'red'},
		'4': {x: 200, y: 0, color: 'red'},
		'5': {x: 200, y: 100, color: 'blue'},
	},
	undirected: {
		1: {source: '1', target: '2', color: 'blue'},
		2: {source: '2', target: '3', color: 'red'},
		3: {source: '2', target: '4', color: 'red'},
		4: {source: '4', target: '5', color: 'blue'},
		5: {source: '5', target: '1', color: 'blue'},
	},
	directed: {},
};

/** @const {Predicate} - The predicates for a graph with directed edges. */
const directedGraph = {
	node: {
		'1': {x: 0, y: 0},
		'2': {x: 100, y: 0},
		'3': {x: 100, y: 100},
		'4': {x: 200, y: 0},
		'5': {x: 200, y: 100},
	},
	undirected: {},
	directed: {
		1: {source: '1', target: '2'},
		2: {source: '2', target: '3'},
		3: {source: '2', target: '4'},
		4: {source: '4', target: '5'},
		5: {source: '5', target: '1'},
	},
};

/** @const {Predicate} - The predicates for a graph with marked and highlighted vertices and edges. */
const markedGraph = {
	node: {
		'1': {x: 0, y: 0, marked: true, highlighted: false},
		'2': {x: 100, y: 0, marked: false, highlighted: true},
		'3': {x: 100, y: 100, marked: true, highlighted: true},
		'4': {x: 200, y: 0, marked: false, highlighted: false},
		'5': {x: 200, y: 100, marked: true, highlighted: false},
	},
	undirected: {
		1: {source: '1', target: '2', highlighted: false},
		2: {source: '2', target: '3', highlighted: true},
		3: {source: '2', target: '4', highlighted: false},
		4: {source: '4', target: '5', highlighted: true},
		5: {source: '5', target: '1', highlighted: true},
	},
	directed: {},
};

export default GraphViewerTest;