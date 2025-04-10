import LayeredGraph from "states/Graph/LayeredGraph";
import produce, { enableMapSet } from "immer";
import GraphInterface from "./GraphInterface";
import ChangeManager from "states/ChangeManager/ChangeManager";
import ChangeObject from "states/ChangeManager/ChangeObject";


/**
 * LayeredGraphInterface contains getters and setters used to interact with Graph objects,
 * more specifically functions unique to Layered Graphs. When creating a new function make sure
 * to check it is a l
 * Graphs are passed in as arguments to the functions and a value is returned. If
 * using a setter, both a Graph and ChangeManager are passed in and new objects for
 * the Graph and ChangeManager are returned, which are used to update the state in
 * React.
 *
 * @author Heath Dyer
 * @author Michael Richardson
 */

/**
 * Helper function to handle what to do when a graph
 * is not a layered graph. Right now throws error if not.
 * @param {Graph} graph Graph on which to operate
 * @author Heath Dyer
 */
function isLayered(graph) {
    if (!(graph.type == 'layered')) {
        throw new Error("Function can only be performed on layered graphs.");
    }
}

/**
 * Help function that checks if two nodes have an edge crossing
 * Edge crossings: two edges e = wy and f = xz cross if one of the following holds
 * index(w) < index(x) and index(y) > index(z)
 * index(w) > index(x) and index(y) < index(z)
 * @param {Graph} graph Graph on which to operate
 * @param {Edge} e Edge 1 to check
 * @param {Edge} f Edge 2 to check
 * @author Heath Dyer
 */
function isCrossed(graph, e, f) {
    isLayered(graph);
    //get nodes
    let w = graph.nodes.get(e.source);
    let y = graph.nodes.get(e.target);
    let x = graph.nodes.get(f.source);
    let z = graph.nodes.get(f.target);
    // Check if layers are correct but swapped
    if (w.layer == z.layer && y.layer == x.layer) {
        //we must swap for algorithm correctness
        let temp = x;
        x = z;
        z = temp;
    }
    // Now layers should be correct. If they aren't, they are on different layers
    if (w.layer != x.layer && y.layer != z.layer) {
        return false;
    }
    // Now check if they are crossed
    if (w.index < x.index && y.index > z.index) {
        return true;
    }
    if (w.index > x.index && y.index < z.index) {
        return true;
    } 
    return false;
}

/**
 * Number of edges that cross edge in graph
 * c(e) = the number of edges that cross edge e
 * @param {Graph} graph Graph on which to operate
 * @param {Edge} e edge to check for crossings
 * @author Heath Dyer
 */
function crossings(graph, e) {
    isLayered(graph);
    let crossings = 0;
    let visitedEdges = new Set();
    graph.nodes.forEach(node => {
        node.edges.forEach(f => {
            if (e != f && !visitedEdges.has(f) && isCrossed(graph, e, f)) {
                // console.log(`${e.attributes.get("label")} crosses ${f.attributes.get("label")}`);
                crossings += 1;
            }
            visitedEdges.add(f);
        });
    });
    // console.log(`crossings: ${crossings}`);
    return crossings;
}

/**
 *  Get total crossings of the graph
 * Total crossings = (sum over e of c(e)) / 2
 * each crossing is counted twice
 * @param {Graph} graph Graph on which to operate
 * @author Heath Dyer
 */
function totalCrossings(graph) {
    isLayered(graph);
    let total = 0;
    let visitedEdges = new Set();
    graph.nodes.forEach(node => {
        node.edges.forEach(e => {
            if (!visitedEdges.has(e)) {
                total += crossings(graph, e);
                visitedEdges.add(e);
            }
        });
    });
    return total / 2;
}

/**
 * Gets bottle neck crossings of the graph
 * Bottleneck crossings = max over e of c(e)
 * @param {Graph} graph Graph on which to operate
 * @author Heath Dyer
 */
