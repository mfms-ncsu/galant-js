
class Rule {
    constructor(path, old_value, new_value) {
        if (path.length == 0) {
            throw new Error("path cannot be empty");
        }
        this.path = path;
        this.old_value = old_value;
        this.new_value = new_value;
    }

    apply(predicate) {
        for (let key of this.path.slice(0, -1)) {
            predicate = predicate[key];
        }
        let key = this.path.at(-1);
        predicate[key] = this.new_value;
    }

    undo(predicate) {
        for (let key of this.path.slice(0, -1)) {
            predicate = predicate[key];
        }
        let key = this.path.at(-1);
        predicate[key] = this.old_value;
    }
}