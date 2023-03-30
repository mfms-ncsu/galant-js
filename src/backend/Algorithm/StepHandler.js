
/**
 * Handles applying and undoing steps to a graph that consist of multiple rules.
 * 
 * @author alschell
 */
export default class StepHandler {
    /**
     * @property {Function([Patch])} - Callback function that updates the graph with a list of patches.
     * Using a callback allows the updating function to also perform additional capabilities, such as updating React or Jest.
     */
    #updateGraph;
    
    /**
     * @property {Function()} - A callback function that is called when the StepHandler needs more rules.
     * This can resume the algorithm's execution to find what the next step is.
     */
    onNeedsRules;

    /** @property {List(List(Rule))} - A list of Steps, which each consist of a list of rules. */
    #steps = [];

    /** @property {number} - The number of Steps that have been executed on the display state. */
    #displayState = 0;

    /**
     * @property {List(Rule)} - The Step that is currently being built.
     * This is null if no step is currently executing, or a list that takes Rules as they are reported.
    */
    #currentStep = null;

    constructor(updateGraph, onNeedsRules) {
        this.#updateGraph = updateGraph;
        this.onNeedsRules = onNeedsRules;
    }

    /**
     * Finds whether the algorithm can step forward.
     * Note that the algorithm can step forward when no steps remain by notifying the thread that it needs rules.
     * 
     * @returns {bool}
     */
    canStepForward() {
        return this.#displayState != this.#steps.length || this.#currentStep == null;
    }

    /**
     * Finds whether the algorithm can step back.
     * 
     * @returns {bool}
     */
    canStepBack() {
        return this.#displayState != 0;
    }

    /**
     * Finds the status of the StepHandler, in terms of what step it is on and what actions can be taken.
     * 
     * @returns {number: bool, algorithmState: number, canStepForward: bool, canStepBack: bool}
     */
    getStatus() {
        return {
            displayState: this.#displayState,
            algorithmState: this.#steps.length,
            canStepForward: this.canStepForward(),
            canStepBack: this.canStepBack(),
        };
    }

    /**
     * Executes the next step, or if there is no next step, requests new rules via the callback function.
     * @returns true if we needed and generated one, false if we didn't need to restart the thread bc we already had a rule queued.
     */
    stepForward() {
        if (!this.canStepForward()) {
            throw new Error("Can't step forward");
        }

        // if we are out of rules in the queue, go make a new one.
        if (this.#displayState == this.#steps.length) {
            this.#currentStep = [];
            if (this.onNeedsRules != null) {
                this.onNeedsRules();
            }
            return true;
        }

        // if we get here, we already have enough rules.
        let step = this.#steps[this.#displayState];
        this.#displayState++;

        let patches = step.flatMap((rule) => rule.apply)
        this.#updateGraph(patches);
        return false;
    }

    /**
     * Reverts the last executed step.
     */
    stepBack() {
        if (!this.canStepBack()) {
            throw new Error("Can't step back");
        }

        this.#displayState--;
        let step = this.#steps[this.#displayState];

        let patches = step.flatMap((rule) => rule.revert).reverse()
        this.#updateGraph(patches);
    }
    
    /**
     * Reverts all executed steps.
     */
    revertAll() {
        let patches = this.#steps.reverse().flatMap((step) => step.flatMap((rule) => rule.revert).reverse())
        this.#updateGraph(patches);

        let displayState = 0;
    }

    /**
     * Adds a rule to the currently built step.
     * This function can be called from a separate thread safely.
     * 
     * @param {Rule} rule - The rule to add.
     */
    addRule(rule) {
        if (this.#currentStep == null) {
            this.#currentStep = [];
        }
        this.#currentStep.push(rule);
    }

    /**
     * Marks the currently built step as complete, adding it to the list of steps, and executing it if possible.
     * This function can be called from a separate thread safely.
     */
    completeStep() {
        this.#steps.push(this.#currentStep);

        if (this.#displayState + 1 == this.#steps.length) {
            this.stepForward();
        }

        this.#currentStep = null;
    }

    /**
     * Adds a single rule and immediately adds to the list of steps.
     * This is useful as a shorthand to adding a rule and then completing a step when steps only consist of one rule.
     * This function can be called from a separate thread safely.
     * 
     * @param {Rule} The rule to add as a step 
     */
    ruleStep(rule) {
        this.addRule(rule);
        this.completeStep();
    }
}