function bottleneckCrossings(graph) {
    isLayered(graph);
    let max = 0;
    let visitedEdges = new Set();
    graph.nodes.forEach(node => {
        node.edges.forEach(e => {
            if (!visitedEdges.has(e)) {
                const c = crossings(graph, e);
                if (c > max) {
                    max = c;
                }
                visitedEdges.add(e);
            }
        });
    });
    return max;
}

/**
 * Helper function to get non-verticality of edge
 * Non-verticality of edge e = xy is (position(x) – position()y)2
 * @param {Graph} graph Graph on which to operate
 * @param {Edge} e Edge to get non-verticality of
 * @author Heath Dyer
 */
function nonVerticality(graph, e) {
    isLayered(graph);
    const source = graph.nodes.get(e.source);
    const target = graph.nodes.get(e.target);
    return (source.position.x - target.position.x) ** 2;
}

/**
 * Gets total non-verticality of graph
 * Total non-verticality = sum over e of nv(e)
 * @param {Graph} graph Graph on which to operate
 * @author Heath Dyer
 */
function totalNonVerticality(graph) {
    isLayered(graph);
    let result = 0;
    let visitedEdges = new Set();
    graph.nodes.forEach(node => {
        node.edges.forEach(e => {
            if (!visitedEdges.has(e)) {
                result += nonVerticality(graph, e);
                visitedEdges.add(e);
            }
        });
    });
    return result;
}

/**
 * Gets bottleneck non-verticality of graph
 * Bottleneck non-verticality = max over e of nv(e)
 * @param {Graph} graph Graph on which to operate
 * @author Heath Dyer
 */
function bottleneckVerticality(graph) {
    isLayered(graph);
    let max = 0;
    let visitedEdges = new Set();
    graph.nodes.forEach(node => {
        node.edges.forEach(e => {
            if (!visitedEdges.has(e)) {
                const nv = nonVerticality(graph, e);
                if (nv > max) {
                    max = nv;
                }
                visitedEdges.add(e);
            }
        });
    });
    return max;
}

/**
 * sets some attribute of all nodes on layer i to the value
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {Integer} layer Layer on graph
 * @param {String} attribute Name of attribute to modify
 * @param {*} value  Value of attribute to set
 * @author Heath Dyer
 */
function setLayerProperty(graph, changeManager, layer, attribute, value) {
    isLayered(graph);
    const layerNodes = nodesOnLayer(graph, layer);
    const changeObjects = [];
    // update graph
    let newGraph = produce(graph, (draft) => {
        layerNodes.forEach(node => {
            //create change object
            changeObjects.push(new ChangeObject("setNodeAttribute",
                {
                    id: node.id,
                    attribute: {
                        name: attribute,
                        value: draft.nodes.get(node.id).attributes.get(attribute),
                    },
                },
                {
                    id: node.id,
                    attribute: {
                        name: attribute,
                        value: value,
                    },
                },
            ));
            //update attribute
            draft.nodes.get(node.id).attributes.set(attribute, value);
        });
    });
    //update change record
    const newChangeManager = GraphInterface.recordChange(changeManager, changeObjects);
    //update change record
    return [newGraph, newChangeManager];   
}


/**
 * Sets some attribute of all edges in channel to the value
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {Integer} channel channel on graph
 * @param {String} attribute Name of attribute to modify
 * @param {*} value  Value of attribute to set
 * @author Heath Dyer (hadyer)
 */
function setChannelProperty(graph, changeManager, channel, attribute, value) {
    isLayered(graph);
    // get all nodes on layer
    const layerNodes = nodesOnLayer(graph, channel);
    const changeObjects = [];
    let newGraph = produce(graph, (draft) => {
        layerNodes.forEach(node => {
            node.edges.forEach((e, index) => {
                const source = draft.nodes.get(e.source);
                const target = draft.nodes.get(e.target);
                if ((source.layer == channel && target.layer == channel + 1) || (source.layer == channel + 1 && target.layer == channel )) {
                    //create change object
                    changeObjects.push(new ChangeObject("setEdgeAttribute",
                        {
                            source: e.source,
                            target: e.target,
                            attribute: {
                                name: attribute,
                                value: draft.nodes.get(node.id).edges.get(`${e.source},${e.target}`).attributes.get(attribute),
                            },
                        },
                        {
                            source: e.source,
                            target: e.target,
                            attribute: {
                                name: attribute,
                                value: value,
                            },
                        },
                    ));
                    // update attribute
                    draft.nodes.get(node.id).edges.get(`${e.source},${e.target}`).attributes.set(attribute, value);
                }
            })
        });
    });
    //update change record
    const newChangeManager = GraphInterface.recordChange(changeManager, changeObjects);
    return [newGraph, newChangeManager];   
}

