
module.exports = {
    getNodes: (graph) => {
        let nodes = [];
        console.log("getNodes has been called");
        for (const key of Object.entries(graph)) {
            nodes.push(graph.key);
        }
        return nodes;
    },
    colorNode: (color, node) => {
        node.color = color;
        return node;

    },
    print: () => {
        console.log("print");
    },
    dispplay: () => {

    },
    consoleLog: () => {
        console.log("consoleLog");
    }
}
