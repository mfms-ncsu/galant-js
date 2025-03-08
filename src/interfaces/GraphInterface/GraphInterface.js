import produce, { enableMapSet } from "immer";
import ChangeObject from "states/ChangeManager/ChangeObject"
import Graph from "states/Graph/Graph";
import Edge from "states/Graph/GraphElement/Edge";
import Node from "states/Graph/GraphElement/Node";

/** Enable maps in immer */
enableMapSet();

/**
 * GraphInterface contains getters and setters used to interact with Graph objects.
 * Graphs are passed in as arguments to the functions and a value is returned. If
 * using a setter, both a Graph and ChangeManager are passed in and new objects for
 * the Graph and ChangeManager are returned, which are used to update the state in
 * React.
 * 
 * @author Henry Morris
 * @author Krisjian Smith
 * @author Ziyu Wang
 */

/**
 ***********
 * HELPERS *
 ***********
 */

 /**
  * Generates the next unique node id from the given list of nodes.
  * @param {Node[]} nodes Array of nodes to check
  * @returns New node id
  */
function generateId(nodes) {
    let id = 0;
    while (nodes.has(String(id))) id++;
    return String(id);
}

/**
 * Records a new change in the given change manager.
 * @param {ChangeManager} changeManager Change manager to which to add
 * @param {ChangeObject[]} change Changes to log
 * @returns Updated change manager
 */
function recordChange(changeManager, change) {
    return produce(changeManager, draft => {
        // Remove all changes after the current index
        draft.changes = draft.changes.slice(0, draft.index);

        // Push the new change
        draft.changes.push(change);

        // Increment the index
        draft.index++;
    });
}

/**
 * Verifies that both source and target nodes exist in the graph.
 * @param {Graph} graph Graph to check
 * @param {String} source Source node
 * @param {String} target Target node
 * @param {String} action Action description for the error message
 */
function verifyNodes(graph, source, target, action) {
    if (!graph.nodes.has(source) && !graph.nodes.has(target))
        throw new Error(`Cannot ${action} because neither the source (${source}) nor the target (${target}) node exist in the graph`);
    if (!graph.nodes.has(source))
        throw new Error(`Cannot ${action} because the source node (${source}) does not exist in the graph`);
    if (!graph.nodes.has(target))
        throw new Error(`Cannot ${action} because the target node (${target}) does not exist in the graph`);
}



/**
 ***********
 * GETTERS *
 ***********
 */

/**
 * Gets all adjacent nodes for the given node.
 * @param {Graph} graph Graph on which to operate
 * @param {String} nodeId Node for which to check
 * @returns Array of adjacent nodes
 */
function getAdjacentNodes(graph, nodeId) {
    let nodes = [];

    // Check if the node exists
    if (graph.nodes.has(nodeId)) {
        graph.nodes.get(nodeId).edges.forEach(edge => {
            if (edge.source === nodeId) {
                nodes.push(edge.target);
            } else {
                nodes.push(edge.source);
            }
        });

        return nodes;
    } else {
        // If the node doesn't exist, return undefined
        return undefined;
    }
}

/**
 * Gets the edge between the given source and target nodes.
 * @param {Graph} graph Graph on which to operate
 * @param {String} source Source node
 * @param {String} target Target node
 * @returns Edge between source and target
 */
function getEdge(graph, source, target) {
    const node = graph.nodes.get(source);
    if (!node) return undefined;

    return node.edges.get(`${source},${target}`);
}

/**
 * Gets the value of the given edge's attribute.
 * @param {Graph} graph Graph on which to operate
 * @param {String} source Source node
 * @param {String} target Target node
 * @param {String} name Attribute name
 * @returns Attribute value
 */
function getEdgeAttribute(graph, source, target, name) {
    // Verify the edge exists and get it
    let sourceNode = graph.nodes.get(source);
    let targetNode = graph.nodes.get(target);
    let edge = sourceNode && targetNode && sourceNode.edges.get(`${source},${target}`);

    if (edge) {
        return edge.attributes.get(name);
    } else {
        // If the edge doesn't exist, return undefined
        return undefined;
    }
}

/**
 * Gets the edge between the given source and target. If undirected, it
 * will check in both directions.
 * @param {Graph} graph Graph on which to operate
 * @param {String} source Source node
 * @param {String} target Target node
 * @returns Edge between source and target nodes
 */
