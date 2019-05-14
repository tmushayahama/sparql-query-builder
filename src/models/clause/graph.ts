import { Clause } from './../clause';
import { map } from 'lodash';
import { Triple } from '../triple';
import { Optional } from './optional';

export class Graph extends Clause {
    private _iri: string;

    constructor(iri: string) {
        super();
        this._iri = iri;
    }

    addComponent(item: string | Triple | Optional) {
        this._components.push(item);
    }

    build() {
        let selected = map(this._components, (item) => {
            return item
        })
        return `GRAPH ${this._iri} {\n${[...selected].join('.\n')}\n}\n`;
    }
}

