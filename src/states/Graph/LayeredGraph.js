import Graph from "./Graph";

export default class LayeredGraph extends Graph {
    /** Graph layers. The index of the array is the layer */
    layers;

    constructor(name) {
        super(name, "layered");
        this.layers = [];
    }
}