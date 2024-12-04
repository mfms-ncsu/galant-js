import ChangeObject from "./ChangeObject";
import Graph from "utils/Graph";

/**
 * @fileoverview Class that constructs a Change object
 * @author Andrew Lanning
 */
export default class ChangeRecord {
  static instances = {};
  /**
   * Creates an instance of a change record
   * @param {Number} index - index of action that occurred. add, remove, update
   * @param {ChangeObject[]} list - the list of change objects
   */
  constructor(type = 'default', list = [], index = 0, onUpdate) {
    if (ChangeRecord.instances[type]) {
      return ChangeRecord.instances[type];
    }
    this.list = list;
    this.index = index;
    this.onUpdate = onUpdate;

    ChangeRecord.instances[type] = this;
    return this;
  }

  /**
   * 
   * @returns {ChangeRecord} the change record instance
   */
  static getInstance(type = 'default') {
    if (!ChangeRecord.instances[type]) {
      throw new Error(`The Change Record instance of type ${type} has not been created yet.`);
    }
    return ChangeRecord.instances[type];
  }

  /**
   * 
   * @param {ChangeObject[]} changes 
   */
  addChangeObject(changes) {
    //If not at end of list, any change that occurs should overwrite following changes
    this.list.splice(this.index);
    this.list.push(changes);
    this.index++;
    this.onUpdate(this.index);
  }

  undo() {
    if (this.index > 0) {
      this.onUpdate(this.index);
      this.index--;
      return true;
    }
    return false
  }

  redo() {
    if (this.index < this.list.length) {
      this.onUpdate(this.index);
      this.index++;
      return true;
    }
    return false;
  }

  getCurrent() {
    if (this.index < 0) {
      return null;
    }
    else {
      return this.list[this.index];
    }
  }

  clear() {
    this.index = 0;
    this.list.length = 0;
    this.onUpdate(this.index);
  }

  /**
   * 
   * @param {ChangeObject[]} changes
   * @param {Graph} graph the graph to apply a change to 
   */
  applyChangeToGraph(changes, graph) {
    if (!changes) return
    if (!(graph instanceof Graph)) throw new Error("Invalid graph object");
    changes.forEach((change) => {
      if (!change) return graph;
      switch (change.action) {
        case "add":
          if (change.targetType === "node") {
            graph.nodes.push(change.newState);
          }
          break;
        case "remove":
          if (change.targetType === "node") {
            graph.nodes = graph.nodes.filter((node) => node.id !== change.targetId);
            graph.edges = graph.edges.filter((edge) => !change.oldState.edges.includes(edge));
          }
          break;
        case "update":
          if (change.targetType === "node") {
            graph.nodes = graph.nodes.map(node => {
              return node.id === change.targetId ? node = change.newState : node;
            });
          } else if (change.targetType === "edge") {
            graph.edges = graph.edges.map(edge => {
              return edge.id === change.targetId ? edge = change.newState : edge;
            });
          }
          break;
        default:
          return graph;
      }
    });
    let newGraph = new Graph(
      graph.nodes,
      graph.edges,
      graph.directed,
      graph.message,
      graph.name,
      graph.scalar,
    );
    return newGraph
  }

  /**
   * 
   * @param {ChangeObject} change
   * @param {Graph} graph the graph to apply a change to 
   */
  undoChange(changes, graph) {
    if (changes) {
      changes.forEach((change) => {
        switch (change.action) {
          case "add":
            if (change.targetType === "node") {
              graph.nodes = graph.nodes.filter(node => node.id !== change.newState.id);
            }
            break;
          case "remove":
            if (change.targetType === 'node') {
              graph.nodes.push(change.oldState.node);
              graph.edges = graph.edges.concat(change.oldState.edges);
            }
            break;
          case "update":
            if (change.targetType === 'node') {
              graph.nodes = graph.nodes.map(node =>
                node.id === change.targetId ? node = change.oldState : node,
              );
            }
            break;
        }
      })
      return new Graph(
        graph.nodes,
        graph.edges,
        graph.directed,
        graph.message,
        graph.name,
        graph.scalar,
      )
    }
    return graph;
  }

  setOnUpdateCallback(callback) {
    this.onUpdate = callback;
  }
} 