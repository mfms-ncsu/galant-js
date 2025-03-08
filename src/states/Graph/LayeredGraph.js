import Graph from "./Graph";

export default class LayeredGraph extends Graph {
    /** Graph layers */
    layers;

    constructor(name) {
        super(name, "layered");
        this.layers = [];
    }
}