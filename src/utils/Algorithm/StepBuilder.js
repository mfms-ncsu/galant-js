import { applyPatches } from "immer";
import { AlgorithmStepSnapshot } from "./AlgorithmStepSnapshot";
import ChangeRecord from "pages/GraphView/utils/ChangeRecord";


/**
 * StepBuilder Class
 * 
 * A step can consist of several rules / commands.
 * This allows you to add rules, and then build a new step from the rules and a previous step template. 
 * @author Julian Madrigal
 */
export class StepBuilder {
    
    /**
     * Constructor for StepBuilder
     * @constructor
     * @param {AlgorithmStepSnapshot} prevStep The previous step to build with
     */
    constructor(prevStep) {
        this.changes = [];
        this.prevStep = prevStep;
    }

    /**
     * Adds a rule to the StepBuilder
     * 
     * @param {Object} rule The rule to add
     */
    addRule(change) {
        this.changes.push(change);
    }

    /**
     * Builds a new step from the added rules and the previous step template
     * 
     * @returns {AlgorithmStepSnapshot} The newly built step
     */
    build() {
        return {graph: ChangeRecord.getInstance('algorithm').applyChangeToGraph(this.changes.flat(), this.prevStep.graph)};
    }
}