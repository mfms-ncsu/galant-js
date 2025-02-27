import { useEffect, useState } from "react";
import PrimaryButton from "components/Buttons/PrimaryButton";
import Graph from "utils/graph/Graph";
import { useAlgorithmContext } from 'utils/algorithm/AlgorithmContext';


/**
 * ContextMenu defines the HTML component displayed for the main context menu. This allows the user to
 * create a new node, or create a new edge.
 * ContextMenu also creates events for context actions related to the graph. This includes:
 * Right click on cytoscape opening the main context menu.
 * Change of a node's position in cytoscape gets saved to the graph.
 * 
 * @author Julian Madrigal
 * @param {Object} props
 * @returns {React.ReactElement}
 */
export default function ContextMenu() {
    const { algorithm, setAlgorithm } = useAlgorithmContext();
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [renderedPosition, setRenderedPosition] = useState({ x: 0, y: 0 });
    const [values, setValues] = useState({});


    // Display the popup on right-click to graph
    useEffect(() => {
        if (!window.cytoscape) return;
        window.cytoscape.on('cxttap', (event) => {
            // Don't show popup if right clicked on a node/edge.
            if (event.target !== window.cytoscape) return;
            event.preventDefault();

            // Position the menu
            setPosition(event.position);
            setRenderedPosition({ x: event.renderedPosition.x + 15, y: event.renderedPosition.y + 15 });
            setValues({});
            setVisible(true);

            // Click away to hide
            document.addEventListener('mousedown', () => setVisible(false), { once: true });
        });
    }, [window.cytoscape])

    // Update the edit history when a node is moved
    useEffect(() => {
        if (!window.cytoscape) return;
        function onNodeMoved(event) {
            // Get the node, its id, and position
            const node = event.target;
            const id = node.id();
            const newPosition = node.position();

            // Set the node position
            Graph.userChangeManager.setNodePosition(id, newPosition.x / Graph.getScalar(), newPosition.y / Graph.getScalar());
        }

        let timeOut = null;
        function onPositionMoved(event) {
            if (timeOut) clearTimeout(timeOut);
            timeOut = setTimeout(() => onNodeMoved(event), 0);
        }

        window.cytoscape.on('free', 'node', onPositionMoved);
        return () => window.cytoscape.removeListener('free', onPositionMoved);
    }, [window.cytoscape])

    // Add a new node to the graph
    function addNode() {
        Graph.userChangeManager.addNode(position.x / Graph.getScalar(), position.y / Graph.getScalar());
        setVisible(false);
    }

    // Add an edge to the graph
    function addEdge() {
        const source = values.source;
        const destination = values.destination;
        Graph.userChangeManager.addEdge(source, destination);
        setVisible(false);
    }

    // Updates value state when input is made
    function changeValue(value, newValue) {
        const newValues = { ...values };
        newValues[value] = newValue;
        setValues(newValues);
    }


    return !algorithm && (visible &&
        <div id="edit-context-menu" className="p-4 rounded-xl bg-white shadow-lg" style={{ position: 'fixed', top: renderedPosition.y + 'px', left: renderedPosition.x + 'px' }} onMouseDown={(event) => event.stopPropagation()}>
            <PrimaryButton onClick={addNode}>New Node</PrimaryButton>

            <div className="h-[1px] w-full my-4 bg-gray-300" />

            <div>
                <div className="flex flex-row mb-2">
                    <input className="p-1 rounded bg-gray-200" size={12} placeholder="Source" value={values.source} onChange={(event) => changeValue('source', event.target.value)} />
                    <input className="p-1 ml-2 rounded bg-gray-200" size={12} placeholder="Destionation" onChange={(event) => changeValue('destination', event.target.value)} />
                </div>
                <PrimaryButton onClick={addEdge}>New Edge</PrimaryButton>
            </div>
        </div>


    )
}