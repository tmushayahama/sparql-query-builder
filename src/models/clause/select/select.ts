import { Clause } from './../clause';
import { map } from 'lodash';

export class Select extends Clause {

    constructor() {
        super();
    }

    addComponent(item: string) {
        this._components.push(item);
    }

    build() {
        let selected = map(this._components, (item) => {
            return item
        })
        return `SELECT ${[...selected].join('\n\t')}\n`;
    }
}
