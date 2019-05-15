import { Clause } from './../clause';

export class Offset extends Clause {
    private _offset: number;

    constructor(offset: number) {
        super();
        this._offset = offset;
    }

    build() {
        return `LIMIT ${this._offset}`;
    }
}

export function offset(offset: number) {
    return new Offset(offset);
}