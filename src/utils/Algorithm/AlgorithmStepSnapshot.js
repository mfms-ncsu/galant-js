
/**
 * AlgorithmStepSnapshot Class
 * 
 * This is a snapshot of an algorithm step. It is immutable.
 * @note For now, it only contains a GraphSnapshot. In the future, it may contain more data related to the algorithm step, but not necesarily the graph.
 * For example, perhaps TTS text that should be played at the step.
 * 
 * @author Julian Madrigal
 */
export class AlgorithmStepSnapshot {
    /**
     * Constructor for AlgorithmStepSnapshot
     * @constructor
     * @param {Graph} graph The graph state at this algorithm step
     */
    constructor(graph) {
        this.graph = graph;
    }
}