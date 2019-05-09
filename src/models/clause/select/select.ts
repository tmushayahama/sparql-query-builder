import { Clause } from './../clause';
import { map } from 'lodash';
import { SelectItem } from './select-item';

export class Select extends Clause {
    private _selectItems: SelectItem[] = [];

    constructor() {
        super();
    }

    addSelectItem(selectItem: SelectItem) {
        this._selectItems.push(selectItem);
    }

    build() {
        let selected = map(this._selectItems, (item) => {
            return item.build();
        })
        return `${[...selected].join('\n')}`;
    }
}
