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
  /** Map of nodes in the graph (NodeId -> Node) */
  nodes;
  /**
  * Sequence numbers are used to determine the order of appearance of nodes
  * when they are displayed, particularly important for rooted trees
  * when elkjs mode is used.
  * They are modified when the left to right order of children of a node
  * needs to change during algorithm execution
  * @todo could alse be used to order adjacency lists
  */
  sequenceNumbers;
  /** the current sequence number, i.e., the next one to be assigned
   *  incremented each time one is assigned
   */
  currentSequenceNumber;
  /** Node render size */
  nodeSize = 35;
  /** Object of x and y scales */
  scalar = {x: 50, y: 50};
  /** Show weights and labels flags */
  showEdgeLabels = true;
  showEdgeWeights = true;
  showNodeLabels = true;
  showNodeWeights = true;
  weightsInside = false;
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
    this.weightsInside = false
  }
}
