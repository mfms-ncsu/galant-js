import './Graph.scss';
import GraphViewer from './GraphViewer/GraphViewer';
import GraphInput from './GraphInput/GraphInput';
import { useState } from "react";

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
    const [graph, setGraph] = useState({});

    return <div className="Graph">
        <GraphViewer predicates={graph}/>
        <GraphInput setGraph={setGraph}/>
    </div>;
}

export default Graph;