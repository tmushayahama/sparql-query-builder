import { Clause } from './../clause';
import { map } from 'lodash';
import { Triple } from './../../triple';

export class Where extends Clause {
    private _whereCollection: any[] = [];

    constructor() {
        super();
    }

    addWhere(triple: Triple | string) {
        this._whereCollection.push(triple);
    }

    build() {
        let selected = map(this._whereCollection, (item: Clause | string) => {
            if (item instanceof Triple) {
                return item.build();
            }
            return item;
        })

        return `WHERE {\n\t${[...selected].join(' .\n\t')}\n}\n`;
    }
}
