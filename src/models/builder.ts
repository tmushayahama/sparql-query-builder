import { Query } from "./query";
import {
    Prefix,
    Select,
    SelectItem,
    PrefixItem
} from "./clause";

export class Builder {

    _prefix = '';
    _select = "";
    _orderBy = "";
    _groupBy = ""


    prefix(prefix: any) {
    }

    select(select: any) {
        this._select += ` ${select}`;
    }

    where(where: any) {

    }

    graph() {

    }

    orderBy(orderBy: any) {
        this._orderBy += ` ${orderBy}`
    }


    //Example 1
    query1() {
        let query = new Query();
        let prefix = new Prefix();
        let select = new Select();
        prefix.addPrefixItem(new PrefixItem('rdf'));
        prefix.addPrefixItem(new PrefixItem('rdfs'));
        prefix.addPrefixItem(new PrefixItem('dc'));
        prefix.addPrefixItem(new PrefixItem('metago'));
        prefix.addPrefixItem(new PrefixItem('owl'));
        prefix.addPrefixItem(new PrefixItem('GO'));
        prefix.addPrefixItem(new PrefixItem('BP'));
        prefix.addPrefixItem(new PrefixItem('MF'));
        prefix.addPrefixItem(new PrefixItem('CC'));
        prefix.addPrefixItem(new PrefixItem('providedBy'));
        select.addSelectItem(new SelectItem('distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date'));
        select.addSelectItem(new SelectItem('(GROUP_CONCAT(distinct  ?entity;separator="@@") as ?entities'));
        select.addSelectItem(new SelectItem('(GROUP_CONCAT(distinct ?contributor;separator="@@") as ?contributors'))
        select.addSelectItem(new SelectItem('(GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups'));

        //  orderBy.orderBy(new SelectItem('?model ?modelTitle ?aspect ?term ?termLabel ?date'));

        query.addClause(prefix);
        query.addClause(select);

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
              FILTER(?term = ${goTerm.id})
            }
            VALUES ?aspect { BP: MF: CC: } .
            ?entity rdf:type ?aspect .
            ?term rdfs:label ?termLabel  .
        }
    
        GROUP BY ?model ?modelTitle ?aspect ?term ?termLabel ?date
        ORDER BY DESC(?date)
        `;

        return '?query=' + encodeURIComponent(query);
    }
}