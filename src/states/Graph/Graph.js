import { immerable } from "immer";

/**
 * Graph stores the representation of the current graph.
 *
 * @author Henry Morris
 */
export default class Graph {
  /** Enable immer */
  [immerable] = true;
  /** Directed graph flag */
  isDirected = false;
  /** Name of the graph */
  name;
  /** Map of nodes in the graph (NodeId -> Node)*/
  nodes;
  /** Node render size */
  nodeSize = 35;
  /** Object of x and y scales */
  scalar = {x: 50, y: 50};
  /** Show weights and labels flags */
  showEdgeLabels = true;
  showEdgeWeights = true;
  showNodeLabels = true;
  showNodeWeights = true;
  /** Graph type */
  type;
  /** Store graph comments */
  comments;

  /**
   * Creates a new graph with nodes.
   */
  constructor(name, type) {
    this.type = type;
    this.name = name;
    this.nodes = new Map();
    this.comments = new Set();
  }
}
