import { Clause } from './../clause';

export type Direction = 'DESC'
    | 'desc'
    | 'ASC'
    | 'asc'
    | null
    | undefined;

export class OrderBy extends Clause {
    private _fields: string
    private _direction: Direction = 'desc';

    constructor(fields: string, direction?: Direction) {
        super();
        this._fields = fields;
        if (direction) {
            this._direction = direction;
        }
    }

    build() {
        return `ORDER BY ${this._direction} (${this._fields})`;
    }
}

export function orderBy(fields: string, direction?: Direction) {
    return new OrderBy(fields, direction);
}
