import { Clause } from './../clause';
import { map } from 'lodash';
import { Triple } from '../triple';
import { Optional } from './optional';

export class Graph extends Clause {
    private _iri: string;
    private _graphCollection: any = [];

    constructor(iri: string) {
        super();
        this._iri = iri;
    }

    addComponent(item: string | Triple | Optional) {
        this._graphCollection.push(item);
    }

    build() {
        let selected = map(this._graphCollection, (item) => {
            return item
        })
        return `GRAPH ${this._iri} {\n${[...selected].join('.\n')}\n}\n`;
    }
}