function getEdgeBetween(graph, source, target) {
    let edge = getEdge(graph, source, target);
    if (edge === undefined && !graph.isDirected) {
        // If undirected, check the opposite as well
        edge = getEdge(graph, target, source);
    }
    return edge;
}

/**
 * Gets an array of all edges in the given graph.
 * @param {Graph} graph Graph on which to operate
 * @returns Array of edges in the graph
 */
function getEdgeIds(graph) {
    const edges = [];

    graph.nodes.forEach(node => {
        node.edges.forEach((edge, key) => {
            if (edge.source === node.id) {
                edges.push(key);
            }
        });
    });

    return edges;
}

/**
 * Gets the name of the graph and the appropriate file extension.
 * @param {Graph} graph Graph on which to operate 
 * @returns String file name for graph.
 */
function getFileName(graph) {
    return graph.name;
}

/**
 * Gets all edges into and out of the given node.
 * @param {Graph} graph Graph on which to operate
 * @param {String} nodeId Node id
 * @returns Array of all edges incident to nodeId, undefined if nodeId doesn't exist
 */
function getIncidentEdges(graph, nodeId) {
    // Check if the node exists
    if (graph.nodes.has(nodeId)) {
        // If it does, return an array of all of its edges
        return [...graph.nodes.get(nodeId).edges.keys()];
    } else {
        // If the node doesn't exist, return undefined
        return undefined;
    }
}

/**
 * Gets all edges incoming to the given node.
 * @param {Graph} graph Graph on which to operate
 * @param {String} target Target node id
 * @returns Array of edges incoming to target, undefined if the target doesn't exist
 */
function getIncomingEdges(graph, target) {
    // Return undefined if the node doesn't exist
    if (!graph.nodes.has(target)) {
        return undefined;
    }

    // Get all edges if undirected
    if (!graph.isDirected) {
        return getIncidentEdges(graph, target);
    }

    // Keep an array of edges
    const edges = [];

    // Iterate over all edges
    graph.nodes.get(target).edges.forEach((edge, key) => {
        // Only push if the given node is the target
        if (edge.target === target) {
            edges.push(key);
        }
    });

    return edges;
}

/**
 * Gets all nodes incoming to the given node.
 * @param {Graph} graph Graph on which to operate
 * @param {String} target Node to check
 * @returns Array of incoming nodes
 */
function getIncomingNodes(graph, target) {
    // Get all nodes if undirected
    if (!graph.isDirected) {
        return getAdjacentNodes(graph, target);
    }

    let nodes = [];

    // Check if the node exists
    if (graph.nodes.has(target)) {
        graph.nodes.get(target).edges.forEach(edge => {
            if (edge.target === target) {
                nodes.push(edge.source);
            }
        });

        return nodes;
    } else {
        // If the node doesn't exist, return undefined
        return undefined;
    }
}

/**
 * Gets the most recent message from the current index in the given change manager.
 * @param {ChangeManager} changeManager ChangeManager from which to retrieve the message
 */
function getMessage(changeManager) {
    for (let i = changeManager.index; i >= 0; i--) {
        if (changeManager.changes[i]) {
            for (const change of changeManager.changes[i]) {
                if (change.action === "message") {
                    return change.current.message;
                }
            }
        }
    }
    return null;
}

 /**
 * Gets the value of the given node's attribute.
 * @param {Graph} graph Graph on which to operate
 * @param {String} nodeId Node to check
 * @param {String} name Attribute name
 * @returns Attribute value
 */
function getNodeAttribute(graph, nodeId, name) {
    // Get the node
    let node = graph.nodes.get(nodeId);

    if (node) {
        return node.attributes.get(name);
    } else {
        // If the node doesn't exist, return undefined
        return undefined;
    }
}

/**
 * Gets the values of the graph's nodes as an array of ids.
 * @param {Graph} graph Graph on which to operate
 * @returns Array of node ids
 */
function getNodeIds(graph) {
    return [...graph.nodes.keys()];
}

/**
 * Gets the position of a given node.
 * @param {Graph} graph Graph on which to operate
 * @param {String} nodeId Node id
 * @returns Node position
 */
function getNodePosition(graph, nodeId) {
    // Get the node
    let node = graph.nodes.get(nodeId);

    if (node) {
        return node.position;
    } else {
        // If the node doesn't exist, return undefined
        return undefined;
    }
}

