import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { algorithmAtom, graphAtom, userChangeManagerAtom } from "states/_atoms/atoms";
import GraphInterface from "interfaces/GraphInterface/GraphInterface";
import Cytoscape from "globals/Cytoscape";
import ExitButton from "components/Buttons/ExitButton";

/**
 * Opens when a user right-clicks on an edge. Allows a user to set 
 * weight or label, and ability to delete an edge.
 */
export default function EdgeContextMenu() {
    const [graph, setGraph] = useAtom(graphAtom);
    const [userChangeManager, setUserChangeManager] = useAtom(userChangeManagerAtom);
    const [algorithm] = useAtom(algorithmAtom);
    const [visible, setVisible] = useState(false);
    const [edge, setEdge] = useState(null);
    const [renderedPosition, setRenderedPosition] = useState({x: 0, y: 0});
    const [values, setValues] = useState({});

    // Listen for clicks to open the menu
    useEffect(() => {
        function onContextClick(event) {
            // Initially hide the menu and prevent default functionality
            setVisible(false);
            event.preventDefault();

            // Get the edge from cytoscape
            const edge = event.target.data();

            // Set the values to display
            setValues({
                label: edge.label,
                weight: edge.weight || "",
            });

            // Set the edge state and show the menu
            setEdge(edge);
            setVisible(true);

            // Set the rendering position
            event.renderedPosition = event.renderedPosition || {x: 0, y: 0}; // During cypress, renderedPosition is null
            setRenderedPosition({x: event.renderedPosition.x + 15, y: event.renderedPosition.y + 15});

            // Use click to hide the menu
            document.addEventListener('click', () => setVisible(false), { once: true });
        }
        Cytoscape.on('cxttap', 'edge', onContextClick);
        return (() => Cytoscape.removeListener('cxttap', onContextClick));
    }, []);

    // Updates the values state whenever an input is changed
    function onChangeValue(value, newValue) {
        const newValues = {...values};
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
        [newGraph, newChangeManager] = GraphInterface.setEdgeAttribute(graph, newChangeManager, edge.source, edge.target, "label", label);
        [newGraph, newChangeManager] = GraphInterface.setEdgeAttribute(newGraph, newChangeManager, edge.source, edge.target, "weight", weight);
        
        // Stop recording
        newChangeManager = GraphInterface.endRecording(newChangeManager);
        
        // Set the new Graph and ChangeManager
        setGraph(newGraph);
        setUserChangeManager(newChangeManager);
    }

    // Deletes the edge and closes the context menu
    function deleteEdge() {
        setVisible(false);
        let [newGraph, newChangeManager] = GraphInterface.deleteEdge(graph, userChangeManager, edge.source, edge.target);
        setGraph(newGraph);
        setUserChangeManager(newChangeManager);
    }

    // Label/Weight is already updated on blur, so enter should just blur to apply changes.
    function onEnterPressed(event) {
        if (event.key !== 'Enter') return;
        event.target.blur();
    }

    return !algorithm && (visible && 
        // This div contains the position settings, and onClick, to stop propagation to document.
        <div id="edge-context-menu" className="p-4 rounded-xl bg-white shadow-lg"  onClick={(event) => event.stopPropagation()} style={{position: 'fixed', top: renderedPosition.y + 'px', left: renderedPosition.x + 'px'}}>
            <div>
                <label className="block text-gray-500">Weight</label>
                <input id="edge-weight" className="p-1 rounded bg-gray-200" value={values.weight} onChange={(event) => onChangeValue('weight', event.target.value)} onBlur={update} onKeyDown={onEnterPressed} placeholder="Enter weight"/>
            </div>
            <div className="mt-1 mb-2">
                <label className="block text-gray-500">Label</label>
                <input id="edge-label" className="p-1 rounded bg-gray-200" value={values.label} onChange={(event) => onChangeValue('label', event.target.value)} onBlur={update} onKeyDown={onEnterPressed} placeholder="Enter label"/>
            </div>
            
            <ExitButton onClick={deleteEdge}>Delete Edge</ExitButton>
        </div>
    );
}
