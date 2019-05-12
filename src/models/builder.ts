import { Query } from "./query";
import {
    Prefix,
    Select,
    PrefixItem,
    GroupBy,
    OrderBy,
    Where,
    Graph,
    Optional,
    Clause
} from "./clause";
import { Triple } from "./triple";
import { Direction } from "./clause/orderBy";

export abstract class Builder<T> extends Clause {

    protected abstract addClause(clause: Clause): T;

    prefix(...prefixes: string[]) {
        prefixes.map((prefix) => {
            this.addClause(new PrefixItem(prefix));
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

    where(...items: (string | Graph | Triple | Query)[]) {
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

    //Example 1
    queryExample1() {
        let query = new Query();
        let prefix = new Prefix();
        let select = new Select();
        let where = new Where();
        let graph = new Graph('?model');
        let groupBy = new GroupBy('?model ?modelTitle ?aspect ?term ?termLabel ?date');
        let orderBy = new OrderBy('?date', 'DESC');

        prefix.addComponent(new PrefixItem('rdf'));
        prefix.addComponent(new PrefixItem('rdfs'));
        prefix.addComponent(new PrefixItem('dc'));
        prefix.addComponent(new PrefixItem('metago'));
        prefix.addComponent(new PrefixItem('owl'));
        prefix.addComponent(new PrefixItem('GO'));
        prefix.addComponent(new PrefixItem('BP'));
        prefix.addComponent(new PrefixItem('MF'));
        prefix.addComponent(new PrefixItem('CC'));
        prefix.addComponent(new PrefixItem('providedBy'));
        select.addComponent('distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date');
        select.addComponent('(GROUP_CONCAT(distinct  ?entity;separator="@@") as ?entities)');
        select.addComponent('(GROUP_CONCAT(distinct ?contributor;separator="@@") as ?contributors)');
        select.addComponent('(GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups)');

        graph.addComponent('?model metago:graphType metago:noctuaCam; dc:date ?date; dc:title ?modelTitle; dc:contributor ?contributor')
        graph.addComponent(new Optional('?model providedBy: ?providedBy'));
        graph.addComponent(new Triple('?entity ', 'rdf:type', 'owl:NamedIndividual'));
        graph.addComponent(new Triple('?entity', 'rdf:type', '?term'));
        graph.addComponent('FILTER(?term = GO:0003723)');

        where.addComponent(graph);
        where.addComponent('VALUES ?aspect { BP: MF: CC: }');
        where.addComponent(new Triple('?entity', 'rdf:type', '?aspect'));
        where.addComponent(new Triple('?term', 'rdfs:label', '?termLabel'));

        query.addClause(prefix);
        query.addClause(select);
        query.addClause(where);
        query.addClause(groupBy);
        query.addClause(orderBy);

        console.log(query.build())

    }

    //temp
    buildCamsByGoTermQuery(goTerm: { id: any; }) {
        let query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dc: <http://purl.org/dc/elements/1.1/> 
        PREFIX metago: <http://model.geneontology.org/>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX GO: <http://purl.obolibrary.org/obo/GO_>
        PREFIX BP: <http://purl.obolibrary.org/obo/GO_0008150>
        PREFIX MF: <http://purl.obolibrary.org/obo/GO_0003674>
        PREFIX CC: <http://purl.obolibrary.org/obo/GO_0005575>
        PREFIX providedBy: <http://purl.org/pav/providedBy>
    
        SELECT distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date
                        (GROUP_CONCAT(distinct  ?entity;separator="@@") as ?entities)
                        (GROUP_CONCAT(distinct ?contributor;separator="@@") as ?contributors)
                        (GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups)
        WHERE 
        {
          GRAPH ?model {
              ?model metago:graphType metago:noctuaCam;
                    dc:date ?date;
                    dc:title ?modelTitle; 
                    dc:contributor ?contributor .
    
              optional {?model providedBy: ?providedBy } .
              ?entity rdf:type owl:NamedIndividual .
              ?entity rdf:type ?term .
              FILTER(?term = GO:0017127)
            }
            VALUES ?aspect { BP: MF: CC: } .
            ?entity rdf:type ?aspect .
            ?term rdfs:label ?termLabel  .
        }
    
        GROUP BY ?model ?modelTitle ?aspect ?term ?termLabel ?date
        ORDER BY DESC(?date)`;

        return '?query=' + encodeURIComponent(query);
    }
}