import {enablePatches, freeze, produce, applyPatches} from "immer";

enablePatches()

export default class Predicates {

    #state;

    constructor(state) {
        freeze(state, true)
        this.#state = state;
    }

    get() {
        return this.#state;
    }

    update(update) {
        let rule;
        this.#state = produce(this.#state, update, (apply, revert) => {
            rule = {apply: apply, revert: revert};
        });
        return rule;
    }

    applyPatches(patches) {
        this.#state = applyPatches(this.#state, patches);
    }
}