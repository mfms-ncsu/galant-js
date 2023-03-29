import './Graph.scss';
import GraphViewer from 'frontend/Graph/GraphViewer/GraphViewer';
import GraphInput from 'frontend/Graph/GraphInput/GraphInput';
import { useContext } from "react";
import GraphContext from 'frontend/GraphContext';

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
	/** @var {Predicates} - The current loaded graph, in predicate form */
    const [graph, startGraph, loadGraph, setLoadGraph, updateGraph, registerOnLoad] = useContext(GraphContext);

    return <div className="Graph">
        <GraphViewer/>
        <GraphInput onUpload={loadGraph}/>
    </div>;
}

export default Graph;