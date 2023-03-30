import './GraphViewerTest.scss';

import Graph from 'backend/Graph/Graph';
import GraphViewer from 'frontend/Graph/GraphViewer/GraphViewer';
import GraphContext from 'frontend/GraphContext';

import { useState, useContext } from 'react'

/**
 * A React component providing a page to test the GraphViewer class.
 * 
 * To use this test, replace <App /> in the index.js file with this component.
 * 
 * @returns {HTML} - The HTML representation of the component.
 * 
 * @author Art Schell
 */
export default function GraphViewerTest() {
	/** @var {Predicate} - The Predicate form of the currently displayed graph. */
	let [graph, startGraph, setGraph, updateGraph, registerOnLoad] = useContext(GraphContext)

	function makeGraphFunc(graph) {
		return () => {
			let newGraph = new Graph(graph.nodes, graph.edges, graph.directed, graph.message);
			setGraph(newGraph);
		}
	}
  
	return <div className="GraphViewerTest">
		<div className="scrollable">
			<h1>Graph Viewer Test</h1>
			<p>This page is meant for testing the GraphViewer class. Perform the following tests:</p>
			<p>1. Press <button onClick={makeGraphFunc(plainGraph)}>{"Load Plain Graph"}</button>.
				An all-black graph with node numbers but no labels should appear.</p>
			<p>2. Press <button onClick={makeGraphFunc(labeledGraph)}>{"Load Labeled Graph"}</button>.
				Labels should appear for every node and edge. The labels should appear on top of the edges.</p>
			<p>3. Press <button onClick={makeGraphFunc(weightedGraph)}>{"Load Weighted Only Graph"}</button>.
				The labels should be replaced by weights. There should be integer, decimal, and negative weights.</p>
			<p>4. Press <button onClick={makeGraphFunc(weightedLabeledGraph)}>{"Load Weighted Labeled Graph"}</button>.
				Both the weights and labels should appear in the same box. The weights should be above the labels. </p>
			<p>5. Press <button onClick={makeGraphFunc(coloredGraph)}>{"Load Colored Graph"}</button>.
				The weights and labels should dissapear. The graph should now have red and blue nodes and edges.</p>
			<p>6. Press <button onClick={makeGraphFunc(markedGraph)}>{"Load Marked Graph"}</button>.
				Instead of being colored, some vertices and edges should be 'highlighted' by being displayed in bold.</p>
			<p>7. Press <button onClick={makeGraphFunc(directedGraph)}>{"Load Directed Graph"}</button>.
				The edges should now be directed, having arrows that point from one node to another.</p>
			<p>8. Press the Make Directed/Undirected button. The arrows should go away.</p>
			<p>9. Press the Make Directed/Undirected button again. The arrows should return.</p>
			<p>10. Using the mouse, you should be able to move the graph nodes and camera around.</p> 
			<p>11. Press <button onClick={() => updateGraph(
				[{op: "replace", path: ["message"], value: "Message"}]
			)}>{"Set Message"}</button>.
				The word "Message" should appear in the top right of the graph. The node positions should not change.</p>
			<p>12. Repeat test 1. The nodes should return to their original positions.</p>
			<p>13. Drag the nodes on top of each other, such that the structure of the graph is unclear.
				Press the Auto-Layout button on the graph viewer and the nodes should move to reasonable positions.</p> 
			<p>14. Move the camera far away from the nodes such that they are no longer in view by panning or zooming.
				Press the Auto-Camera button on the graph viewer and the camera should move to a reasonable position.</p> 
		</div>
        <GraphViewer predicates={graph}></GraphViewer>
    </div>;
}

/** @const {Predicate} - The predicates for a plain graph with no extra visual properties. */
const plainGraph = new Graph({
		'1': {x: 0, y: 0},
		'2': {x: 100, y: 0},
		'3': {x: 100, y: 100},
		'4': {x: 200, y: 0},
		'5': {x: 200, y: 100},
	}, {
		1: {source: '1', target: '2'},
		2: {source: '2', target: '3'},
		3: {source: '2', target: '4'},
		4: {source: '4', target: '5'},
		5: {source: '5', target: '1'},
	}, false, "");