/**
 * Gets the values of the graph's node map as an array.
 * @param {Graph} graph Graph on which to operate
 * @returns Array of nodes
 */
function getNodes(graph) {
    return [...graph.nodes.values()];
}

/**
 * Returns the total number of edges in the graph.
 * @param {Graph} graph Graph on which to operate
 * @return the total number of edges in the graph
 */
function getNumberOfEdges(graph) {
    return getEdgeIds(graph).length;
}

/**
 * Returns the total number of nodes in the graph.
 * @param {Graph} graph Graph on which to operate
 * @return the total number of nodes in the graph
 */
function getNumberOfNodes(graph) {
    return graph.nodes.size;
}

/**
 * Gets the node opposite the given on the given edge.
 * @param {Graph} graph Graph on which to operate
 * @param {String} nodeId Id of the node to check for
 * @param {String} edgeId Id of the edge to check (Source,Target format)
 * @throws If nodeId does not exist in the graph, or if the given edge does not exist
 * @returns Id of the node opposite the given
 */
function getOppositeNode(graph, nodeId, edgeId) {
    // Error checking
    // Note that for getters, we usually just return undefined if the node or edge doesn't exist. I am adding
    // detailed error messages in an attempt to debug some Algorithm functions. Feel free to change these to just
    // return undefined to make it consistent with the rest of the graph functions
    if (!graph.nodes.has(nodeId))
        throw new Error(`Cannot get opposite node of node "${nodeId}" because it does not exist in the graph`);
    if (!graph.nodes.get(nodeId).edges.has(edgeId))
        throw new Error(`Cannot get the opposite of edge "${edgeId}" because it does not exist in the graph`);

    // Get the edge
    let edge = graph.nodes.get(nodeId).edges.get(edgeId);
    if (!edge) return undefined;

    // Return the id of the opposite node
    return (edge.source === nodeId) ? edge.target : edge.source;
}

/**
 * Gets all edges ougoing from the given node.
 * @param {Graph} graph Graph on which to operate
 * @param {String} source Source node id
 * @returns Array of edges outgoing from source, undefined if source doesn't exist
 */
function getOutgoingEdges(graph, source) {
    // Return undefined if the node doesn't exist
    if (!graph.nodes.has(source)) {
        return undefined;
    }

    // Get all edges if undirected
    if (!graph.isDirected) {
        return getIncidentEdges(graph, source);
    }

    // Keep an array of edges
    const edges = [];

    // Iterate over all edges
    graph.nodes.get(source).edges.forEach((edge, key) => {
        // Only push if the given node is the source
        if (edge.source === source) {
            edges.push(key);
        }
    });

    return edges;
}

/**
 * Gets all nodes outgoing from the given node.
 * @param {Graph} graph Graph on which to operate
 * @param {String} source Node to check
 * @returns Array of outgoing nodes
 */
function getOutgoingNodes(graph, source) {
    // Get all nodes if undirected
    if (!graph.isDirected) {
        return getAdjacentNodes(graph, source);
    }

    let nodes = [];

    // Check if the node exists
    if (graph.nodes.has(source)) {
        graph.nodes.get(source).edges.forEach(edge => {
            if (edge.source === source) {
                nodes.push(edge.target);
            }
        });

        return nodes;
    } else {
        // If the node doesn't exist, return undefined
        return undefined;
    }
}

//TODO: Implement x and y scales.
/**
 * Calculates the scalar for the given graph to equalize its size.
 * @param {Graph} graph Graph on which to operate
 * @returns Object of Scalars for the x and y scales
 */
function getScalar(graph) {
    let max = 1;
    graph.nodes.forEach(node => {
        max = Math.max(max, Math.abs(node.position.x), Math.abs(node.position.y));
    });
    return {x: 500 / max, y: 500 / max};
}

/**
 * Returns the id of the target of the given edge.
 * @param {Graph} graph Graph on which to operate
 * @param {Edge} edge Edge on which to operate
 * @return the id of the target of the given edge
 * @throws if the edge does not exist
 */
function getTarget(graph, edge) {
    const nodes = edge.split(",");
    if (nodes.length !== 2 || !graph.nodes.has(nodes[1])) { 
        throw new Error("Given edge is not valid: " + edge);
    }
    return nodes[1];
}

