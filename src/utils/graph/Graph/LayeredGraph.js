import Graph from "./Graph";

export default class LayeredGraph extends Graph {
    /** Graph layers */
    layers;

    constructor() {
        super("layered");
        this.layers = [];
    }
}