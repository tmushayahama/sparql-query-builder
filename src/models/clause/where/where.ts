import { Clause } from './../clause';
import { map } from 'lodash';
import { Triple } from './../../triple';
import { Graph } from '../graph';
import { Query } from './../../query';
import { Optional } from '../optional';

export class Where extends Clause {
    private _whereCollection: any[] = [];

    constructor() {
        super();
    }

    addComponent(triple: Triple | Graph | Optional | Query | string) {
        this._whereCollection.push(triple);
    }

    build() {
        let selected = map(this._whereCollection, (item: Clause | string) => {
            if (item instanceof Clause) {
                item.indent(this._indent);
                return item.build();
            }

            return item;
        })

        return `WHERE{\n${[...selected].join(' .\n')}\n}\n`;
    }
}
