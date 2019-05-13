import { Clause } from './../clause';
import { map } from 'lodash';
import { Triple } from '../triple';



export class Optional extends Clause {
    private _optionalCollection: any[] = [];

    constructor(...items: (string | Triple)[]) {
        super();
        items.map((item) => {
            this._optionalCollection.push(item);
        });
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

export function optional(...items: (string | Triple)[]) {
    return new Optional(...items);
}