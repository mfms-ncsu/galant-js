import './GraphViewerDemo.css';

import GraphViewer from './GraphViewer';

import React from 'react'

function GraphViewerDemo(props) {

	let [graph, setGraph] = React.useState(plainGraph)
  
	return <div className="GraphViewerDemo">
        <h1>Galant</h1>
		<br/>
		<button onClick={() => setGraph(plainGraph)}>{"Load Plain Graph"}</button>
		<button onClick={() => setGraph(weightedGraph)}>{"Load Weighted Graph"}</button>
		<button onClick={() => setGraph(coloredGraph)}>{"Load Colored Graph"}</button>
		<button onClick={() => setGraph(directedGraph)}>{"Load Directed Graph"}</button>
		<button onClick={() => setGraph(markedGraph)}>{"Load Marked Graph"}</button>
        <GraphViewer predicates={graph}></GraphViewer>
    </div>;
}

const plainGraph = [
	{ data: { id: '1', weight: '', label: 'Node 1', marked: false, highlighted: false, color: 'black'},
		position: { x: 0, y: 0 }},

	{ data: { id: '2', weight: 200, label: '', marked: false, highlighted: false, color: 'black'},
		position: { x: 100, y: 0 }},
	
	{ data: { id: '3', weight: '', label: '', marked: false, highlighted: false, color: 'black'},
		position: { x: 100, y: 100 }},
	
	{ data: { id: '4', weight: 400, label: 'Node 4', marked: false, highlighted: false, color: 'black'},
		position: { x: 200, y: 0 }},
	
	{ data: { id: '5', weight: 500, label: 'Node 5', marked: false, highlighted: false, color: 'black'},
		position: { x: 200, y: 100 }},

	{ data: { source: '1', target: '2', highlighted: false, color:'black', label: '30\nEdge 1'}},
	{ data: { source: '2', target: '3', highlighted: false, color:'black', label: '\nEdge 2'}},
	{ data: { source: '2', target: '4', highlighted: false, color:'black', label: '\nEdge 3'}},
	{ data: { source: '4', target: '5', highlighted: false, color:'black', label: '\nEdge 4'}},
	{ data: { source: '5', target: '1', highlighted: false, color:'black', label: '\nEdge 5'}},
]

