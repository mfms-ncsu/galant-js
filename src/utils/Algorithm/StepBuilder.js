import { applyPatches } from "immer";
import { AlgorithmStepSnapshot } from "./AlgorithmStepSnapshot";


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
        this.rules = [];
        this.prevStep = prevStep;
    }

    /**
     * Adds a rule to the StepBuilder
     * 
     * @param {Object} rule The rule to add
     */
    addRule(rule) {
        this.rules.push(rule);
    }

    /**
     * Builds a new step from the added rules and the previous step template
     * 
     * @returns {AlgorithmStepSnapshot} The newly built step
     */
    build() {
        let patches = this.rules.flatMap((rule) => rule.apply);
        const newStep = new AlgorithmStepSnapshot(applyPatches(this.prevStep.graph, patches));
        return newStep;
    }
}