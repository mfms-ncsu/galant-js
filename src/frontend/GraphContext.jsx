import React, {useRef, useState} from 'react';

import {enablePatches, applyPatches} from "immer";

import Graph from 'backend/Graph/Graph';

enablePatches();

const GraphContext = React.createContext();

export function GraphProvider({ children }) {
    const [graph, setGraph] = useState(() => new Graph({}, {}, false, ""));
    const [startGraph, setStartGraph] = useState(() => new Graph({}, {}, false, ""));
    
    const [loadGraph, setLoadGraph] = useState(() => (graph) => {
        setGraph(graph);
        setStartGraph(graph);
    });

    function registerOnLoad(onLoad) {
        setLoadGraph(() => (g) => {
            loadGraph(g);
            onLoad(g);
        })
        
    }

    let ref = useRef();
    ref.current = graph;
    function updateGraph(patches) {
        let newGraph = applyPatches(ref.current, patches);
        setGraph(newGraph);
    }
    
    return <GraphContext.Provider value={[graph, startGraph, loadGraph, updateGraph, registerOnLoad]}>
        {children}
    </GraphContext.Provider>
};

export default GraphContext;