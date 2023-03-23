
module.exports = {
    getNodes: (graph) => {
        // get the list of node ids
        return Object.keys(graph["node"])
    },
    colorNode: (graph, node_id, color) => {
        // changes the color of a node, sends that message out to the step handler
        // returns a new, updated copy of the graph
        graph["node"][node_id]["color"] = color;
        return graph;
    }

}