/**
 * Returns the id of the source of the given edge.
 * @param {Graph} graph Graph on which to operate
 * @param {Edge} edge Edge on which to operate
 * @return the id of the source of the given edge
 * @throws if the edge does not exist
 */
function getSource(graph, edge) {
    const nodes = edge.split(",");
    if (nodes.length !== 2 || !graph.nodes.has(nodes[0])) { 
        throw new Error("Given edge is not valid: " + edge);
    }
    return nodes[0];
}



/**
 ***********
 * SETTERS *
 ***********
 */

/**
 * Adds a new edge between the given source and target nodes.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to which to push the change
 * @param {String} source Source node
 * @param {String} target Target node
 * @param {Object} attributes Optional attributes
 * @returns Updated graph and change manager
 */
function addEdge(graph, changeManager, source, target, attributes) {
    // Error checking
    verifyNodes(graph, source, target, "create edge");

    const newGraph = produce(graph, draft => {
        // Create the edge object
        let edge = new Edge(source, target);

        // Set the attributes
        for (let name in attributes) {
            edge.attributes.set(name, attributes[name]);
        }

        // Add the edge to both the source and target's adjacency lists
        draft.nodes.get(source).edges.set(`${source},${target}`, edge);
        draft.nodes.get(target).edges.set(`${source},${target}`, edge);
    });

    // Add the change object to the changeManager
    const newChangeManager = recordChange(changeManager, [new ChangeObject("addEdge", null, {
        source: source,
        target: target
    })]);

    // Return mutated graph and change manager to trigger re-render
    return [newGraph, newChangeManager];
}

/**
 * Adds a new message to the given change manager.
 * @param {ChangeManager} changeManager ChangeManager to which to push the change
 * @param {String} message New message
 * @returns Updated change manager
 */
function addMessage(changeManager, message) {
    const newChangeManager = recordChange(changeManager, [new ChangeObject("message", null, {
        message: message
    })]);

    return newChangeManager;
}

/**
 * Adds a new node at the specified position.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to which to push the change
 * @param {Number} x X position
 * @param {Number} y Y position
 * @param {String} nodeId Optional node id
 * @param {Object} attributes Optional attributes
 * @returns Updated graph and change manager, along with the new node's id
 */
function addNode(graph, changeManager, x, y, nodeId, attributes) {
    // Throw an error if the id is a duplicate
    if (nodeId && graph.nodes.has(nodeId)) {
        throw new Error("Cannot add node with duplicate ID");
    }

    // If the nodeId argument is passed, use that, otherwise generate an id
    nodeId = nodeId || generateId(graph.nodes);

    const newGraph = produce(graph, draft => {
        // Create the node
        let node = new Node(nodeId, x, y);
        draft.nodes.set(nodeId, node);

        // Set the attributes
        for (let name in attributes) {
            node.attributes.set(name, attributes[name]);
        }
    });

    // Add the change object to the changeManager
    const newChangeManager = recordChange(changeManager, [new ChangeObject("addNode", null, {
        id: nodeId,
        position: {
            x: x,
            y: y
        }
    })]);

    // Return mutated graph and change manager to trigger re-render
    // Add the node id as the third return value
    return [newGraph, newChangeManager, nodeId];
}

/**
 * Deletes the specified edge and creates the appropriate ChangeObject.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to which to push the change
 * @param {String} source ID of the source node
 * @param {String} target ID of the target node
 * @returns Updated graph and change manager
 */
function deleteEdge(graph, changeManager, source, target) {
    // Error checking
    verifyNodes(graph, source, target, "delete edge");

    // Get a copy of the attributes
    const attributes = graph.nodes.get(source).edges.get(`${source},${target}`).attributes;

    const newGraph = produce(graph, draft => {
        // Delete the edge in the nodes
        draft.nodes.get(source).edges.delete(`${source},${target}`);
        draft.nodes.get(target).edges.delete(`${source},${target}`);
    });

    // Add the change object to the changeManager
    const newChangeManager = recordChange(changeManager, [new ChangeObject("deleteEdge", {
        source: source,
        target: target,
        attributes: attributes
    }, null)]);

    // Return mutated graph and change manager to trigger re-render
    return [newGraph, newChangeManager];
}

