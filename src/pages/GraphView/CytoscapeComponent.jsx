import { React, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { useGraphContext } from 'pages/GraphView/utils/GraphContext';
import predicateConverter from 'pages/GraphView/utils/PredicateConverter';
// Enable the cose-bilkent layout which automatically lays out the graph in a reasonable configuration.
import cytoscape from 'cytoscape';
import nodeHtmlLabel from 'cytoscape-node-html-label';
import coseBilkent from 'cytoscape-cose-bilkent';
import { createCytoscapeStyleSheet } from './utils/CytoscapeStylesheet';
import { createCytoscapeLayout } from './utils/CytoscapeLayout';
import NodeObject from './utils/NodeObject';
import ChangeObject from './utils/ChangeObject';
import ChangeRecord from './utils/ChangeRecord';
import Graph from 'utils/Graph';
cytoscape.use(coseBilkent); // This registers coseBilkent as a extension
nodeHtmlLabel(cytoscape);

/**
 * A React component that displays a cytoscape instance.
 * Reads graph data from GraphContext, which is defined in GraphView/index.js
 * @author Julian Madrigal
 * @author Andrew Lanning
 */
export default function CytoscapeComponent({ graphEditHistory }) {
	const graphContext = useGraphContext();
	const graph = graphContext.graph;
	const cytoscapeInstance = graphContext.cytoscape.instance;
	const cytoscapeElement = useRef();


	// Initialize cytoscape on mount (When cytoscapeElement ref is set to the div element)
	useEffect(() => {
		if (cytoscapeInstance) return;
		const cy = cytoscape({
			container: cytoscapeElement.current,
			elements: graph.elements,
			style: createCytoscapeStyleSheet(graphContext.preferences.style),
			layout: createCytoscapeLayout(graphContext.preferences.layout),
			autounselectify: true,
			wheelSensitivity: 0.35,
		})


		cy.nodeHtmlLabel([
			{
				query: 'node',
				valign: "top",
				valignBox: "top",
				tpl: (data) => {
					const hideWeight = graphContext.preferences.style.node.hideWeight;
					const hideLabel = graphContext.preferences.style.node.hideLabel;

					if ((!hideWeight && data.weight) || (!hideLabel && data.label)) {
						return renderToString(
							<div className={`flex flex-col items-center justify-center border bg-white border-black  ${data.invisible && 'hidden'}`}>
								<p className="leading-none">{!data.invisibleWeight && !hideWeight ? data.weight : ""}</p>
								<p className="leading-none">{!data.invisibleLabel && !hideLabel ? data.label : ""}</p>
							</div>
						);
					}
				}
			},
		]);

		//cy.fit();
		graphContext.cytoscape.setInstance(cy);
		// Allows cypress to access cytoscape via window.cytoscape and read the graph state
		window.cytoscape = cy;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cytoscapeElement])


	// Update elements when graph changes
	useEffect(() => {
		if (!cytoscapeInstance) return;
		cytoscapeInstance.elements().remove();
		cytoscapeInstance.add(predicateConverter(graph, null, null, !graphContext.preferences.style.edge.hideWeight, !graphContext.preferences.style.edge.hideLabel));
		setTimeout(() => cytoscapeInstance.style().update(), 100);
	}, [cytoscapeInstance, graph, graphContext.preferences.style]);


	// Update stylesheet when style preferences changes
	useEffect(() => {
		if (!cytoscapeInstance) return;
		cytoscapeInstance.style().resetToDefault();
		cytoscapeInstance.style(createCytoscapeStyleSheet(graphContext.preferences.style)).update();
	}, [cytoscapeInstance, graphContext.preferences.style])


	// Updates the graph's layout whenever layout preferences changes
	useEffect(() => {
		if (!cytoscapeInstance) return;
		cytoscapeInstance.layout({ name: graphContext.preferences.layout.name, idealEdgeLength: 100 }).run();
		const updatedPositions = {};
		cytoscapeInstance.nodes().forEach(node => {
			updatedPositions[node.id()] = node.position();
		});

		// Change records use a list of changes for each record so we create that list
		let changes = [];

		// Iterates through the graph and gets the changes from the previous graph to the new one
		// and updates the change list with a new ChangeObject
		graph.nodes.forEach((node) => {
			let previous = structuredClone(node)
			const newX = updatedPositions[node.id].x;
			const newY = updatedPositions[node.id].y;
			if(typeof(nodes) !== NodeObject) {
                node = new NodeObject(node);
            }
			node.setPosition({ x: newX, y: newY })
			changes.push(new ChangeObject("update", "node", node.id, previous, node));

		});

		// Updates the change records if the preferences layout name is cosebilkent
		// This is used for identifying auto layout functionality, can also be
		// improved in the future if other preference updates need to be added to the auto-layout
		// changes
		if (graphContext.preferences.layout.name === "cose-bilkent") {
		  ChangeRecord.getInstance().addChangeObject(changes);
		}		
	}, [cytoscapeInstance, graphContext.preferences.layout]);

	return (
		<div className="w-full h-full">
			<p className="absolute bottom-0 m-2 z-10 font-semibold">{graph.message}</p>
			<div id='cytoscape-instance' ref={cytoscapeElement} className='w-full h-full bg-white ring-2 ring-slate-300 rounded-md' />
		</div>
	);
}