/**
 * Assigns weights to all nodes on layer i based on average of positions or 
 * indexes of adjacent nodes on layer above.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {Integer} layer Layer to operate on
 * @param {String} type Specify "position" or "index"
 * @author Heath Dyer (hadyer)
 */
function setWeightsUp(graph, changeManager, layer, type) {
    isLayered(graph);
    //check validity of type
    if (type !== "index" && type !== "position") {
        throw new Error('Invalid type. Type must be "index" or "position".');
    }
    const changeObjects = [];
    //immer new graph
    let newGraph = produce(graph, (draft) => {
        // get nodes on layer
        const layerNodes = nodesOnLayer(graph, layer);
        // iterate through each node's edges on that layer
        layerNodes.forEach(node => {
            //keep track of all nodes for weight calculation
            const adjacentNodes = new Set();
            node.edges.forEach(edge => {
                const source = graph.nodes.get(edge.source);
                const target = graph.nodes.get(edge.target);
                // the target is the adjacent node and on layer up?
                if (source == node && target.layer == layer - 1) {
                    // then we keep track of this node
                    adjacentNodes.add(target);
                } 
                // the target is the adjacent node and on layer up?
                else if (target == node && source.layer == layer - 1) {
                    // then we keep track of this node
                    adjacentNodes.add(source);
                }
            })
            //calculate average weight based on index
            let total = 0;
            adjacentNodes.forEach(adjacentNode => {
                if (type == "index") {
                    total += adjacentNode.index;
                }
                else {
                    total += adjacentNode.position.x;
                }
            })
            const newWeight = total / adjacentNodes.size;
            //create change object
            changeObjects.push(new ChangeObject("setNodeAttribute",
                {
                    id: node.id,
                    attribute: {
                        name: "weight",
                        value: draft.nodes.get(node.id).attributes.get("weight"),
                    },
                },
                {
                    id: node.id,
                    attribute: {
                        name: "weight",
                        value: newWeight,
                    },
                },
            ));
            draft.nodes.get(node.id).attributes.set("weight", newWeight);
        });
    });
    //update change record
    const newChangeManager = GraphInterface.recordChange(changeManager, changeObjects);
    return [newGraph, newChangeManager];
}

/**
 * Assigns weights to all nodes on layer i based on average of positions or 
 * indexes of adjacent nodes on layer below.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {Integer} layer Layer to operate on
 * @param {String} type Specify "position" or "index"
 * @author Heath Dyer (hadyer)
 */
