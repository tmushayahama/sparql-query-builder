import { INDENT_SIZE } from "./../../config/config";

export abstract class Clause {
    _indent: string = '';
    /**
     * Turns the clause into a query string.
     * @return {string} Partial query string.
     */
    abstract build(): string;

    /**
     * Turns the clause into a query string.
     * @return {string} Partial query string.
     */
    toString(): string {
        return this.build();
    }

    indent(initial: string) {
        this._indent = Array(initial.length + this._indent.length + INDENT_SIZE + 1).join(' ');
    }

}
