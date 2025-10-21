import Tree from "states/Graph/Tree";
import GraphInterface from "./GraphInterface";
import ChangeManager from "states/ChangeManager/ChangeManager";
import ChangeObject from "states/ChangeManager/ChangeObject";

/**
 * Helper function to handle what to do when a graph
 * is not a tree.
 * @param {Graph} graph Graph on which to operate
 * @author Bryan Fang
 */
function isTree(graph) {
  if (!(graph.type === "tree")) {
    throw new Error("Function can only be performed on trees.");
  }
}

function getParents(graph, target) {
  isTree(graph);

  // Throw an error if the node doesn't exist
  if (!graph.nodes.has(target)) {
    throw new Error(
      "Cannot get parents of node " +
        target +
        " because no node with this id exists in the graph"
    );
  }

  let parents = [];

  // Check if the node exists
  graph.nodes.get(target).edges.forEach((edge) => {
    if (edge.target === target) {
      parents.push(edge.source);
    }
  });

  return parents;
}

function getChildren(graph, source) {
  isTree(graph);

  let children = [];

  // Check if the node exists
  if (graph.nodes.has(source)) {
    graph.nodes.get(source).edges.forEach((edge) => {
      if (edge.source === source) {
        children.push(edge.target);
      }
    });

    return children;
  } else {
    // If the node doesn't exist, throw an error
    throw new Error(
      "Cannot get the children of node " +
        source +
        " because no such node exists in the graph"
    );
  }
}

function getRoots(graph) {
  isTree(graph);

  let roots = [];

  for (const currentNode of graph.nodes) {
    if (currentNode.getParents().length === 0) {
      roots.push(currentNode);
    }
  }

  return roots;
}

/**
 * Sorts the nodes of a tree by weight in ascending order.
 * MAY NEED TO BE MODIFIED TO USE A DRAFT/IMMER ARCHETYPE
 * @param {Graph} graph Graph to sort
 */
function sortByWeight(graph) {
  // Turns the nodes map into an array, sorts it, then turns it back into a map
  graph.nodes = new Map(
    [...graph.nodes.entries()].sort((a, b) => a[1].attributes.get("weight") - b[1].attributes.get("weight")
  ));
}
