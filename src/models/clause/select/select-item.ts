import { Clause } from './../clause';

export class SelectItem extends Clause {
    private _prefix: string

    constructor(prefix: string) {
        super();
        this._prefix = ``;
    }

    build() {
        return this._prefix;
    }
}
