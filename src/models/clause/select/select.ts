import { Clause } from './../clause';
import { map } from 'lodash';

export class Select extends Clause {
    private _selectCollection: any = [];

    constructor() {
        super();
    }

    addSelect(item: string) {
        this._selectCollection.push(item);
    }

    build() {
        let selected = map(this._selectCollection, (item) => {
            return item
        })
        return `SELECT ${[...selected].join('\n\t')}\n`;
    }
}
