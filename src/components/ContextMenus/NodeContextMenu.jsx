import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { algorithmAtom, graphAtom, userChangeManagerAtom } from "states/_atoms/atoms";
import Cytoscape from "globals/Cytoscape";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import ExitButton from "components/Buttons/ExitButton";

/**
 * Opens when a user right-clicks on a node. Allows a user to set 
 * weight or label, and ability to delete a node.
 */
export default function NodeContextMenu() {
    const [graph, setGraph] = useAtom(graphAtom);
    const [userChangeManager, setUserChangeManager] = useAtom(userChangeManagerAtom);
    const [algorithm] = useAtom(algorithmAtom);
    const [visible, setVisible] = useState(false);
    const [node, setNode] = useState(null);
    const [renderedPosition, setRenderedPosition] = useState({ x: 0, y: 0 });
    const [values, setValues] = useState({});

    // Listen for clicks to open the menu
    useEffect(() => {
        function onContextClick(event) {
            // Initially hide the menu and prevent default functionality
            setVisible(false);
            event.preventDefault();

            // Get the node from cytoscape
            const node = event.target;

            // Set the values to display
            setValues({
                id: event.target.id(),
                label: node.data().label,
                weight: node.data().weight || "",
            });

            // Get the node as a state variable and set the visibility to true
            setNode(node);
            setVisible(true);

            // Set rendering position
            event.renderedPosition = event.renderedPosition || { x: 0, y: 0 }; // During cypress, renderedPosition is null
            setRenderedPosition({ x: event.renderedPosition.x + 15, y: event.renderedPosition.y + 15 });

            // Use a click to hide the menu
            document.addEventListener('click', () => setVisible(false), { once: true });
        }
        Cytoscape.on('cxttap', 'node', onContextClick);
        return (() => Cytoscape.removeListener('cxttap', onContextClick));
    }, []);

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
        const weight = parseInt(String(values.weight).trim()) || undefined;

        // Start recording, so changing the label and weight happen
        // in one step
        let [newGraph, newChangeManager] = [];
        newChangeManager = GraphInterface.startRecording(userChangeManager);

        // Set the changes
        [newGraph, newChangeManager] = GraphInterface.setNodeAttribute(graph, newChangeManager, node.id(), "label", label);
        [newGraph, newChangeManager] = GraphInterface.setNodeAttribute(newGraph, newChangeManager, node.id(), "weight", weight);

        // Stop recording
        newChangeManager = GraphInterface.endRecording(newChangeManager);

        // Set the new graph and change manager
        setGraph(newGraph);
        setUserChangeManager(newChangeManager);
    }

    // Deletes the node and closes the context menu
    function deleteNode() {
        setVisible(false);
        let [newGraph, newChangeManager] = GraphInterface.deleteNode(graph, userChangeManager, node.id());
        setGraph(newGraph);
        setUserChangeManager(newChangeManager);
    }

    // Hide the context menu when enter is pressed
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

            <div className="mt-1 mb-2">
                <label className="block text-gray-500">Label</label>
                <input id="node-label" className="p-1 rounded bg-gray-200" value={values.label} onChange={(event) => onChangeValue('label', event.target.value)} onBlur={update} onKeyDown={onEnterPressed} placeholder="Enter label" />
            </div>

            <ExitButton onClick={deleteNode}>Delete Node</ExitButton>
        </div>


    )
}
