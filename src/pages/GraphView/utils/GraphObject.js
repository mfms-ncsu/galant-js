/**
 * @author Ethan Godwin
 */
export default class GraphObject {
  /**
   * base constructor for nodes and edges
   * @param {String} id the id of the node or edge
   * @param {String} color the color of the node or edge
   * @param {Number} [weight=undefined] optional weight parameter
   * @param {Boolean} [invisibleLabel=false] Optional parameter for invisible labels, defaults to false
   * @param {Boolean} [invisible=false] Optional parameter for invisibility, defaults to false
   * @param {Boolean} [invisibleWeight=false] Optional parameter for invisible weight, defaults to false
   * @param {Boolean} [highlighted=false] Optional highlighting parameter, defaults to false
   */
  constructor(cyObj = undefined, id = undefined, color = undefined, weight = undefined, invisibleLabel = false, invisibleWeight = false, invisible = false, highlighted = false) {
    if(this.constructor === GraphObject) {
      throw new Error("Abstract Class GraphObject can not be instantiated.");
    }
    if(cyObj !== undefined) {
      this.id = cyObj.id;
      this.color = cyObj.color;
      this.weight = cyObj.weight;
      this.invisibleLabel = invisibleLabel;
      this.invisibleWeight = cyObj.invisibleWeight;
      this.invisible = cyObj.invisible;
      this.highlighted = cyObj.highlighted;
    } else {
      this.id = id;
      this.color = color;
      this.weight = weight;
  
      //Boolean
      this.invisibleLabel = invisibleLabel;
      this.invisibleWeight = invisibleWeight;
      this.invisible = invisible;
      this.highlighted = highlighted;
    }
  }

  setColor(strColor) {
    this.color = strColor;
  }

  uncolor() {
    this.color = undefined
  }

  highlight() {
    this.highlighted = true;
  }
  unhighlight() {
    this.highlighted = false;
  }

  setWeight(weight) {
    if (isNaN(weight)) {
      throw new Error("Weight must be a number");
    }
    this.weight = weight;
  }

  clearWeight() {
    this.weight = undefined;
  }

  hasWeight() {
    return this.weight !== undefined;
  }
}