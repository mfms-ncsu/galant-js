import GraphObject from "./GraphObject";
/**
 * @author Ethan Godwin
 */
export default class NodeObject extends GraphObject {
  
  /**
   * 
   * 
   * @param {String} id the node id
   * @param {Number} x the x position, defaults to 0
   * @param {Number} y the y position, defaults to 0
   * @param {String} [shape=undefined] the shape of the node
   * @param {Number} [borderWidth=undefined] the border width of the node
   * @param {Boolean} marked whether or not the node is marked, defaults to false
   */
  constructor(cyNode = undefined, id = undefined, x = undefined, y = undefined, marked = false, shape = undefined, borderWidth = undefined, size = undefined, backgroundOpacity = undefined) {
    if(cyNode !== undefined) {
      super(cyNode);
      this.x = cyNode.x;
      this.y = cyNode.y;
      this.marked = cyNode.marked || false;
      this.shape = cyNode.shape;
      this.borderWidth = cyNode.borderWidth;
      this.size = cyNode.size;
      this.backgroundOpacity = cyNode.backgroundOpacity; 

    } else {
      super(undefined, id);
      this.x = x;
      this.y = y; 
      this.shape = shape;
      this.borderWidth = borderWidth;
      this.size = size;
      this.backgroundOpacity = backgroundOpacity; 
      //Boolean
      this.marked = marked;
    }
  }

  /**
   * 
   * @param {{x: Number, y: Number}} position 
   */
  setPosition(position) {
    this.x = position.x;
    this.y = position.y;
  }

  setBackgroundOpacity(opacity) {
    if (isNaN(opacity) && opacity !== undefined) {
      throw new Error("Border Opacity must be a number");
    }
    this.backgroundOpacity = opacity;
  }

  clearBackgroundOpacity() {
    this.backgroundOpacity = undefined;
  }

  hasBackgroundOpacity() {
    return this.backgroundOpacity !== undefined;
  }

  //Size functions
  setSize(size) {
    if(isNaN(size) && size !== undefined) {
      throw new Error("Size must be a number");
    }
    this.size = size;
  }
  
  clearSize() {
    this.size = undefined;
  }

  hasSize() {
    return this.size !== undefined;
  }

  //Border width functions
  setBorderWidth(width) {
    if(isNaN(width) && width !== undefined) {
      throw new Error("Border Width must be a number");
    }
    this.borderWidth = width;
  }

  hasBorderWidth() {
    return this.borderWidth !== undefined
  }

  clearBorderWidth() {
    this.borderWidth = undefined;
  }

  setShape(shape) {
    this.shape = shape
  }

  getShape() {
    return this.shape;
  }

  clearShape() {
    this.shape = undefined;
  }

  hasShape() {
    return this.shape !== undefined;
  }

  setMarked(isMarked) {
    this.marked = isMarked;
  }
  getMarked() {
    return this.marked;
  }
}