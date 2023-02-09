import './GraphViewerDemo.css';

import GraphViewer from './GraphViewer';

import React from 'react'

function GraphViewerDemo(props) {

	let [graph, setGraph] = React.useState(plainGraph)
  
	return <div className="GraphViewerDemo">
        <h1>Galant</h1>
		<br/>
		<button onClick={() => setGraph(plainGraph)}>{"Load Plain Graph"}</button>
		<button onClick={() => setGraph(coloredGraph)}>{"Load Colored Graph"}</button>
		<button onClick={() => setGraph(directedGraph)}>{"Load Directed Graph"}</button>
        <GraphViewer predicates={graph}></GraphViewer>
    </div>;
}

const plainGraph = [
	{ data: { id: 'one', label: 'one', parent: 'one_label', marked:false, highlighted:true}, position: { x: 0, y: 0 }},
	{ data: { id: 'one_label', label: 'Node 1'}, classes: ['label']},

	{ data: { id: 'two', label: 'two', parent: 'two_label', marked:true, highlighted:false}, position: { x: 100, y: 0 }},
	{ data: { id: 'two_label', label: 'Node 2'}, classes: ['label']},
	
	{ data: { id: 'three', label: 'three', parent: 'three_label', marked:true, highlighted:true}, position: { x: 100, y: 100 }},
	{ data: { id: 'three_label', label: 'Node 3'}, classes: ['label']},
	
	{ data: { id: 'four', label: 'four', parent: 'four_label', marked:false, highlighted:false}, position: { x: 200, y: 0 }},
	{ data: { id: 'four_label', label: 'Node 4'}, classes: ['label']},
	
	{ data: { id: 'five', label: 'five', parent: 'five_label', marked:false, highlighted:false}, position: { x: 200, y: 100 }},
	{ data: { id: 'five_label', label: 'Node 5'}, classes: ['label']},

	{ data: { source: 'one', target: 'two'}},
	{ data: { source: 'two', target: 'three'}},
	{ data: { source: 'two', target: 'four'}},
	{ data: { source: 'four', target: 'five'}},
	{ data: { source: 'five', target: 'one'}},
]

const coloredGraph = [
	{ data: { id: 'one', label: 'one', parent: 'one_label', color: 'green', marked:true, highlighted:false}, position: { x: 0, y: 0 }},
	{ data: { id: 'one_label', label: 'Node 10'}, classes: ['label']},

	{ data: { id: 'two', label: 'two', parent: 'two_label', color: 'yellow', marked:false, highlighted:true}, position: { x: 100, y: 0 }},
	{ data: { id: 'two_label', label: 'Node 20'}, classes: ['label']},
	
	{ data: { id: 'three', label: 'three', parent: 'three_label', color: 'red', marked:false, highlighted:false}, position: { x: 100, y: 100 }},
	{ data: { id: 'three_label', label: 'Node 30'}, classes: ['label']},
	
	{ data: { id: 'four', label: 'four', parent: 'four_label', color: 'yellow', marked:false, highlighted:false}, position: { x: 200, y: 0 }},
	{ data: { id: 'four_label', label: 'Node 40'}, classes: ['label']},
	
	{ data: { id: 'five', label: 'five', parent: 'five_label', color: 'red', marked:false, highlighted:false}, position: { x: 200, y: 100 }},
	{ data: { id: 'five_label', label: 'Node 50'}, classes: ['label']},

	{ data: { source: 'one', target: 'two'}},
	{ data: { source: 'two', target: 'three'}},
	{ data: { source: 'two', target: 'four'}},
	{ data: { source: 'four', target: 'five'}},
	{ data: { source: 'five', target: 'one'}},
]

const directedGraph = [
	{ data: { id: 'one', label: 'one', parent: 'one_label', color: 'white', marked:false, highlighted:false}, position: { x: 0, y: 0 }},
	{ data: { id: 'one_label', label: 'Node 100'}, classes: ['label']},

	{ data: { id: 'two', label: 'two', parent: 'two_label', color: 'white', marked:false, highlighted:true}, position: { x: 100, y: 0 }},
	{ data: { id: 'two_label', label: 'Node 200'}, classes: ['label']},
	
	{ data: { id: 'three', label: 'three', parent: 'three_label', color: 'white', marked:false, highlighted:false}, position: { x: 100, y: 100 }},
	{ data: { id: 'three_label', label: 'Node 300'}, classes: ['label']},
	
	{ data: { id: 'four', label: 'four', parent: 'four_label', color: 'white', marked:false, highlighted:false}, position: { x: 200, y: 0 }},
	{ data: { id: 'four_label', label: 'Node 400'}, classes: ['label']},
	
	{ data: { id: 'five', label: 'five', parent: 'five_label', color: 'white', marked:false, highlighted:true}, position: { x: 200, y: 100 }},
	{ data: { id: 'five_label', label: 'Node 500'}, classes: ['label']},

	{ data: { source: 'one', target: 'two'}, classes: ['directed']},
	{ data: { source: 'two', target: 'three'}, classes: ['directed']},
	{ data: { source: 'two', target: 'four'}, classes: ['directed']},
	{ data: { source: 'four', target: 'five'}, classes: ['directed']},
	{ data: { source: 'five', target: 'one'}, classes: ['directed']},
]

export default GraphViewerDemo;