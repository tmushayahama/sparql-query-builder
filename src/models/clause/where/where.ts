import { Clause } from './../clause';
import { map } from 'lodash';
import { Triple } from './../../triple';
import { Graph } from '../graph';
import { Query } from './../../query';
import { Optional } from '../optional';

export class Where extends Clause {

    constructor() {
        super();
    }

    addComponent(triple: Triple | Graph | Optional | Query | string) {
        this._components.push(triple);
    }

    build() {
        let selected = map(this._components, (item: Clause | string) => {
            if (item instanceof Clause) {
                return item.build();
            }

            return item;
        })

        return `WHERE{\n${[...selected].join(' .\n')}\n}\n`;
    }
}
