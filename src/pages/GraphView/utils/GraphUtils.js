import produce from "immer";
import Graph from "utils/Graph";
import ChangeObject from "./ChangeObject";
import ChangeRecord from "./ChangeRecord";
import NodeObject from "./NodeObject";

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
    for (const nodeId in graph.nodes) {
        const node = graph.nodes[nodeId];
        positions[nodeId] = { x: node.x, y: node.y }
    }

    return positions;
}

/**
 * Given a graph and positions, update the graph to apply positions to the graph. 
 * @param {Graph} graph the graph containing the nodes to update
 * @param {*} positions 
 * @author Julian Madrigal
 */
export function applyPositions(graph, positions) {
    const newNodes = Object.values(graph.nodes).map((node) => {
        const updatedNode = { ...node };
        if (positions[updatedNode.id]) {
            updatedNode.x = positions[updatedNode.id].x;
            updatedNode.y = positions[updatedNode.id].y;
        }
        return updatedNode;
    });
    return new Graph(
        newNodes,
        graph.edges,
        graph.directed,
        graph.message,
        graph.name,
        graph.scalar
    );
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