const weightedGraph = [
	{ data: { id: '1', label: '1', parent: '1_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 0, y: 0 }},
	{ data: { id: '1_label', label: '10\nNode 1'}, classes: ['label']},

	{ data: { id: '2', label: '2', parent: '2_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 100, y: 0 }},
	{ data: { id: '2_label', label: '11\nNode 2'}, classes: ['label']},
	
	{ data: { id: '3', label: '3', parent: '3_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 100, y: 100 }},
	{ data: { id: '3_label', label: '12\nNode 3'}, classes: ['label']},
	
	{ data: { id: '4', label: '4', parent: '4_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 200, y: 0 }},
	{ data: { id: '4_label', label: '13\nNode 4'}, classes: ['label']},
	
	{ data: { id: '5', label: '5', parent: '5_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 200, y: 100 }},
	{ data: { id: '5_label', label: '14\nNode 5'}, classes: ['label']},

	{ data: { source: '1', target: '2', highlighted: false, color:'black', label: '15\nEdge 1'}},
	{ data: { source: '2', target: '3', highlighted: false, color:'black', label: '16\nEdge 2'}},
	{ data: { source: '2', target: '4', highlighted: false, color:'black', label: '17\nEdge 3'}},
	{ data: { source: '4', target: '5', highlighted: false, color:'black', label: '18\nEdge 4'}},
	{ data: { source: '5', target: '1', highlighted: false, color:'black', label: '19\nEdge 5'}},
]

const coloredGraph = [
	{ data: { id: '1', label: '1', parent: '1_label', marked: false, highlighted: false, color: 'red'},
		position: { x: 0, y: 0 }},
	{ data: { id: '1_label', label: '\nNode 1'}, classes: ['label']},

	{ data: { id: '2', label: '2', parent: '2_label', marked: false, highlighted: false, color: 'blue'},
		position: { x: 100, y: 0 }},
	{ data: { id: '2_label', label: '\nNode 2'}, classes: ['label']},
	
	{ data: { id: '3', label: '3', parent: '3_label', marked: false, highlighted: false, color: 'red'},
		position: { x: 100, y: 100 }},
	{ data: { id: '3_label', label: '\nNode 3'}, classes: ['label']},
	
	{ data: { id: '4', label: '4', parent: '4_label', marked: false, highlighted: false, color: 'red'},
		position: { x: 200, y: 0 }},
	{ data: { id: '4_label', label: '\nNode 4'}, classes: ['label']},
	
	{ data: { id: '5', label: '5', parent: '5_label', marked: false, highlighted: false, color: 'blue'},
		position: { x: 200, y: 100 }},
	{ data: { id: '5_label', label: '\nNode 5'}, classes: ['label']},

	{ data: { source: '1', target: '2', highlighted: false, color:'red', label: '\nEdge 1'}},
	{ data: { source: '2', target: '3', highlighted: false, color:'blue', label: '\nEdge 2'}},
	{ data: { source: '2', target: '4', highlighted: false, color:'blue', label: '\nEdge 3'}},
	{ data: { source: '4', target: '5', highlighted: false, color:'red', label: '\nEdge 4'}},
	{ data: { source: '5', target: '1', highlighted: false, color:'blue', label: '\nEdge 5'}},
]

const directedGraph = [
	{ data: { id: '1', label: '1', parent: '1_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 0, y: 0 }},
	{ data: { id: '1_label', label: '\nNode 1'}, classes: ['label']},

	{ data: { id: '2', label: '2', parent: '2_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 100, y: 0 }},
	{ data: { id: '2_label', label: '\nNode 2'}, classes: ['label']},
	
	{ data: { id: '3', label: '3', parent: '3_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 100, y: 100 }},
	{ data: { id: '3_label', label: '\nNode 3'}, classes: ['label']},
	
	{ data: { id: '4', label: '4', parent: '4_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 200, y: 0 }},
	{ data: { id: '4_label', label: '\nNode 4'}, classes: ['label']},
	
	{ data: { id: '5', label: '5', parent: '5_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 200, y: 100 }},
	{ data: { id: '5_label', label: '\nNode 5'}, classes: ['label']},

	{ data: { source: '1', target: '2', highlighted: false, color:'black', label: '\nEdge 1'}, classes: ['directed']},
	{ data: { source: '2', target: '3', highlighted: false, color:'black', label: '\nEdge 2'}, classes: ['directed']},
	{ data: { source: '2', target: '4', highlighted: false, color:'black', label: '\nEdge 3'}, classes: ['directed']},
	{ data: { source: '4', target: '5', highlighted: false, color:'black', label: '\nEdge 4'}, classes: ['directed']},
	{ data: { source: '5', target: '1', highlighted: false, color:'black', label: '\nEdge 5'}, classes: ['directed']},
]

const markedGraph = [
	{ data: { id: '1', label: '1', parent: '1_label', marked: true, highlighted: false, color: 'black'},
		position: { x: 0, y: 0 }},
	{ data: { id: '1_label', label: '\nNode 1'}, classes: ['label']},

	{ data: { id: '2', label: '2', parent: '2_label', marked: true, highlighted: false, color: 'black'},
		position: { x: 100, y: 0 }},
	{ data: { id: '2_label', label: '\nNode 2'}, classes: ['label']},
	
	{ data: { id: '3', label: '3', parent: '3_label', marked: false, highlighted: true, color: 'black'},
		position: { x: 100, y: 100 }},
	{ data: { id: '3_label', label: '\nNode 3'}, classes: ['label']},
	
	{ data: { id: '4', label: '4', parent: '4_label', marked: true, highlighted: true, color: 'black'},
		position: { x: 200, y: 0 }},
	{ data: { id: '4_label', label: '\nNode 4'}, classes: ['label']},
	
	{ data: { id: '5', label: '5', parent: '5_label', marked: false, highlighted: false, color: 'black'},
		position: { x: 200, y: 100 }},
	{ data: { id: '5_label', label: '\nNode 5'}, classes: ['label']},

	{ data: { source: '1', target: '2', highlighted: true, color:'black', label: '\nEdge 1'}},
	{ data: { source: '2', target: '3', highlighted: false, color:'black', label: '\nEdge 2'}},
	{ data: { source: '2', target: '4', highlighted: false, color:'black', label: '\nEdge 3'}},
	{ data: { source: '4', target: '5', highlighted: true, color:'black', label: '\nEdge 4'}},
	{ data: { source: '5', target: '1', highlighted: false, color:'black', label: '\nEdge 5'}},
]

export default GraphViewerDemo;