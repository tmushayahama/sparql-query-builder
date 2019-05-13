import {
    Graph,
    Optional,
    optional,
    Prefix,
    prefix,
    Triple,
    Query,
    triple,

} from "./models";



//GO:0003723
let buildCamsByGoTermQuery = (goTermId: string) => {
    let query = new Query();
    let graphQuery = new Query();

    graphQuery.graph('?model',
        '?model metago:graphType metago:noctuaCam; dc:date ?date; dc:title ?modelTitle; dc:contributor ?contributor',
        optional('?model providedBy: ?providedBy'),
        triple('?entity ', 'rdf:type', 'owl:NamedIndividual'),
        triple('?entity', 'rdf:type', '?term'),
        `FILTER(?term = ${goTermId})`);

    query.prefix(prefix('rdf', '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>'),
        prefix('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>'),
        prefix('dc', '<http://purl.org/dc/elements/1.1/>'),
        prefix('metago', '<http://model.geneontology.org/>'),
        prefix('owl', '<http://www.w3.org/2002/07/owl#>'),
        prefix('GO', '<http://purl.obolibrary.org/obo/GO_>'),
        prefix('BP', '<http://purl.obolibrary.org/obo/GO_0008150>'),
        prefix('MF', '<http://purl.obolibrary.org/obo/GO_0003674>'),
        prefix('CC', '<http://purl.obolibrary.org/obo/GO_0005575>'),
        prefix('providedBy', '<http://purl.org/pav/providedBy>'))
        //prefix('has_affiliation', '<http://purl.obolibrary.org/obo/ERO_0000066>'))
        .select(
            'distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date',
            '(GROUP_CONCAT(distinct ?entity;separator="@@") as ?entities)',
            '(GROUP_CONCAT(distinct ?contributor;separator="@@") as ?contributors)',
            '(GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups)'
        )
        .where(graphQuery,
            'VALUES ?aspect { BP: MF: CC: }',
            triple('?entity', 'rdf:type', '?aspect'),
            triple('?term', 'rdfs:label', '?termLabel'))
        .groupBy('?model ?modelTitle ?aspect ?term ?termLabel ?date')
        .orderBy('?date', 'DESC');

    return query.build();
}

let buildAllCuratorsQuery = () => {
    let query = new Query();

    query.prefix(
        prefix('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>'),
        prefix('dc', '<http://purl.org/dc/elements/1.1/>'),
        prefix('metago', '<http://model.geneontology.org/>'),
        prefix('has_affiliation', '<http://purl.obolibrary.org/obo/ERO_0000066>'))
        .select(
            '?orcid ?name',
            '(GROUP_CONCAT(distinct ?organization;separator="@@") AS ?organizations)',
            '(GROUP_CONCAT(distinct ?affiliation;separator="@@") AS ?affiliations)',
            '(COUNT(distinct ?cam) AS ?cams)'
        )
        .where(
            triple('?cam', 'metago:graphType', 'metago:noctuaCam'),
            triple('?cam', 'dc:contributor', '?orcid'),
            'BIND( IRI(?orcid) AS ?orcidIRI)',
            optional(triple('?orcidIRI', 'rdfs:label', '?name'),
                triple('?orcidIRI', '<http://www.w3.org/2006/vcard/ns#organization-name>', '?organization'),
                triple('?orcidIRI', 'has_affiliation:', '?affiliation'),
                'BIND(IF(bound(?name), ?name, ?orcid) as ?name)'))
        .groupBy('?orcid ?name')
        .orderBy('?name', 'ASC');



    let query2 = `
      PREFIX metago: <http://model.geneontology.org/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
      PREFIX has_affiliation: <http://purl.obolibrary.org/obo/ERO_0000066> 
          
      SELECT  ?orcid ?name    (GROUP_CONCAT(distinct ?organization;separator="@@") AS ?organizations) 
                              (GROUP_CONCAT(distinct ?affiliation;separator="@@") AS ?affiliations) 
                              (COUNT(distinct ?cam) AS ?cams)
      WHERE 
      {
          ?cam metago:graphType metago:noctuaCam .
          ?cam dc:contributor ?orcid .
                  
          BIND( IRI(?orcid) AS ?orcidIRI ).
                  
          optional { ?orcidIRI rdfs:label ?name } .
          optional { ?orcidIRI <http://www.w3.org/2006/vcard/ns#organization-name> ?organization } .
          optional { ?orcidIRI has_affiliation: ?affiliation } .
            
          BIND(IF(bound(?name), ?name, ?orcid) as ?name) .            
      }
      GROUP BY ?orcid ?name 
      `
    return query.build();
}

console.log(buildCamsByGoTermQuery('GO:0017127'), '/n/n/n/n', buildAllCuratorsQuery())
