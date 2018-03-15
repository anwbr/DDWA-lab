export let ScopeIterator = {
    scopes: [],
    [Symbol.iterator]() {
        return this;
    },
    next() {
        if (this.current === undefined) {
            this.current = 0
        } else {
            this.current++;
        }
        if (this.current < this.scopes.length) {
            return {
                done: false,
                value: this.scopes[this.current]
            };
        } else {
            delete this.current;
            return {
                done: true
            };
        }
    }
};