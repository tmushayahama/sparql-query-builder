import { Clause } from "./clause";

export class Triple implements Clause {
    private _subject: any;
    private _predicate: any;
    private _object: any;

    constructor(subject: any, predicate: any, object: any) {
        this._subject = subject;
        this._predicate = predicate;
        this._object = object;
    }

    build() {
        return `${this._subject} ${this._predicate} ${this._object} `
    }

}