/**
 * Deletes a node and its incident edges from the graph. Creates ChangeObjects
 * for each deletion in the step and returns them in an array.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to which to push the change
 * @param {String} nodeId ID of the node to delete
 * @returns Updated graph and change manager
 */
function deleteNode(graph, changeManager, nodeId) {
    // Error checking
    if (!graph.nodes.has(nodeId)) {
        throw new Error("Cannot delete node " + nodeId + " because it does not exist in the graph");
    }

    // Keep an array of ChangeObjects for the delete step
    const changeObjects = [];

    const newGraph = produce(graph, draft => {
        // Get a reference to the node
        const node = draft.nodes.get(nodeId);

        // Delete each edge and push the change objects into the array
        node.edges.forEach(edge => {
            let [newGraph, newChangeManager] = deleteEdge(draft, changeManager, edge.source, edge.target);
            draft = newGraph;
            changeManager = newChangeManager;
        });

        // Finally, delete the node from the nodes list
        draft.nodes.delete(nodeId);
    });

    // Create a ChangeObject for the deleted node
    const node = graph.nodes.get(nodeId);
    changeObjects.push(new ChangeObject("deleteNode", {
        id: node.id,
        position: node.position,
        attributes: node.attributes
    }, null));

    // Add the change objects to the changeManager
    const newChangeManager = recordChange(changeManager, changeObjects);

    // Return mutated graph and change manager to trigger re-render
    return [newGraph, newChangeManager];    
}

/**
 * Makes the ChangeManager stop recording. Any changes that happened while recording will be
 * saved as a single entry in the changes list.
 * @param {ChangeManager} changeManager ChangeManager for which to stop recording
 * @returns Updated change manager
 */
function endRecording(changeManager) {
    // If we are not recording, then we cannot stop recording.
    if (!changeManager.isRecording) {
        throw new Error("Cannot stop recording becausee this ChangeManager has not started recording");
    }

    const newChangeManager = produce(changeManager, draft => {
        // Set the isRecording flag back to false
        draft.isRecording = false;

        // Record the list of changes, but only if changes were actually made. If
        // the recordedChanges list is empty, do nothing.
        if (draft.recordedChanges.length !== 0) {
            // Remove all changes after the current index
            draft.changes = draft.changes.slice(0, draft.index);

            // Push the new changes
            draft.changes.push(draft.recordedChanges);

            // Increment the index
            draft.index++;
        }
    });

    // Return the change manager
    return newChangeManager;
}

/**
 * Redoes the ChangeObjects in the given change manager.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager from which to redo
 * @returns Updated graph and change manager
 */
function redo(graph, changeManager) {
    // Check if there are any changes to redo
    if (changeManager.index < changeManager.changes.length) {
        // Get the next step
        const step = changeManager.changes[changeManager.index];

        // Redo the change
        const newGraph = produce(graph, draft => {
            step.forEach(change => {
                switch (change.action) {
                    case "addNode":
                        draft.nodes.set(change.current.id, new Node(change.current.id, change.current.position.x, change.current.position.y));
                        break;
                    case "deleteNode":
                        draft.nodes.delete(change.previous.id);
                        break;
                    case "addEdge":
                        draft.nodes.get(change.current.source).edges.set(`${change.current.source},${change.current.target}`, new Edge(change.current.source, change.current.target));
                        draft.nodes.get(change.current.target).edges.set(`${change.current.source},${change.current.target}`, new Edge(change.current.source, change.current.target));
                        break;
                    case "deleteEdge":
                        draft.nodes.get(change.previous.source).edges.delete(`${change.previous.source},${change.previous.target}`);
                        draft.nodes.get(change.previous.target).edges.delete(`${change.previous.source},${change.previous.target}`);
                        break;
                    case "setNodePosition":
                        draft.nodes.get(change.current.id).position = change.current.position;
                        break;
                    case "setNodeAttribute":
                        draft.nodes.get(change.current.id).attributes.set(change.current.attribute.name, change.current.attribute.value);
                        break;
                    case "setEdgeAttribute":
                        draft.nodes.get(change.current.source).edges.get(`${change.current.source},${change.current.target}`).attributes.set(change.current.attribute.name, change.current.attribute.value);
                        break;
                }
            });
        });

        const newChangeManager = produce(changeManager, draft => {
            draft.index++;
        });

        // Return mutated graph and change manager to trigger re-render
        return [newGraph, newChangeManager];
    }

    // If there aren't any changes to redo, just return the original objects
    return [graph, changeManager];
}

