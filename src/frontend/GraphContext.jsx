import React, {useRef, useState} from 'react';

import {applyPatches} from "immer";

import Graph from 'backend/Graph/Graph';

const GraphContext = React.createContext();

export function GraphProvider({ children }) {
    const [graph, setGraph] = useState(() => new Graph({}, {}, {}, ""));
    // console.log("GRAPH");
    // console.log(graph);
    
    const [loadGraph, setLoadGraph] = useState(() => setGraph);

    function registerOnLoad(onLoad) {
        setLoadGraph(() => (g) => {
            loadGraph(g);
            onLoad(g);
        })
    }

    let ref = useRef();
    ref.current = graph;
    function updateGraph(patches) {
        // console.log(patches);
        // console.log(ref.current);
        let newGraph = applyPatches(ref.current, patches);
        // console.log(newGraph);
        setGraph(newGraph);
    }
    // console.log(updateGraph);

    return <GraphContext.Provider value={[graph, loadGraph, updateGraph, registerOnLoad]}>
        {children}
    </GraphContext.Provider>
};

export default GraphContext;