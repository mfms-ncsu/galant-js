import produce from "immer";
import Graph from "utils/Graph";

export function calculateGraphScalar(nodes) {
    let maxCoord = 1;
    for (const node of nodes) {
        maxCoord = Math.max(maxCoord, Math.abs(node.x), Math.abs(node.y))
    }

    return (500) / maxCoord;
}


export function applyScalar(nodes, scalar) {
    for (const node of Object.values(nodes)) {
        node.x *= scalar;
        node.y *= scalar;
    }
}

/**
 * Given a graph, extract the node positions and create a new table in which key = id and value = {x, y}
 * 
 * @param {Graph} graph 
 * @author Julian Madrigal
 */
export function extractPositions(graph) {
    const positions = {};
    console.log(graph.nodes);
    for (const nodeId in graph.nodes) {
        const node = graph.nodes[nodeId];
        positions[nodeId] = {x: node.x, y: node.y}
    }

    return positions;
}

/**
 * Given a graph and positions, update the graph to apply positions to the graph. 
 * @param {*} positions 
 * @author Julian Madrigal
 */
export function applyPositions(graph, positions) {
    return produce(graph, draft => {
        for (const nodeId in positions) {
            draft.nodes[nodeId].x = positions[nodeId].x;
            draft.nodes[nodeId].y = positions[nodeId].y;
        }
    })
}

/**
 * Given node positions, transform the positions based on a scalar.
 * Since cytoscape transforms using a scalar on graph load, use this to undo at export.
 * @param {*} positions 
 * @param {*} scalar
 */
export function transformPositions(positions, scalar) {
    const newPositions = {};
    for (const nodeId in positions) {
        const prevPosition = positions[nodeId];
        newPositions[nodeId] = {
            x: prevPosition.x * scalar,
            y: prevPosition.y * scalar
        }
    }
    return newPositions;
}


export function roundPositions(positions) {
    const newPositions = {};
    for (const nodeId in positions) {
        const prevPosition = positions[nodeId];
        newPositions[nodeId] = {
            x: Math.floor(prevPosition.x + 0.5),
            y: Math.floor(prevPosition.y + 0.5)
        }
    }
    return newPositions;
}