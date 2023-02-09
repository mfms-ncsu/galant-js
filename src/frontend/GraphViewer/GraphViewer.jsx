import './GraphViewer.css';

import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

// TODO import the actual Predicate converter function.
import convertPredicates from '../../backend/PredicateConverter';

// Enable the cose-bilkent layout which automatically lays out the graph in a reasonable configuration.
import cytoscape from 'cytoscape'
import coseBilkent from 'cytoscape-cose-bilkent';
cytoscape.use( coseBilkent );

/**
 * A React component that displays a graph.
 * 
 * This component recieves a graph in the form of Predicates and displays it using Cytoscape.
 * It handles the ability to move the camera, move nodes, and automatically lay out the graph.
 * 
 * @param props: Object - The React properties of the component include:
 * @property predicates: Predicates - The representation of the graph to display.
 * 
 * @returns HTML - The HTML representation of the component.
 * 
 * @author Art Schell
 */
function GraphViewer(props) {
	/** string - The currently enabled layout. Begins as 'preset' which keeps the nodes in the specified positions. */
	let [layout, setLayout] = React.useState("preset");
	/** cytoscape.ElementDefinition[] - The currently displayed elements, converted from the Predicates into Cytoscape form. */
	let [elements, setElements] = React.useState(convertPredicates(props.predicates));
	/** cytoscape.Core - The saved Cytoscape object. This is used to make direct calls to Cytoscape such as cytoscape.fit(). */
	let [cytoscape, setCytoscape] = React.useState(null);

	// Save the current positions of nodes so they can be preserved after an update.
	let positions = {};
	for (let element of elements) {
		if (element.position && element.data && element.data.id) {
			positions[element.data.id] = element.position;
		}
	}

	// Convert the updated set of Predicates into Cytoscape form.
	elements = convertPredicates(props.predicates);

	// Ensure the positions of nodes are preserved in the new list of elements.
	for (let element of elements) {
		if (positions[element.data.id]) {
			element.position = positions[element.data.id]
		}
	}

	console.log(elements);

	return <div className="GraphViewer">
		{/* Button controls that allow the graph layout and camera to be updated. */}
		<div className="GraphViewerControls">
			<button onClick={() => { // Automatically lay out the graph with the cose-bilkent layout.
				// Note that layouts are only executed when they change, so we must first change
				// the layout to "preset" and then schedule it to be changed back.
				setLayout("preset");
				window.setTimeout(() => setLayout("cose-bilkent"), 0);
			}}>{"Auto-Layout"}</button>
			<button onClick={() => { // Automatically recenter the camera.
				if (cytoscape) {
					cytoscape.fit();
				}
			}}>{"Auto-Camera"}</button>
		</div>
		<CytoscapeComponent elements={elements}
			layout={{ name: layout }}
			stylesheet={stylesheet}
			autounselectify={true}
			cy={(cy) => { cytoscape = cy }}
		/>
	</div>;
}

/** cytoscape.Stylesheet[] - The stylesheet for Cytoscape, defining the default visual appearance of elements. */
const stylesheet = [
	{
		selector: 'node',
		style: {
			width: '50px',
			height: '50px',
			backgroundColor: 'white',
			borderWidth: '5px',
			borderStyle: 'solid',
			borderColor: 'black',
			label: 'data(label)',
			textValign: 'center',
		}
	},	
	{
		selector: 'node[!marked]',
		style: {
			backgroundColor: 'white',
		}
	},
	{
		selector: 'node[?marked]',
		style: {
			backgroundColor: 'orange',
		}
	},	
	{
		selector: 'node[!highlighted]',
		style: {
			borderWidth: '5px',
		}
	},
	{
		selector: 'node[?highlighted]',
		style: {
			borderWidth: '10px',
		}
	},
	{
		selector: 'edge[!highlighted]',
		style: {
			borderWidth: '5px',
		}
	},
	{
		selector: 'edge[?highlighted]',
		style: {
			borderWidth: '10px',
		}
	},
	{
		selector: 'node.label',
		style: {
			borderWidth: '0px',
			textValign: 'top',
		}
	},		
	{
		selector: 'edge',
		style: {
			width: '5px',
			lineColor: 'black',
			targetArrowShape: 'none',
			targetArrowColor: 'black',
			curveStyle: 'straight',
		}
	},
	{
		selector: 'edge.directed',
		style: {
			targetArrowShape: 'triangle',
		}
	},
];

export default GraphViewer;