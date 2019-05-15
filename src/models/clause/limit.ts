import { Clause } from './../clause';

export class Limit extends Clause {
    private _limit: number;

    constructor(limit: number) {
        super();
        this._limit = limit;
    }

    build() {
        return `LIMIT ${this._limit}`;
    }
}

export function limit(limit: number) {
    return new Limit(limit);
}