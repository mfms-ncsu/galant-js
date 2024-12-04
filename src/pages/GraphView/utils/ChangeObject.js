import Graph from "utils/Graph";
import GraphObject from "./GraphObject";

/**
 * @fileoverview Class that constructs a Change object
 * @author Ethan Godwin
 */
export default class ChangeObject {
  /**
   * Creates an instance of a change record
   * @param {String} action that occurred. add, remove, update
   * @param {String} type that is being targeted. node or edge
   * @param {String} targetId id of the object being targeted
   * @param {GraphObject} The old state of the node or edge. Undo button moves back to oldState while it is not null. Either a node or edge object
   * @param {GraphObject} The new state of the node or edge. Redo button loads newState while it is not null. Either a node or edge object
  */
  constructor(action, targetType, targetId, oldState, newState) {
    this.action = action;
    this.targetType = targetType;
    this.targetId = targetId;
    this.oldState = oldState;
    this.newState = newState;
  }

  getAction() {
    return this.action;
  }
} 