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

// Divisor to change the border width on a node based on radius size
const BORDER_WIDTH_DIVISOR = 10;
// Divisor to change font size within edge and node labels based on node size
const FONT_SIZE_DIVISOR = 2;
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

    let ref = useRef();
    ref.current = props.cytoscape;


    /* eslint-disable-next-line no-unused-vars */
    const {graph, startGraph, loadGraph, registerOnLoad} = useContext(GraphContext);
	console.log(props.nodeSize)
	//connect to the other windows.
/** @const {cytoscape.Stylesheet[]} - The stylesheet for Cytoscape, defining the default visual appearance of elements. */
	const stylesheet = [
		{
			selector: 'node',
			style: {
				width: props.nodeSize + 'px',
				height: props.nodeSize + 'px',
				backgroundColor: 'white',
				borderWidth: (props.nodeSize / BORDER_WIDTH_DIVISOR + 1) + 'px',
				borderStyle: 'solid',
				borderColor: 'blue',
				label: 'data(id)',
				textValign: 'center',
				visibility: 'visible',
				fontSize: props.nodeSize / FONT_SIZE_DIVISOR + 'px'
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
				fontSize: props.nodeSize / FONT_SIZE_DIVISOR + 'px',
				textBorderOpacity: '1.0',
				textBorderStyle: 'solid',
				textBorderWidth: '1px',
				textBorderColor: 'black',
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
	//postWorker("Graph Alive");

	useEffect(() => {
        registerOnLoad((graph) => {
			props.setElements([]);
			console.log(ref.current);
			ref.current.reset();
			ref.current.zoom(ref.current.zoom() * 0.9);
			ref.current.panBy({x: 0, y: 30});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


	useEffect(() => {
		// Save the current positions of nodes so they can be preserved after an update.
		let positions = {};
		for (let element of props.elements) {
			if (element.position && element.data && element.data.id) {
				positions[element.data.id] = element.position;
			}
		}
		let newElements = predicateConverter(graph, props.nodeWeights, props.nodeLabels, props.edgeWeights, props.edgeLabels);
		// Ensure the positions of nodes are preserved in the new list of elements.
		for (let element of newElements) {
			if (positions[element.data.id]) {
				element.position = positions[element.data.id]
			}
		}
		props.setElements(newElements);
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graph, props.nodeWeights, props.nodeLabels, props.edgeWeights, props.edgeLabels])

	/* useEffect(() => {
		createWorker();
		console.log("created worker");
	}, []); */

	return <div className="GraphViewer">
		

		<p className="GraphViewerMessage">{graph.message}</p>
		<CytoscapeComponent elements={props.elements}
			layout={{
				name: props.layout,
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
				props.setCytoscape(cy);
			}}
		/>
	</div>;
}

export default GraphViewer;
