import { useFloating } from "@floating-ui/react-dom";
import { Menu, Popover } from "@headlessui/react";
import produce from "immer";
import ChangeObject from "pages/GraphView/utils/ChangeObject";
import { useGraphContext } from "pages/GraphView/utils/GraphContext";
import GraphEditHistory from "pages/GraphView/utils/GraphEditHistory";
import { useRef, useEffect, useState } from "react";
import Graph from "utils/Graph";
import ChangeRecord from "pages/GraphView/utils/ChangeRecord";



/**
 * NodeContextMenu defines the React Component for the menu that should be opened to display and allow edits to a node's attributes.
 * Displayed attributes include id, label, and weight.
 * NodeContextMenu also defines the listeners for when the user right clicks on a node in cytoscape.
 * Changed attributes get saved to the graph object. 
 * 
 * @author Julian Madrigal
 * @param {Object} props
 * @param {GraphEditHistory} props.graphEditHistory 
 * @returns {React.ReactElement} React component
 */
export default function NodeContextMenu({ graphEditHistory }) {
	const graphContext = useGraphContext();
	const changeRecord = ChangeRecord.getInstance();
	const cytoscapeInstance = graphContext.cytoscape.instance;
	const [visible, setVisible] = useState(false);
	const [node, setNode] = useState(null);
	const [renderedPosition, setRenderedPosition] = useState({ x: 0, y: 0 });
	const [values, setValues] = useState({});


	useEffect(() => {
		if (!cytoscapeInstance) return;

		function onContextClick(event) {
			setVisible(false);
			event.preventDefault();

			const node = event.target;
			setValues({
				id: node.id(),
				label: node.data().label || "",
				weight: node.data().weight || "",
			})
			setNode(event.target);
			setVisible(true);
			event.renderedPosition = event.renderedPosition || { x: 0, y: 0 }; // During cypress, renderedPosition is null
			setRenderedPosition({ x: event.renderedPosition.x + 50, y: event.renderedPosition.y + 60 });


			document.addEventListener('click', () => setVisible(false), { once: true });
		}

		cytoscapeInstance.on('cxttap', 'node', onContextClick);

		return (() => cytoscapeInstance.removeListener('cxttap', onContextClick));
	}, [cytoscapeInstance])

	const data = node && node.data();
	const nodeId = node && node.id();

	function onChangeValue(value, newValue) {
		const newValues = { ...values };
		newValues[value] = newValue;
		setValues(newValues);
	}

	function update() {
		const label = values.label.trim();
		const weight = values.weight.trim();

		const graph = graphEditHistory.getCurrentSnapshot();

		const newGraph = produce(graph, draft => {
			const node = draft.getGraphObject(nodeId);
			node.label = label.length > 0 ? label : null;
			node.weight = weight.length > 0 ? weight : null;
		})

		graphEditHistory.add(newGraph);
	}

	function deleteNode() {
		const graph = graphContext.graph;
		let change = new ChangeObject("remove", "node", nodeId, { node: graph.getNodeObject(nodeId), edges: graph.incident(nodeId) }, null);
		changeRecord.addChangeObject([change]);
		setVisible(false);
	}

	function onEnterPressed(event) {
		if (event.key !== 'Enter') return;
		event.target.blur();
	}

	return (visible &&
		<div id="node-context-menu" className="p-2 ring-1 rounded bg-white shadow-lg ring-gray-300" style={{ position: 'fixed', top: renderedPosition.y + 'px', left: renderedPosition.x + 'px' }} onClick={(event) => event.stopPropagation()}>
			<div>
				<label className="block text-gray-500">ID</label>
				<input id="node-id" className="bg-gray-200 p-1 rounded disabled:text-gray-500" disabled value={values.id} onChange={(event) => onChangeValue('id', event.target.value)} placeholder="Enter ID" />
			</div>

			<div>
				<label className="block text-gray-500">Weight</label>
				<input id="node-weight" className="p-1 rounded bg-gray-200" value={values.weight} onChange={(event) => onChangeValue('weight', event.target.value)} onBlur={update} onKeyDown={onEnterPressed} placeholder="Enter weight" />
			</div>

			<div>
				<label className="block text-gray-500">Label</label>
				<input id="node-label" className="p-1 rounded bg-gray-200" value={values.label} onChange={(event) => onChangeValue('label', event.target.value)} onBlur={update} onKeyDown={onEnterPressed} placeholder="Enter label" />
			</div>

			<button id="node-delete" className="block w-full p-1 mt-2 rounded bg-red-500 text-white hover:bg-red-700" onClick={deleteNode}>Delete Node</button>
		</div>


	)
}