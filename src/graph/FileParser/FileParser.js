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

    /**
     * Records the header comment
     * @param {String[]} lines of the input file
     */
    #recordHeaderComment(lines) {

        // Regex to match comments
        const commentRegex = /^([gc].*)?$/;
        /*
            commentRegex documentation:

            A comment is either:
                - the letter g or c, followed by any amount of any characters
                - An empty line
        */
        for (let i = 0; i < lines.length; i++) {
            
            let line = lines[i];

            // Continue until a non-comment line is discovered
            if (!line.match(commentRegex)) {
                return;
            }
            this.#graph.addComment(line);
        }
    }

    /**
     * Loads the given file text into the graph.
     * @param {String} file File text
     */
    loadGraph(file) {
        // Clear the graph before adding in nodes
        this.#graph.clear();

        // Split the file on the new line character and parse each line
        const lines = file.split("\n");
        
        // Record the header comment, so that it can be saved with the file
        this.#recordHeaderComment(lines);
        
        lines.forEach(line => { this.#parseLine(line) });

        // Generate a scale for the graph based on the node positions
        this.#graph.scale();

        // Update cytoscape to show the newly loaded graph
        if (typeof window !== "undefined" && window.self === window.top) {
            window.updateCytoscape();
        }
    }

    /**
     * Parses the line to determine whether it is an edge or node line.
     * @param {String} line Line string
     */
    #parseLine(line) {
        // Trim the line string to remove leading/trailing whitespace and split along spacez
        line = line.trim();
        const values = line.split(" ");

        // Regex to match comments
        const commentRegex = /^([gc].*)?$/;
        /*
            commentRegex documentation:

            A comment is either:
                - the letter g or c, followed by any amount of any characters
                - An empty line

        */

        // Regexes to match simple node and edge lines
        const nodeRegex = /^n \S+ -?\d+.?\d* -?\d+.?\d*( -?\d+)?( [^ \n\t:]+:[^ \n\t:]+)*$/;
        /*
            nodeRegex documentation:
            
            A line representing a node must have each of the following, separated by a space:
                - The letter 'n' as the first letter
                - An id (any amount of non-whitespace characters)
                - An integer x coordinate
                - An integer y coordinate
                - Optionally, an integer weight
                - Any amount of attributes. Attributes are specified as follows:
                    any amount of non-whitespace, non-colon characters, followed by a colon (no space),
                    followed by any amount of non-whitespace, non-colon characters.
        */
        const edgeRegex = /^e \S+ \S+( -?\d+)?( [^ \n\t:]+:[^ \n\t:]+)*$/;
        /*
            edgeRegex documentation:
            
            A line representing an edge must have each of the following, separated by a space:
                - The letter 'e' as the first letter
                - A source node id (any amount of non-whitespace characters)
                - A target node id (any amount of non-whitespace characters)
                - Optionally, an integer weight
                - Any amount of attributes. Attributes are specified as follows:
                    any amount of non-whitespace, non-colon characters, followed by a colon (no space),
                    followed by any amount of non-whitespace, non-colon characters.
        */
        // Check which regex matches and send the values to be parsed as either a node or edge
        if (line.match(commentRegex)) {
            // Ignore comments
            return;
        }
        else if (line.match(nodeRegex)) {
            this.#parseNode(values);
        } else if (line.match(edgeRegex)) {
            this.#parseEdge(values);
        } else {

            // If the line was not a node or an edge, throw an exception
            throw new Error("input line from file: \"" + line + "\" is not a valid node or edge.");
        }
    }

    /**
     * Parses a node line and creates a new node object.
     * @param {Array} values Values to parse
     */
    #parseNode(values) {
        // Get the necessary values to create a node
        let id = values[1];
        let x = parseFloat(values[2]), y = parseFloat(values[3]);
        let attributes = {};
        
        // Get the weight, but only if it is a numeric value
        if (this.#isNumeric(values[4])) {
            attributes["weight"] = parseFloat(values[4]);
        }

        // Loop over the rest of the values
        for (let i = (attributes["weight"] === undefined) ? 4 : 5; i < values.length; i++) {
            // Set the attribute
            let pair = values[i].trim().split(":");
            if (pair.length === 2) {
                attributes[pair[0]] = pair[1];
            }
        }

        // Since the file contains node ids and attributes, pass them in as the last arguments
        this.#graph.addNode(x, y, id, attributes);
    }

    /**
     * Parses an edge line and creates a new edge object.
     * @param {Array} values Values to parse
     */
    #parseEdge(values) {
        // Get the necessary values to create an edge
        let source = values[1], target = values[2];
        let attributes = {};
        
        // Get the weight, but only if it is a numeric value
        if (this.#isNumeric(values[3])) {
            attributes["weight"] = parseFloat(values[3]);
        }

        // Loop over the rest of the values
        for (let i = (attributes["weight"] === undefined) ? 3 : 4; i < values.length; i++) {
            // Set the attribute
            let pair = values[i].trim().split(":");
            if (pair.length === 2) {
                attributes[pair[0]] = pair[1];
            }
        }

        // Add the edge
        this.#graph.addEdge(source, target, attributes);
    }

    /**
     * Checks if a string can be parsed into a number.
     * @author see: https://stackoverflow.com/a/175787
     * @param {String} str String to check
     * @returns True if the string is numeric, false otherwise
     */
    #isNumeric(str) {
        if (typeof str !== "string") return false;
        return !Number.isNaN(Number(str)) && !Number.isNaN(parseFloat(str));
    }
}
