/**
 * FileParser is an interface for its graph used to load a graph representation from
 * a file.
 * 
 * @author Henry Morris
 */
export default class FileParser {
    /** Graph for which to parse */
    #graph;

    /**
     * Creates a FileParser with its associated graph object. Takes in the public
     * graph object as well as its private methods, which are necessary for 
     * directly modifying the graph representation.
     * @param {Graph} graph Graph object into which to parse
     * @param {Object} privateMethods Object containing the graph's private methods
     */
    constructor(graph, privateMethods) {
        // Import the graph object with private methods
        this.#graph = graph;
        for (let method in privateMethods) {
            this.#graph[method] = privateMethods[method];
        }
    }

    /** Calling interface to load a file */
    loadGraph(file) {}

    /** Private helpers */
    #parseLine(line) {}
    #parseNode(values) {}
    #parseEdge(values) {}
}