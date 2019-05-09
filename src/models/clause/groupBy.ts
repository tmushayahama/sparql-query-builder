import { Clause } from './../clause';

export class GroupBy extends Clause {
    private _fields: string;

    constructor(fields: string) {
        super();
        this._fields = fields;
    }

    build() {
        return `GROUP BY ${this._fields}`;
    }
}
