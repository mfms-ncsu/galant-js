import GraphObject from "./GraphObject";
/**
 * The file used to handle edge objects
 * 
 * @author Andrew Lanning
 * 
 */
export default class EdgeObject extends GraphObject {

  // Constructs an edge object with an id, source and target as well as a boolean of whether or not it should be invisible
  constructor(cyEdge = undefined, id = undefined, source = undefined, target = undefined, shouldBeInvisible = undefined) {
    if(cyEdge !== undefined) {
      super(cyEdge);
      this.source = cyEdge.source;
      this.target = cyEdge.target;
      this.shouldBeInvisible = cyEdge.shouldBeInvisible || false;
    } else {
      super(undefined, id);
      this.source = source;
      this.target = target;
      this.shouldBeInvisible = shouldBeInvisible;  
    }
  }

  // Setter for the edge's id
  setId(source, target) {
    this.id = `${source} ${target}`;
  }

  // Setter for the edge's source
  setSource(source) {
    this.source = source;
  }

  // Setter for the edge's target
  setTarget(target) {
    this.target = target;
  }


}