function setWeightsDown(graph, changeManager, layer, type) {
    isLayered(graph);
    if (type !== "index" && type !== "position") {
        throw new Error('Invalid type. Type must be "index" or "position".');
    }
    const changeObjects = [];
    //immer new graph
    let newGraph = produce(graph, (draft) => {
        // get nodes on layer
        const layerNodes = nodesOnLayer(graph, layer);
        // iterate through each node's edges on that layer
        layerNodes.forEach(node => {
            //keep track of all nodes for weight calculation
            const adjacentNodes = new Set();
            node.edges.forEach(edge => {
                const source = graph.nodes.get(edge.source);
                const target = graph.nodes.get(edge.target);
                // the target is the adjacent node and on layer down?
                if (source == node && target.layer == layer + 1) {
                    // then we keep track of this node
                    adjacentNodes.add(target);
                } 
                // the target is the adjacent node and on layer down?
                else if (target == node && source.layer == layer + 1) {
                    // then we keep track of this node
                    adjacentNodes.add(source);
                }
            })
            //calculate average weight based on index
            let total = 0;
            adjacentNodes.forEach(adjacentNode => {
                if (type == "index") {
                    total += adjacentNode.index;
                }
                else {
                    total += adjacentNode.position.x;
                }
            })
            const newWeight = total / adjacentNodes.size;
            //create change object
            changeObjects.push(new ChangeObject("setNodeAttribute",
                {
                    id: node.id,
                    attribute: {
                        name: "weight",
                        value: draft.nodes.get(node.id).attributes.get("weight"),
                    },
                },
                {
                    id: node.id,
                    attribute: {
                        name: "weight",
                        value: newWeight,
                    },
                },
            ));
            draft.nodes.get(node.id).attributes.set("weight", newWeight);
        });
    });
    //update change record
    const newChangeManager = GraphInterface.recordChange(changeManager, changeObjects);
    return [newGraph, changeManager];
}

/**
 * Assigns weights to all nodes on layer i based on average of positions or 
 * indexes of adjacent nodes on both layers above and below.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {Integer} layer Layer to operate on
 * @param {String} type Specify "position" or "index"
 * @author Heath Dyer (hadyer)
 */
function setWeightsBoth(graph, changeManager, layer, type) {
    isLayered(graph);
    if (type !== "index" && type !== "position") {
        throw new Error('Invalid type. Type must be "index" or "position".');
    }
    const changeObjects = [];
    //immer new graph
    let newGraph = produce(graph, (draft) => {
        // get nodes on layer
        const layerNodes = nodesOnLayer(graph, layer);
        // iterate through each node's edges on that layer
        layerNodes.forEach(node => {
            //keep track of all nodes for weight calculation
            const adjacentNodes = new Set();
            node.edges.forEach(edge => {
                const source = graph.nodes.get(edge.source);
                const target = graph.nodes.get(edge.target);
                // the target is the adjacent node and on layers up and down?
                if (source == node && (target.layer == layer + 1 || target.layer == layer - 1)) {
                    // then we keep track of this node
                    adjacentNodes.add(target);
                } 
                // the target is the adjacent node and on layers up and down?
                else if (target == node && (source.layer == layer + 1 || source.layer == layer - 1)) {
                    // then we keep track of this node
                    adjacentNodes.add(source);
                }
            })
            //calculate average weight based on index
            let total = 0;
            adjacentNodes.forEach(adjacentNode => {
                if (type == "index") {
                    total += adjacentNode.index;
                }
                else {
                    total += adjacentNode.position.x;
                }
            })
            const newWeight = total / adjacentNodes.size;
            //create change object
            changeObjects.push(new ChangeObject("setNodeAttribute",
                {
                    id: node.id,
                    attribute: {
                        name: "weight",
                        value: draft.nodes.get(node.id).attributes.get("weight"),
                    },
                },
                {
                    id: node.id,
                    attribute: {
                        name: "weight",
                        value: newWeight,
                    },
                },
            ));
            draft.nodes.get(node.id).attributes.set("weight", newWeight);
        });
    });
    //update change record
    const newChangeManager = GraphInterface.recordChange(changeManager, changeObjects);
    return [newGraph, changeManager];
}

/**
 * Sorts layer by the weights of its nodes
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to use for storing changes
 * @param {Integer} layer layer to sort
 * @author Heath Dyer (hadyer)
 */
function sortByWeight(graph, changeManager, layer) {
    isLayered(graph);
    let newGraph = graph;
    let newChangeManager = changeManager;
    const layerNodes = nodesOnLayer(graph, layer); // Nodes sorted by index
    for (let j = 0; j < layerNodes.length - 1; j++) {
        let minIndex = j;
        // Find the node with the smallest weight in the remaining array
        for (let k = j + 1; k < layerNodes.length; k++) {
            if (layerNodes[k].attributes.get("weight") < layerNodes[minIndex].attributes.get("weight")) {
                minIndex = k;
            }
        }
        // Swap only if the smallest element is not already in place
        if (minIndex !== j) {
            [newGraph, newChangeManager] = swap(newGraph, newChangeManager, layerNodes[j].id, layerNodes[minIndex].id);
            [layerNodes[j], layerNodes[minIndex]] = [layerNodes[minIndex], layerNodes[j]];
        }
    }
    //update change record
    return [newGraph, changeManager];
}


