import React from 'react';

const GraphContext = React.createContext();

export function GraphProvider({ children }) {
    const [graph, setGraph] = React.useState({});

    return <GraphContext.Provider value={[ graph, setGraph ]}>
        {children}
    </GraphContext.Provider>
};

export default GraphContext;