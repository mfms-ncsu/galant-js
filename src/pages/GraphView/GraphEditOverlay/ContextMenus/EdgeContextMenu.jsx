import { useGraphContext } from "pages/GraphView/utils/GraphContext";
import GraphEditHistory from "pages/GraphView/utils/GraphEditHistory";
import { useEffect, useState } from "react";
import Graph from "utils/Graph";
import produce from "immer";



/**
 * EdgeContextMenu defines the React Component that should be displayed when a user right clicks an edge in cytoscape.
 * The displayed/editable attributes include: weight, label, and ability to delete node.
 * EdgeContextMenu also defines the event listeners for when the user right clicks on an edge. 
 * 
 * @author Julian Madrigal
 * @param {Object} props
 * @param {GraphEditHistory} props.graphEditHistory
 * @returns {React.ReactElement}
 */
export default function EdgeContextMenu({graphEditHistory}) {
	const graphContext = useGraphContext();
	const cytoscapeInstance = graphContext.cytoscape.instance;
	const [visible, setVisible] = useState(false);
	const [edge, setEdge] = useState(null);
	const [renderedPosition, setRenderedPosition] = useState({x: 0, y: 0});
	const [values, setValues] = useState({});


	useEffect(() => {
        if (!cytoscapeInstance) return;

		function onContextClick(event) {
			setVisible(false);
			event.preventDefault();


            const edge = event.target;
            const graph = graphContext.graph;
            const graphOb = new Graph(graph.nodes, graph.edges, graph.directed, '');
            const edgeObject = graphOb.getGraphObject(`${edge.data().source} ${edge.data().target}`);

			setValues({
				id: edgeObject.id,
				label: edgeObject.label || "",
				weight: edgeObject.weight ? edgeObject.weight.toString() : "",
			})
			setEdge(event.target);
			event.renderedPosition = event.renderedPosition || {x: 0, y: 0}; // During cypress, renderedPosition is null
			setRenderedPosition({x: event.renderedPosition.x + 50, y: event.renderedPosition.y + 60});
			setVisible(true);

			document.addEventListener('click', () => setVisible(false), { once: true });
		}

        cytoscapeInstance.on('cxttap', 'edge', onContextClick);

		return (() => cytoscapeInstance.removeListener('cxttap', onContextClick));
    }, [cytoscapeInstance, graphContext.graph])

	const data = edge && edge.data();

	// Updates the values state whenever an input is changed
	function onChangeValue(value, newValue) {
		const newValues = {...values};
		newValues[value] = newValue;
		setValues(newValues);
	}

	// This function runs whenever update is called, and updates the values in the graph.
	function update() {
		const label = values.label.trim();
        const weight = values.weight.trim();
		const graph = graphEditHistory.getCurrentSnapshot();

		const newGraph = produce(graph, draft => {
			const edge = draft.getGraphObject(`${data.source} ${data.target}`);
			edge.label = label.length > 0 ? label : null;
			edge.weight = weight.length > 0 ? weight : null;
		})

		graphEditHistory.add(newGraph);
	}

	// Deletes the edge and closes the context menu
	function deleteEdge() {
		const graph = graphEditHistory.getCurrentSnapshot();

		const newGraph = produce(graph, draft => {
			delete draft.edges[`${data.source} ${data.target}`];
		})

		graphEditHistory.add(newGraph);
		setVisible(false);
	}

	// Label/Weight is already updated on blur, so enter should just blur to apply changes.
	function onEnterPressed(event) {
		if (event.key !== 'Enter') return;
		event.target.blur();
	}

	return (visible && 
		// This div contains the position settings, and onClick, to stop propagation to document.
		<div id="edge-context-menu" className="p-2 ring-1 rounded bg-white shadow-lg ring-gray-300"  onClick={(event) => event.stopPropagation()} style={{position: 'fixed', top: renderedPosition.y + 'px', left: renderedPosition.x + 'px'}}>

			<div>
                <label className="block text-gray-500">Weight</label>
                <input id="edge-weight" className="p-1 rounded bg-gray-200" value={values.weight} onChange={(event) => onChangeValue('weight', event.target.value)} onBlur={update} onKeyDown={onEnterPressed} placeholder="Enter weight"/>
            </div>

			
            <div>
                <label className="block text-gray-500">Label</label>
                <input id="edge-label" className="p-1 rounded bg-gray-200" value={values.label} onChange={(event) => onChangeValue('label', event.target.value)} onBlur={update} onKeyDown={onEnterPressed} placeholder="Enter label"/>
            </div>
			
			<button id="edge-delete-button" className="block w-full p-1 mt-2 rounded bg-red-500 text-white font-semibold hover:bg-red-700" onClick={deleteEdge}>Delete Edge</button>
		</div>


	)
}