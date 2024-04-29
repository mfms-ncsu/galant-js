import produce from "immer";
import { useGraphContext } from "pages/GraphView/utils/GraphContext";
import GraphEditHistory from "pages/GraphView/utils/GraphEditHistory";
import { useEffect, useState } from "react";


/**
 * ContextMenu defines the HTML component displayed for the main context menu. This allows the user to
 * create a new node, or create a new edge.
 * ContextMenu also creates events for context actions related to the graph. This includes:
 * Right click on cytoscape opening the main context menu.
 * Change of a node's position in cytoscape gets saved to the graph.
 * 
 * @author Julian Madrigal
 * @param {Object} props
 * @param {GraphEditHistory} props.graphEditHistory 
 * @returns {React.ReactElement}
 */
export default function ContextMenu({graphEditHistory}) {
	const graphContext = useGraphContext();
	const cytoscapeInstance = graphContext.cytoscape.instance;
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({x: 0, y: 0});
	const [renderedPosition, setRenderedPosition] = useState({x: 0, y: 0});
	const [values, setValues] = useState({});


	// Display the popup on right-click to graph
	useEffect(() => {
        if (!cytoscapeInstance) return;

        cytoscapeInstance.on('cxttap', (event) => {
			if (event.target !== cytoscapeInstance) return; // Don't show popup if right clicked on a node/edge.
			event.preventDefault();

			setPosition(event.position);
			setRenderedPosition({x: event.renderedPosition.x + 40, y: event.renderedPosition.y + 50});
			setValues({});
			setVisible(true);

			document.addEventListener('mousedown', () => setVisible(false), { once: true });
		});

    }, [cytoscapeInstance])

	// Update the edit history when a node is moved
	useEffect(() => {
        if (!cytoscapeInstance) return;

		function onNodeMoved(event) {
			const node = event.target;

			const graph = graphEditHistory.getCurrentSnapshot();
			const id = node.id();
			const newPosition = node.position();

			const newGraph = produce(graph, draft => {
				console.log(graph, draft);
				const nodeObject = draft.getNodeOrEdgeObject(id);
				nodeObject.x = newPosition.x;
				nodeObject.y = newPosition.y;
			})

			graphEditHistory.add(newGraph);
		}

		let timeOut = null;

		function onPositionMoved(event) {
			if (timeOut) clearTimeout(timeOut);
			timeOut = setTimeout(() => onNodeMoved(event), 0);
		}

        cytoscapeInstance.on('free', 'node', onPositionMoved);

		return () => cytoscapeInstance.removeListener('free',  onPositionMoved);
    }, [cytoscapeInstance, graphContext.graph, graphEditHistory])

	function addNode() {
		const graph = graphContext.graph;

		let id = 0;
		while (graph.nodes[id]) id++;

		const newGraph = produce(graph, draft => {
			draft.nodes[id] = {
				x: position.x,
				y: position.y,
			}
		})

		graphEditHistory.add(newGraph);

		setVisible(false);
	}

	function addEdge() {
		const source = values.source;
		const destination = values.destination;
		if (!source || source.length <= 0) return;
		if (!destination || destination.length <= 0) return;
		const cy = graphContext.cytoscape.instance;

		const graph = graphContext.graph;

		const id = `${source} ${destination}`;

		const newGraph = produce(graph, draft => {
			draft.edges[id] = {source, target: destination};
		})

		graphEditHistory.add(newGraph);
		setVisible(false);
	}


	function changeValue(value, newValue) {
		const newValues = {...values};
		newValues[value] = newValue;
		setValues(newValues);
	}


	return (visible && 
		<div id="edit-context-menu" className="p-2 ring-1 rounded bg-white ring-gray-300 shadow-lg" style={{position: 'fixed', top: renderedPosition.y + 'px', left: renderedPosition.x + 'px'}} onMouseDown={(event) => event.stopPropagation()}>
			<button className="block w-full p-1 rounded bg-blue-500 text-white font-semibold hover:bg-blue-700" onClick={addNode}>New Node</button>

			<div className="h-[1px] w-full my-2 bg-gray-200"/>
			
			<div className="mt-2">
				<input className="p-1 rounded bg-gray-200" size={12} placeholder="Source" value={values.source} onChange={(event) => changeValue('source', event.target.value)}/>
				<input className="p-1 ml-2 rounded bg-gray-200" size={12} placeholder="Destionation" onChange={(event) => changeValue('destination', event.target.value)}/>
				<button className="block w-full p-1 mt-1 rounded bg-blue-500 text-white font-semibold" onClick={addEdge}>New Edge</button>
			</div>
		</div>


	)
}