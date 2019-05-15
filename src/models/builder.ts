import { Query } from "./query";
import {
    Prefix,
    Select,
    GroupBy,
    OrderBy,
    Where,
    Graph,
    Optional,
    Clause,
    Limit,
    Offset
} from "./clause";
import { Triple } from "./triple";
import { Direction } from "./clause/orderBy";

export abstract class Builder<T> extends Clause {

    protected abstract addClause(clause: Clause): T;

    prefix(...prefixes: Prefix[]) {
        prefixes.map((prefix) => {
            this.addClause(prefix);
        });

        return this;
    }

    select(...items: string[]) {
        let select = new Select();
        items.map((item) => {
            select.addComponent(item);
        });

        return this.addClause(select);
    }

    where(...items: (string | Graph | Triple | Optional | Query)[]) {
        let where = new Where();
        items.map((item) => {
            where.addComponent(item);
        });

        return this.addClause(where);
    }

    graph(iri: string, ...items: (string | Triple | Optional)[]) {
        let graph = new Graph(iri);
        items.map((item) => {
            graph.addComponent(item);
        });

        return this.addClause(graph);
    }

    orderBy(fields: string, direction: Direction) {
        return this.addClause(new OrderBy(fields, direction));
    }

    groupBy(fields: string) {
        return this.addClause(new GroupBy(fields));
    }

    limit(limit: number) {
        return this.addClause(new Limit(limit));
    }

    offset(offset: number) {
        return this.addClause(new Offset(offset));
    }
}