/**
 * Undoes all changes back to the original graph.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager from which to revert
 * @returns Updated graph and change manager
 */
function revert(graph, changeManager) {
    while (changeManager.index > 0) {
        [graph, changeManager] = undo(graph, changeManager);
    }

    return [graph, changeManager];
}

/**
 * Sets a new value for an attribute within an edge and creates a corresponding
 * ChangeObject to record the change.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to which to push the change
 * @param {String} source Source node of the edge for which to set an attribute value
 * @param {String} target Target node of the edge for which to set an attribute value
 * @param {String} name Name of the attribute to set
 * @param {Object} value Balue to set for the attribute
 * @returns Updated graph and change manager
 */
function setEdgeAttribute(graph, changeManager, source, target, name, value) {
    // Error checking
    verifyNodes(graph, source, target, "set attribute of edge");

    const newGraph = produce(graph, draft => {
        // Get a reference to the edge
        const edge = draft.nodes.get(source).edges.get(`${source},${target}`);

        // Update the edge's attribute
        edge.attributes.set(name, value);
    });

    // Add the change object to the changeManager
    const newChangeManager = recordChange(changeManager, [new ChangeObject("setEdgeAttribute", {
        source: source,
        target: target,
        attribute: {
            name: name,
            value: graph.nodes.get(source).edges.get(`${source},${target}`).attributes.get(name)
        }
    }, {
        source: source,
        target: target,
        attribute: {
            name: name,
            value: value
        }
    })]);

    // Return mutated graph and change manager to trigger re-render
    return [newGraph, newChangeManager];
}

/**
 * Sets a new value for an attribute for all edges and creates an array
 * of corresponding ChangeObjects.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to which to push the change
 * @param {String} name Name of the attribute to set
 * @param {Object} value Value to set for the attribute
 * @returns Updated graph and change manager
 */
function setEdgeAttributeAll(graph, changeManager, name, value) {
    // Keep an array of ChangeObjects for the delete step
    const changeObjects = [];

    const newGraph = produce(graph, draft => {
        // Loop over each edge
        draft.nodes.forEach(node => {
            node.edges.forEach((edge) => {
                if (edge.source === node.id) {
                    // Set the attribute
                    edge.attributes.set(name, value);
                }
            });
        });
    });

    // Loop over each edge
    graph.nodes.forEach(node => {
        node.edges.forEach((edge) => {
            if (edge.source === node.id) {
                // Push a new change object
                changeObjects.push(new ChangeObject("setEdgeAttribute", {
                    source: edge.source,
                    target: edge.target,
                    attribute: {
                        name: name,
                        value: edge.attributes.get(name)
                    }
                }, {
                    source: edge.source,
                    target: edge.target,
                    attribute: {
                        name: name,
                        value: value
                    }
                }));
            }
        });
    });

    // Add the change objects to the change manager
    const newChangeManager = recordChange(changeManager, changeObjects);

    // Return mutated graph and change manager to trigger re-render
    return [newGraph, newChangeManager];
}

/**
 * Sets a new value for isDirected within the graph.
 * @param {Graph} graph Graph on which to operate
 * @param {Boolean} isDirected Flag for whether the graph is directed
 * @returns Updated graph object
 */
function setDirected(graph, isDirected) {
    const newGraph = produce(graph, draft => {
        draft.isDirected = isDirected;
    });
    return newGraph;
}

/**
 * Sets a new value for an attribute within a node and creates a corresponding
 * ChangeObject to record the change.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to which to push the change
 * @param {String} nodeId Node for which to set an attribute value
 * @param {String} name Name of the attribute to set
 * @param {Object} value Value to set for the attribute
 * @returns Updated graph and change manager
 */
function setNodeAttribute(graph, changeManager, nodeId, name, value) {
    if (!graph.nodes.has(nodeId)) {
        throw new Error("Cannot set attribute of node " + nodeId + " because the node does not exist in the graph");
    }

    const newGraph = produce(graph, draft => {
        // Update the node's attribute
        draft.nodes.get(nodeId).attributes.set(name, value);
    });

    // Add the change object to the changeManager
    const newChangeManager = recordChange(changeManager, [new ChangeObject("setNodeAttribute", {
        id: nodeId,
        attribute: {
            name: name,
            value: graph.nodes.get(nodeId).attributes.get(name)
        }
    }, {
        id: nodeId,
        attribute: {
            name: name,
            value: value
        }
    })]);

    // Return mutated graph and change manager to trigger re-render
    return [newGraph, newChangeManager];
}

