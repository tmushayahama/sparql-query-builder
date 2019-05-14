import { Clause } from './../clause';

export class Prefix extends Clause {
    private _prefix: string

    constructor(prefix: string, iri: string) {
        super();
        this._prefix = `PREFIX ${prefix}: ${iri}`;
    }

    build() {
        return this._prefix;
    }
}

export function prefix(prefix: string, iri: string) {
    return new Prefix(prefix, iri);
}