/**
 * Swaps positions (and indexes) of two nodes x and y. Nodes
 * must be on the same layer to swap.
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager record the swap operation
 * @param {String} x id node to swap
 * @param {String} y  id node to swap
 * @author Heath Dyer (hadyer)
 */
function swap(graph, changeManager, x, y) {
    isLayered(graph);
    const a = graph.nodes.get(x);
    const b = graph.nodes.get(y);
    if (a.layer != b.layer) {
        throw new Error("Nodes must be on the same layer to swap.");
    }
    //get old position and index
    const oldAPosition = {
        x: a.position.x,
        y: a.position.y
    }
    const oldAIndex = a.index;

    const oldBPosition = {
        x: b.position.x,
        y: b.position.y
    }
    const oldBIndex = b.index;
    //get new position and index
    const newAPosition = {
        x: b.position.x,
        y: a.position.y
    }
    const newAIndex = b.index
    const newBPosition = {
        x: a.position.x,
        y: b.position.y
    }
    const newBIndex = a.index;

    // Update the node's position
    let newGraph = produce(graph, (draft) => {
        draft.nodes.get(a.id).position = newAPosition;
        draft.nodes.get(a.id).index = newAIndex;
        draft.nodes.get(b.id).position = newBPosition;
        draft.nodes.get(b.id).index = newBIndex;
    });
    //update change record
    const newChangeManager = GraphInterface.recordChange(changeManager, [
        new ChangeObject("setNodePosition", {
            id: a.id,
            position: oldAPosition,
            index: oldAIndex,
        },
        {
            id: a.id,
            position: newAPosition,
            index: newAIndex,
        }),
        new ChangeObject("setNodePosition", {
            id: b.id,
            position: oldBPosition,
            index: oldBIndex,
        },
        {
            id: b.id,
            position: newBPosition,
            index: newBIndex,
        }),
    ]);
    return [newGraph, newChangeManager];
}

/**
 * Returns an array (list) of all the nodes in the provided layer, sorted by index.
 * @param {Graph} graph Graph on which to operate
 * @param {Number} layerIndex the layer to return
 * @author Michael Richardson (maricha6)
 */
function nodesOnLayer(graph, layerIndex) {
    isLayered(graph);
    return Array.from(graph.nodes.values())
        // Filter the nodes to only those on the same layer
        .filter(n => n.layer == layerIndex)
        // Sort the nodes by X coordinate (ascending order)
        .sort((a, b) => a.index - b.index);
}

/**
 * Runs the evenly-spaced layout on the provided layered graph
 * @param {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager ChangeManager to use for storing changes
 * @author Michael Richardson (maricha6)
 */