/**
 * Sets a new value for an attribute for all nodes and creates an array
 * of corresponding ChangeObjects.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to which to push the change
 * @param {String} name Name of the attribute to set
 * @param {Object} value Value to set for the attribute
 * @returns Updated graph and change manager
 */
function setNodeAttributeAll(graph, changeManager, name, value) {
    // Keep an array of ChangeObjects for the delete step
    const changeObjects = [];

    const newGraph = produce(graph, draft => {
        // Loop over each node
        draft.nodes.forEach(node => {
            // Set the attribute
            node.attributes.set(name, value);
        });
    });

    // Loop over each node
    graph.nodes.forEach(node => {
        // Push a new change object
        changeObjects.push(new ChangeObject("setNodeAttribute", {
            id: node.id,
            attribute: {
                name: name,
                value: node.attributes.get(name)
            }
        }, {
            id: node.id,
            attribute: {
                name: name,
                value: value
            }
        }));
    });

    // Add the change objects to the change manager
    const newChangeManager = recordChange(changeManager, changeObjects);

    // Return mutated graph and change manager to trigger re-render
    return [newGraph, newChangeManager];
}

/**
 * Sets a new position for the given node.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to which to push the change
 * @param {String} nodeId Node to move
 * @param {Number} x New x position
 * @param {Number} y New y position
 * @returns Updated graph and change manager
 */
function setNodePosition(graph, changeManager, nodeId, x, y) {
    // Get a reference to the node
    const node = graph.nodes.get(nodeId);

    // Error checking
    if (!node) {
        throw new Error(`Cannot set position of node ${nodeId} because it does not exist in the graph`);
    }

    // Store old and new values for the position
    let oldPosition = node.position;
    let newPosition = {
        x: x,
        y: y
    };

    // Update the node's position
    const newGraph = produce(graph, draft => {
        draft.nodes.get(nodeId).position = newPosition;
    });

    // Add the change object to the changeManager
    const newChangeManager = recordChange(changeManager, [new ChangeObject("setNodePosition", {
        id: nodeId,
        position: oldPosition
    }, {
        id: nodeId,
        position: newPosition
    })]);

    // Return mutated graph and change manager to trigger re-render
    return [newGraph, newChangeManager];
}

/**
 * Makes the ChangeManager start recording. When recording, the ChangeManager
 * will not save any new ChangeObjects until the recording is over. When the
 * recording is over, it will save all the ChangeObjects at once, so that they
 * will all be undone/redone at once
 * @param {ChangeManager} changeManager ChangeManager for which to start recording
 * @return Updated change manager
 */
function startRecording(changeManager) {
    // If we are already recording, and startRecording() is called, then something
    // went wrong. We should throw an error to let the user know that something
    // happened
    if (changeManager.isRecording) {
        throw new Error("Cannot start recording because this ChangeManager is already recording");
    }

    const newChangeManager = produce(changeManager, draft => {
        // Reset the change list and set the isRecording flag to true
        draft.recordedChanges = [];
        draft.isRecording = true;
    });

    // Return a mutation of the change manager
    return newChangeManager;
}

/**
 * Converts the graph to a string representation for exporting to a file.
 * @param {Graph} graph Graph on which to operate
 * @returns String representation of the current graph
 */
