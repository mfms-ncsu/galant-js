import { useEffect, useState } from "react";
import Graph from "graph/Graph";
import { useAlgorithmContext } from 'pages/GraphView/utils/AlgorithmContext';
/**
 * NodeContextMenu defines the React Component for the menu that should be opened to display and allow edits to a node's attributes.
 * Displayed attributes include id, label, and weight.
 * NodeContextMenu also defines the listeners for when the user right clicks on a node in cytoscape.
 * Changed attributes get saved to the graph object. 
 * 
 * @author Julian Madrigal
 * @param {Object} props
 * @returns {React.ReactElement} React component
 */
export default function NodeContextMenu() {
    const { algorithm, setAlgorithm } = useAlgorithmContext();
    const [visible, setVisible] = useState(false);
    const [node, setNode] = useState(null);
    const [renderedPosition, setRenderedPosition] = useState({ x: 0, y: 0 });
    const [values, setValues] = useState({});


    useEffect(() => {
        if (!window.cytoscape) return;
        function onContextClick(event) {
            // Initially hide the menu and prevent default functionality
            setVisible(false);
            event.preventDefault();

            // Get the node from cytoscape
            const node = event.target;

            // Set the values to display
            setValues({
                id: node.id(),
                label: node.data().label || "",
                weight: node.data().weight || "",
            });

            // Get the node as a state variable and set the visibility to true
            setNode(event.target);
            setVisible(true);

            // Set rendering position
            event.renderedPosition = event.renderedPosition || { x: 0, y: 0 }; // During cypress, renderedPosition is null
            setRenderedPosition({ x: event.renderedPosition.x + 15, y: event.renderedPosition.y + 15 });

            // Use a click to hide the menu
            document.addEventListener('click', () => setVisible(false), { once: true });
        }
        window.cytoscape.on('cxttap', 'node', onContextClick);
        return (() => window.cytoscape.removeListener('cxttap', onContextClick));
    }, [window.cytoscape])

    const data = node && node.data();
    const nodeId = node && node.id();

    // Updates the values state whenever an input is changed
    function onChangeValue(value, newValue) {
        const newValues = { ...values };
        newValues[value] = newValue;
        setValues(newValues);
    }

    // This function runs whenever update is called, and updates the values in the graph.
    function update() {
        // Get the new label and weight
        const label = values.label.trim();
        const weight = values.weight.trim();

        // Set the changes
        Graph.userChangeManager.setNodeAttribute(nodeId, "label", label);
        Graph.userChangeManager.setNodeAttribute(nodeId, "weight", weight);
    }

    // Deletes the node and closes the context menu
    function deleteNode() {
        setVisible(false); // Hide the menu
        Graph.userChangeManager.deleteNode(nodeId); // Delete the node
    }

    function onEnterPressed(event) {
        if (event.key !== 'Enter') return;
        event.target.blur();
    }

    return !algorithm && (visible &&
        <div id="node-context-menu" className="p-4 rounded-xl bg-white shadow-lg" style={{ position: 'fixed', top: renderedPosition.y + 'px', left: renderedPosition.x + 'px' }} onClick={(event) => event.stopPropagation()}>
            <div>
                <label className="block text-gray-500">ID</label>
                <input id="node-id" className="bg-gray-200 p-1 rounded disabled:text-gray-500" disabled value={values.id} onChange={(event) => onChangeValue('id', event.target.value)} placeholder="Enter ID" />
            </div>

            <div className="mt-1">
                <label className="block text-gray-500">Weight</label>
                <input id="node-weight" className="p-1 rounded bg-gray-200" value={values.weight} onChange={(event) => onChangeValue('weight', event.target.value)} onBlur={update} onKeyDown={onEnterPressed} placeholder="Enter weight" />
            </div>

            <div className="mt-1">
                <label className="block text-gray-500">Label</label>
                <input id="node-label" className="p-1 rounded bg-gray-200" value={values.label} onChange={(event) => onChangeValue('label', event.target.value)} onBlur={update} onKeyDown={onEnterPressed} placeholder="Enter label" />
            </div>

            <button id="node-delete" className="block w-full p-2 mt-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all" onClick={deleteNode}>Delete Node</button>
        </div>


    )
}