function evenlySpacedLayout(graph, changeManager) {

    if (graph.type != "layered") {
        throw new Error(
            `Cannot run evenly-spaced layout because this is not a layered graph`
        );
    }

    // Find the "widest" layer (most nodes) and the total number of layers
    let minIndex = 0;
    let maxIndex = 0;
    let maxLayer = 0;
    for (const node of graph.nodes.values()) {
        maxIndex = Math.max(maxIndex, node.index);
        minIndex = Math.min(minIndex, node.index);
        maxLayer = Math.max(maxLayer, node.layer);
    }

    const widestLayer = maxIndex - minIndex;

    // Iterate over each layer and space the nodes evenly to fit the "widest" layer
    let newGraph = graph;
    let newChangeManager = changeManager;
    newChangeManager = GraphInterface.startRecording(changeManager);

    for (let i = 0; i <= maxLayer; i++) {
        const layer = nodesOnLayer(graph, i);
        const layerWidth = layer.length;
        const stepSize = widestLayer / Math.max((layerWidth - 1), 1);
        for (let j = 0; j < layerWidth; j++) {
            const node = layer[j];

            const oldPosition = node.position;

            const newPosition = {
                x: Math.round(j * stepSize),
                y: node.position.y,
            };

            // Add the change object to the changeManager
            newChangeManager = GraphInterface.recordChange(newChangeManager, [
                new ChangeObject(
                "setNodePosition",
                {
                    id: node.id,
                    position: oldPosition,
                },
                {
                    id: node.id,
                    position: newPosition,
                }
                ),
            ]);
        
            // Update the node's position
            newGraph = produce(newGraph, (draft) => {
                draft.nodes.get(node.id).position = newPosition;
            });


        }
    }

    newChangeManager = GraphInterface.endRecording(newChangeManager);

    return [newGraph, newChangeManager];
}

/**
 * make all node weights = x-coordinates
 * @param  {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager Change manger to record with 
 * @param {Integer} layer Layer to operate on 
 */
function showPositions(graph, changeManager, layer) {
    isLayered(graph);
    const layerNodes = nodesOnLayer(graph, layer);
    const changeObjects = [];
    // update graph
    let newGraph = produce(graph, (draft) => {
        layerNodes.forEach(node => {
            //create change object
            changeObjects.push(new ChangeObject("setNodeAttribute",
                {
                    id: node.id,
                    attribute: {
                        name: "weight",
                        value: draft.nodes.get(node.id).attributes.get("weight"),
                    },
                },
                {
                    id: node.id,
                    attribute: {
                        name: "weight",
                        value: draft.nodes.get(node.id).position.x,
                    },
                },
            ));
            //update attribute
            draft.nodes.get(node.id).attributes.set("weight", draft.nodes.get(node.id).position.x);
        });
    });
    //update change record
    const newChangeManager = GraphInterface.recordChange(changeManager, changeObjects);
    //update change record
    return [newGraph, newChangeManager]; 
}

/**
 * make all node weights = indexes
 * @param  {Graph} graph Graph on which to operate
 * @param {ChangeManager} changeManager Change manger to record with
 * @param {Integer} layer Layer to operate on
 */
function showIndexes(graph, changeManager, layer) {
    isLayered(graph);
    const layerNodes = nodesOnLayer(graph, layer);
    const changeObjects = [];
    // update graph
    let newGraph = produce(graph, (draft) => {
        layerNodes.forEach(node => {
            //create change object
            changeObjects.push(new ChangeObject("setNodeAttribute",
                {
                    id: node.id,
                    attribute: {
                        name: "weight",
                        value: draft.nodes.get(node.id).attributes.get("weight"),
                    },
                },
                {
                    id: node.id,
                    attribute: {
                        name: "weight",
                        value: draft.nodes.get(node.id).index,
                    },
                },
            ));
            //update attribute
            draft.nodes.get(node.id).attributes.set("weight", draft.nodes.get(node.id).index);
        });
    });
    //update change record
    const newChangeManager = GraphInterface.recordChange(changeManager, changeObjects);
    //update change record
    return [newGraph, newChangeManager]; 
}

function numberOfLayers(graph) {
    let maxLayer = 0;
    graph.nodes.forEach(node => {
        if (node.layer > maxLayer) {
            maxLayer = node.layer;
        }
    });
    return maxLayer + 1;
}

const LayeredGraphInterface = {
    isCrossed,
    crossings,
    totalCrossings,
    bottleneckCrossings,
    nonVerticality,
    totalNonVerticality,
    bottleneckVerticality,
    setLayerProperty,
    setChannelProperty,
    setWeightsUp,
    setWeightsDown,
    setWeightsBoth,
    sortByWeight,
    swap,
    nodesOnLayer,
    evenlySpacedLayout,
    showPositions,
    showIndexes,
    numberOfLayers,
};

export default LayeredGraphInterface;