function toString(graph) {
    // Start this file with the header comments
    // TODO: Headers
    let content = "";

    // Loop over each node
    graph.nodes.forEach(node => {
        // Get the attributes string
        let attributesString = " " + [...node.attributes.entries()]
            .filter(([key ,value]) => key !== "weight" && value !== undefined && value !== false && value !== "")
            .map(([key, value]) => `${key}:${value}`)
            .join(" ");

        // Get the weight string
        let weightString = (node.attributes.get("weight") !== undefined) ? ` ${node.attributes.get("weight")}` : "";

        // Add the node line
        content += `n ${node.id} ${node.position.x.toFixed(4).replace(/[.,]0000$/, "")} ${node.position.y.toFixed(4).replace(/[.,]0000$/, "")}${weightString}${attributesString}\n`;
    });

    // Loop over each edge
    graph.nodes.forEach(node => {
        node.edges.forEach(edge => {
            if (edge.source === node.id) {
                // Get the attributes string
                let attributesString = " " + [...edge.attributes.entries()]
                    .filter(([key, value]) => key !== "weight" && value !== undefined && value !== false && value !== "")
                    .map(([key, value]) => `${key}:${value}`)
                    .join(" ");

                // Get the weight string
                let weightString = (edge.attributes.get("weight") !== undefined) ? ` ${edge.attributes.get("weight")}` : "";
                
                // Add the edge line
                content += `e ${edge.source} ${edge.target}${weightString}${attributesString}\n`;
            }
        });
    });

    // Return the string
    return content;
}

/**
 * Undoes the ChangeObjects in the given change manager.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager from which to undo
 * @returns Updated graph and change manager
 */
function undo(graph, changeManager) {
    // Check if there are any changes to undo
    if (changeManager.index > 0) {
        // Get the previous step
        const step = changeManager.changes[changeManager.index - 1];

        // Undo the change
        const newGraph = produce(graph, draft => {
            step.forEach(change => {
                switch (change.action) {
                    case "addNode":
                        draft.nodes.delete(change.current.id);
                        break;
                    case "deleteNode":
                        draft.nodes.set(change.previous.id, new Node(change.previous.id, change.previous.position.x, change.previous.position.y));
                        let node = draft.nodes.get(change.previous.id);
                        change.previous.attributes.forEach((value, key) => {
                            node.attributes.set(key, value);
                        });
                        break;
                    case "addEdge":
                        draft.nodes.get(change.current.source).edges.delete(`${change.current.source},${change.current.target}`);
                        draft.nodes.get(change.current.target).edges.delete(`${change.current.source},${change.current.target}`);
                        break;
                    case "deleteEdge":
                        draft.nodes.get(change.previous.source).edges.set(`${change.previous.source},${change.previous.target}`, new Edge(change.previous.source, change.previous.target));
                        draft.nodes.get(change.previous.target).edges.set(`${change.previous.source},${change.previous.target}`, new Edge(change.previous.source, change.previous.target));
                        let edge = draft.nodes.get(change.previous.source).edges.get(`${change.previous.source},${change.previous.target}`);
                        change.previous.attributes.forEach((value, key) => {
                            edge.attributes.set(key, value);
                        });
                        break;
                    case "setNodePosition":
                        draft.nodes.get(change.previous.id).position = change.previous.position;
                        break;
                    case "setNodeAttribute":
                        draft.nodes.get(change.previous.id).attributes.set(change.previous.attribute.name, change.previous.attribute.value);
                        break;
                    case "setEdgeAttribute":
                        draft.nodes.get(change.previous.source).edges.get(`${change.previous.source},${change.previous.target}`).attributes.set(change.previous.attribute.name, change.previous.attribute.value);
                        break;
                }
            });
        });

        const newChangeManager = produce(changeManager, draft => {
            draft.index--;
        });

        // Return mutated graph and change manager to trigger re-render
        return [newGraph, newChangeManager];
    }

    // If there are no changes, just return the original objects
    return [graph, changeManager];
}


/** Export an object containing the interface */
const GraphInterface = {
    getAdjacentNodes,
    getEdge,
    getEdgeAttribute,
    getEdgeBetween,
    getEdgeIds,
    getFileName,
    getIncidentEdges,
    getIncomingEdges,
    getIncomingNodes,
    getMessage,
    getNodeAttribute,
    getNodeIds,
    getNodePosition,
    getNodes,
    getNumberOfEdges,
    getNumberOfNodes,
    getOppositeNode,
    getOutgoingEdges,
    getOutgoingNodes,
    getScalar,
    getSource,
    getTarget,
    addEdge,
    addMessage,
    addNode,
    deleteEdge,
    deleteNode,
    endRecording,
    redo,
    revert,
    setEdgeAttribute,
    setEdgeAttributeAll,
    setDirected,
    setNodeAttribute,
    setNodeAttributeAll,
    setNodePosition,
    startRecording,
    toString,
    undo
};
export default GraphInterface;