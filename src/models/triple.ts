import { Clause } from "./clause";

export class Triple extends Clause {
    private _subject: any;
    private _predicate: any;
    private _object: any;

    constructor(subject: any, predicate: any, object?: any) {
        super();
        this._subject = subject;
        this._predicate = predicate;
        this._object = object ? object : '';
    }

    build() {
        return `${this._subject} ${this._predicate} ${this._object}`
    }

}

export function triple(subject: any, predicate: any, object?: any) {
    return new Triple(subject, predicate, object);
}
