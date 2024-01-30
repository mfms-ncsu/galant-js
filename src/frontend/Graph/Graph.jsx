import './Graph.scss';
import './GraphPanel/GraphPanel.scss'
import GraphViewer from 'frontend/Graph/GraphViewer/GraphViewer';
import GraphPanel from './GraphPanel/GraphPanel';
import predicateConverter from 'backend/PredicateConverter';
import { useState } from 'react';
import { IconButton } from '@mui/material';

/**
 * A React component for the Graph pane which loads graphs from a file and displays them.
 *
 * @param {Object} props - This component has no properties.
 *
 * @returns {HTML} - The HTML representation of the component.
 *
 * @author Rishab Karwa
 */
function Graph(props) {
    const DEFAULT_NODE_SIZE = 30
    const [zoomedIn, setZoomedIn] = useState(false);
    const [nodeSize, setNodeSize] = useState(DEFAULT_NODE_SIZE);

    let [nodeLabels, setNodeLabels] = useState(null);
	let [nodeWeights, setNodeWeights] = useState(null);
	let [edgeLabels, setEdgeLabels] = useState(null);
	let [edgeWeights, setEdgeWeights] = useState(null);

    /** @var {cytoscape.ElementDefinition[]} - The currently displayed elements, converted from the Predicates into Cytoscape form. */
	let [elements, setElements] = useState(predicateConverter({}));
    /** @var {cytoscape.Core} - The saved Cytoscape object. This is used to make direct calls to Cytoscape such as cytoscape.fit(). */
	let [cytoscape, setCytoscape] = useState(null);
    /** @var {string} - The currently enabled layout. Begins as 'preset' which keeps the nodes in the specified positions. */
	let [layout, setLayout] = useState("preset");

    function handleRadiusChange(newSize) {
        if (newSize < 0) {
            newSize = DEFAULT_NODE_SIZE;
        }
        setNodeSize(newSize);
    }

    return (
    <div className="Graph">
        {props.displaySidebar &&
            <GraphPanel
                handleRadiusChange={handleRadiusChange}
                setZoomedIn={setZoomedIn}
                nodeSize={nodeSize}
                zoomedIn={zoomedIn}
                nodeLabels={nodeLabels}
                setNodeLabels={setNodeLabels}
                nodeWeights={nodeWeights}
                setNodeWeights={setNodeWeights}
                edgeLabels={edgeLabels}
                setEdgeLabels={setEdgeLabels}
                edgeWeights={edgeWeights}
                setEdgeWeights={setEdgeWeights}
                layout={layout}
                setLayout={setLayout}
                elements={elements}
                setElements={setElements}
                cytoscape={cytoscape}
                setCytoscape={setCytoscape}
            />
        }
        <GraphViewer 
            nodeSize={nodeSize}
            zoomedIn={zoomedIn} 
            nodeLabels={nodeLabels}
            setNodeLabels={setNodeLabels}
            nodeWeights={nodeWeights}
            setNodeWeights={setNodeWeights}
            edgeLabels={edgeLabels}
            setEdgeLabels={setEdgeLabels}
            edgeWeights={edgeWeights}
            setEdgeWeights={setEdgeWeights}
            layout={layout}
            setLayout={setLayout}
            elements={elements}
            setElements={setElements}
            cytoscape={cytoscape}
            setCytoscape={setCytoscape}
        />
    </div>
    );
}

export default Graph;