/** @const {Predicate} - The predicates for a graph with labels. */
const labeledGraph = new Graph({
		'1': {x: 0, y: 0, label: 'Node A'},
		'2': {x: 100, y: 0, label: 'Node B'},
		'3': {x: 100, y: 100, label: 'Node C'},
		'4': {x: 200, y: 0, label: 'Node D'},
		'5': {x: 200, y: 100, label: 'Node E'},
	}, {
		1: {source: '1', target: '2', label: 'Edge AB'},
		2: {source: '2', target: '3', label: 'Edge BC'},
		3: {source: '2', target: '4', label: 'Edge BD'},
		4: {source: '4', target: '5', label: 'Edge DE'},
		5: {source: '5', target: '1', label: 'Edge EA'},
	}, false, "");

/** @const {Predicate} - The predicates for a graph with weights. */
const weightedGraph = new Graph({
		'1': {x: 0, y: 0, weight: 3},
		'2': {x: 100, y: 0, weight: 5},
		'3': {x: 100, y: 100, weight: 99},
		'4': {x: 200, y: 0, weight: 0.2},
		'5': {x: 200, y: 100, weight: 4},
	}, {
		1: {source: '1', target: '2', weight: 67},
		2: {source: '2', target: '3', weight: 703},
		3: {source: '2', target: '4', weight: 727},
		4: {source: '4', target: '5', weight: 3.14},
		5: {source: '5', target: '1', weight: -30},
	}, false, "");

/** @const {Predicate} - The predicates for a graph with labels and weights. */
const weightedLabeledGraph = new Graph({
		'1': {x: 0, y: 0, label: 'Node A', weight: 3},
		'2': {x: 100, y: 0, label: 'Node B', weight: 5},
		'3': {x: 100, y: 100, label: 'Node C', weight: 99},
		'4': {x: 200, y: 0, label: 'Node D', weight: 0.2},
		'5': {x: 200, y: 100, label: 'Node E', weight: 4},
	}, {
		1: {source: '1', target: '2', label: 'Edge AB', weight: 67},
		2: {source: '2', target: '3', label: 'Edge BC', weight: 703},
		3: {source: '2', target: '4', label: 'Edge BD', weight: 727},
		4: {source: '4', target: '5', label: 'Edge DE', weight: 3.14},
		5: {source: '5', target: '1', label: 'Edge EA', weight: -30},
	
	}, false, "");

/** @const {Predicate} - The predicates for a graph with colors. */
const coloredGraph = new Graph({
	'1': {x: 0, y: 0, color: 'red'},
		'2': {x: 100, y: 0, color: 'blue'},
		'3': {x: 100, y: 100, color: 'red'},
		'4': {x: 200, y: 0, color: 'red'},
		'5': {x: 200, y: 100, color: 'blue'},
	}, {
		1: {source: '1', target: '2', color: 'blue'},
		2: {source: '2', target: '3', color: 'red'},
		3: {source: '2', target: '4', color: 'red'},
		4: {source: '4', target: '5', color: 'blue'},
		5: {source: '5', target: '1', color: 'blue'},
	}, false, "");

/** @const {Predicate} - The predicates for a graph with directed edges. */
const directedGraph = new Graph({
		'1': {x: 0, y: 0},
		'2': {x: 100, y: 0},
		'3': {x: 100, y: 100},
		'4': {x: 200, y: 0},
		'5': {x: 200, y: 100},
	}, {
		1: {source: '1', target: '2'},
		2: {source: '2', target: '3'},
		3: {source: '2', target: '4'},
		4: {source: '4', target: '5'},
		5: {source: '5', target: '1'},
	}, true, "");

/** @const {Predicate} - The predicates for a graph with marked and highlighted vertices and edges. */
const markedGraph = new Graph({
		'1': {x: 0, y: 0, marked: true, highlighted: false},
		'2': {x: 100, y: 0, marked: false, highlighted: true},
		'3': {x: 100, y: 100, marked: true, highlighted: true},
		'4': {x: 200, y: 0, marked: false, highlighted: false},
		'5': {x: 200, y: 100, marked: true, highlighted: false},
	}, {
		1: {source: '1', target: '2', highlighted: false},
		2: {source: '2', target: '3', highlighted: true},
		3: {source: '2', target: '4', highlighted: false},
		4: {source: '4', target: '5', highlighted: true},
		5: {source: '5', target: '1', highlighted: true},
	}, false, "");