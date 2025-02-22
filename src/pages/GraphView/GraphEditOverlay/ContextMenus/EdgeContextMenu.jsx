import { useEffect, useState } from "react";
import ExitButton from "components/Buttons/ExitButton";
import Graph from "graph/Graph";
import { useAlgorithmContext } from 'pages/GraphView/utils/AlgorithmContext';

/**
 * EdgeContextMenu defines the React Component that should be displayed when a user right clicks an edge in cytoscape.
 * The displayed/editable attributes include: weight, label, and ability to delete node.
 * EdgeContextMenu also defines the event listeners for when the user right clicks on an edge. 
 * 
 * @author Julian Madrigal
 * @param {Object} props
 * @returns {React.ReactElement}
 */
export default function EdgeContextMenu() {
    const { algorithm, setAlgorithm } = useAlgorithmContext();
    const [visible, setVisible] = useState(false);
    const [edge, setEdge] = useState(null);
    const [renderedPosition, setRenderedPosition] = useState({x: 0, y: 0});
    const [values, setValues] = useState({});


    useEffect(() => {
        if (!window.cytoscape) return;
        function onContextClick(event) {
            // Initially hide the menu and prevent default functionality
            setVisible(false);
            event.preventDefault();

            // Get the edge from cytoscape
            const edge = event.target;

            // Set the values to display
            const edgeObject = Graph.getEdge(edge.data().source, edge.data().target);
            setValues({
                label: edgeObject.getAttribute("label") || "",
                weight: edgeObject.getAttribute("weight") ? edgeObject.getAttribute("weight").toString() : "",
            });

            // Set the edge state and show the menu
            setEdge(event.target);
            setVisible(true);

            // Set the rendering position
            event.renderedPosition = event.renderedPosition || {x: 0, y: 0}; // During cypress, renderedPosition is null
            setRenderedPosition({x: event.renderedPosition.x + 15, y: event.renderedPosition.y + 15});

            // Use click to hide the menu
            document.addEventListener('click', () => setVisible(false), { once: true });
        }
        window.cytoscape.on('cxttap', 'edge', onContextClick);
        return (() => window.cytoscape.removeListener('cxttap', onContextClick));
    }, [window.cytoscape])

    const data = edge && edge.data();

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
        const weight = values.weight.trim();

        // Set the changes
        Graph.userChangeManager.setEdgeAttribute(data.source, data.target, "label", label);
        Graph.userChangeManager.setEdgeAttribute(data.source, data.target, "weight", weight);
    }

    // Deletes the edge and closes the context menu
    function deleteEdge() {
        setVisible(false);
        Graph.userChangeManager.deleteEdge(data.source, data.target);
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


    )
}