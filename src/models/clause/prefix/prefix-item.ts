import { Clause } from './../clause';
import { PREFIX } from './prefix';

export class PrefixItem extends Clause {
    private _prefix: string

    constructor(prefix: string) {
        super();
        this._prefix = `PREFIX ${prefix}: ${PREFIX[prefix]}`;
    }

    build() {
        return this._prefix;
    }
}
