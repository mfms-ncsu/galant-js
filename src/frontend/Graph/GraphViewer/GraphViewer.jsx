import './GraphViewer.scss';

import { useState, useContext, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import CytoscapeComponent from 'react-cytoscapejs';
import GraphContext from 'frontend/GraphContext';

import predicateConverter from 'backend/PredicateConverter';

// Enable the cose-bilkent layout which automatically lays out the graph in a reasonable configuration.
import cytoscape from 'cytoscape';


import nodeHtmlLabel from 'cytoscape-node-html-label';
import coseBilkent from 'cytoscape-cose-bilkent';
import Graph from "backend/Graph/Graph.js";
cytoscape.use(coseBilkent);
nodeHtmlLabel(cytoscape);

/**
 * A React component that displays a graph.
 * 
 * This component recieves a graph in the form of Predicates and displays it using Cytoscape.
 * It handles the ability to move the camera, move nodes, and automatically lay out the graph.
 * 
 * @param {Object} props - The React properties of the component include:
 * @property {Predicates} predicates - The representation of the graph to display.
 * 
 * @returns {HTML} - The HTML representation of the component.
 * 
 * @author Art Schell
 */
function GraphViewer(props) {
	/** @var {string} - The currently enabled layout. Begins as 'preset' which keeps the nodes in the specified positions. */
	let [layout, setLayout] = useState("preset");
	/** @var {cytoscape.ElementDefinition[]} - The currently displayed elements, converted from the Predicates into Cytoscape form. */

	let [elements, setElements] = useState(predicateConverter({}));
	/** @var {cytoscape.Core} - The saved Cytoscape object. This is used to make direct calls to Cytoscape such as cytoscape.fit(). */
	let [cytoscape, setCytoscape] = useState(null);
    let ref = useRef();
    ref.current = cytoscape;
	
    /* eslint-disable-next-line no-unused-vars */
    const [graph, startGraph, loadGraph, updateGraph, registerOnLoad] = useContext(GraphContext);
	useEffect(() => {
        registerOnLoad((graph) => {
			setElements([]);
			ref.current.reset();
			ref.current.zoom(ref.current.zoom() * 0.9);
			ref.current.panBy({x: 0, y: 30});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


	useEffect(() => {
		// Save the current positions of nodes so they can be preserved after an update.
		let positions = {};
		for (let element of elements) {
			if (element.position && element.data && element.data.id) {
				positions[element.data.id] = element.position;
			}
		}
		let newElements = predicateConverter(graph);
		// Ensure the positions of nodes are preserved in the new list of elements.
		for (let element of newElements) {
			if (positions[element.data.id]) {
				element.position = positions[element.data.id]
			}
		}
		setElements(newElements);
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graph])
	
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
					cytoscape.zoom(cytoscape.zoom() * 0.93);
					cytoscape.center();
					cytoscape.panBy({x: 0, y: 13});
				}
			}}>{"Auto-Camera"}</button>
		</div>	<div className='EdgeToggler'>
			<button onClick={() => {
				let newGraph = new Graph(startGraph.nodes, startGraph.edges, !startGraph.directed, startGraph.message);
				loadGraph(newGraph)
			}}>{graph.directed ? "Make Undirected" : "Make Directed"} </button>
		</div>
		<p className="GraphViewerMessage">{graph.message}</p>
		<CytoscapeComponent elements={elements}
			layout={{
				name: layout,
				idealEdgeLength: 100,
			}}
			stylesheet={stylesheet}
			autounselectify={true}
			cy={(cy) => {
				cy.nodeHtmlLabel([
					{
						query: 'node',
						valign: "top",
						valignBox: "top",
						tpl: (data) => {
							if (!data.invisible && !data.invisibleWeight && data.weight) {
								return renderToString(
									<div>
										<p className="GraphViewerLabel">{data.weight}<br></br>{!data.invisibleLabel ? data.label : ""}</p>
									</div>
								);
							} else if (!data.invisible && !data.invisibleLabel && data.label) {
								return renderToString(
									<div>
										<p className="GraphViewerLabel">{data.label}</p>
									</div>
								);
							}
						}
					},
				]);
				setCytoscape(cy);
			}}
		/>
	</div>;
}

/** @const {cytoscape.Stylesheet[]} - The stylesheet for Cytoscape, defining the default visual appearance of elements. */
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
			label: 'data(id)',
			textValign: 'center',
			visibility: 'visible',
		}
	},
	// Marked nodes
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
	// Highlighted nodes
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
	// Invisible nodes
	{
		selector: 'node[?invisible]',
		style: {
			visibility: 'hidden',
		}
	},
	// Invisible edges
	{
		selector: 'edge[?invisible]',
		style: {
			visibility: 'hidden',
		}
	},
	// Highlighted edges
	{
		selector: 'edge[!highlighted]',
		style: {
			width: '5px',
		}
	},
	{
		selector: 'edge[?highlighted]',
		style: {
			width: '10px',
		}
	},
	// Colored nodes
	{
		selector: 'node[color]',
		style: {
			borderColor: 'data(color)',
		}
	},
	// Colored edges
	{
		selector: 'edge[color]',
		style: {
			lineColor: 'data(color)',
			targetArrowColor: 'data(color)',
		}
	},
	// Labeled edges
	{
		selector: 'edge[label]',
		style: {
			label: 'data(label)',

			textWrap: 'wrap',

			textBackgroundColor: 'white',
			textBackgroundOpacity: '1.0',
			textBackgroundPadding: '2px',

			textBorderOpacity: '1.0',
			textBorderStyle: 'solid',
			textBorderWidth: '1.5px',
			textBorderColor: 'black',
		}
	},
	// Invisible edge label
	{
		selector: 'edge[?invisibleLabel]',
		style: {
			label: '',
		}
	},
	// Directed edges
	{
		selector: 'edge.directed',
		style: {
			curveStyle: 'bezier',

			targetArrowShape: 'triangle',
		}
	},
];

export default GraphViewer;