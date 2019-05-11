import { map } from 'lodash';
import { Clause } from './clause';
import { Builder } from './builder';

export class Query extends Builder<Query> {
    protected clauses: Clause[] = [];

    /**
     * Adds a clause to the query list.
     * @param {Clause} clause
     */
    addClause(clause: Clause): this {
        this.clauses.push(clause);
        return this;
    }

    build() {
        return `${map(this.clauses, s => s.build()).join('\n')};`;
    }
}
