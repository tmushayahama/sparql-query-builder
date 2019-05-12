import { Clause } from './../clause';
import { map } from 'lodash';

export class Optional extends Clause {
    private _optionalCollection: any[] = [];

    constructor(statement?: string) {
        super();
        if (statement) {
            this._optionalCollection.push(statement);
        }
    }

    addComponent(triple: string) {
        this._optionalCollection.push(triple);
    }

    build() {
        let selected = map(this._optionalCollection, (item: string) => {
            return item;
        })

        return `OPTIONAL {\n${this._indent}${[...selected].join(' .\n')}\n}`;
    }
}
