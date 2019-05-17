import {
    Graph,
    Optional,
    optional,
    Prefix,
    prefix,
    Triple,
    Query,
    triple,
    limit,
    offset

} from "./models";

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
            ),
            'BIND(IF(bound(?name), ?name, ?orcid) as ?name)')
        .groupBy('?orcid ?name')
        .orderBy('?name', 'ASC');

    return query.build();
}


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

let buildCamsByCuratorQuery = (goTermId: string, orcid: any) => {

    let query = new Query();
    let graphQuery = new Query();
    graphQuery.graph('?model',
        '?model metago:graphType metago:noctuaCam; dc:date ?date; dc:title ?modelTitle; dc:contributor ?orcid',
        optional('?model providedBy: ?providedBy'),
        triple('?entity ', 'rdf:type', 'owl:NamedIndividual'),
        triple('?entity', 'rdf:type', '?term'),
        `FILTER(?term = ${goTermId})`
    );

    query.prefix(
        prefix('rdf', '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>'),
        prefix('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>'),
        prefix('dc', '<http://purl.org/dc/elements/1.1/>'),
        prefix('metago', '<http://model.geneontology.org/>'),
        prefix('owl', '<http://www.w3.org/2002/07/owl#>'),
        prefix('GO', '<http://purl.obolibrary.org/obo/GO_>'),
        prefix('BP', '<http://purl.obolibrary.org/obo/GO_0008150>'),
        prefix('MF', '<http://purl.obolibrary.org/obo/GO_0003674>'),
        prefix('CC', '<http://purl.obolibrary.org/obo/GO_0005575>'),
        prefix('providedBy', '<http://purl.org/pav/providedBy>'),
        prefix('vcard', '<http://www.w3.org/2006/vcard/ns#>'),
        prefix('has_affiliation', '<http://purl.obolibrary.org/obo/ERO_0000066>'),
        prefix('enabled_by', '<http://purl.obolibrary.org/obo/RO_0002333>'),
        prefix('obo', '<http://www.geneontology.org/formats/oboInOwl#>'))
        .select(
            'distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date',
            '(GROUP_CONCAT(distinct ?entity;separator="@@") as ?entities)',
            '(GROUP_CONCAT(distinct ?orcid;separator="@@") as ?contributors)',
            '(GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups)'
        ).where(
            `BIND(${orcid} as ?orcid)`,
            'BIND(IRI(?orcid) as ?orcidIRI)',
            graphQuery,
            'VALUES ?aspect { BP: MF: CC: }',
            triple('?entity', 'rdf:type', '?aspect'),
            triple('?term', 'rdfs:label', '?termLabel'),
            optional(
                triple('?orcidIRI', 'rdfs:label', '?name')
            ),
            'BIND(IF(bound(?name), ?name, ?orcid) as ?name)',

        )
        .groupBy('?model ?modelTitle ?aspect ?term ?termLabel ?date')
        .orderBy('?date', 'DESC');
    return query.build();
}

let buildCamsByCuratorQueryAdvanced = (orcid: any) => {
    //  let modOrcid = this.getOrcid(orcid);
    let query = new Query();
    let graphQuery = new Query();
    graphQuery.graph('?model',
        '?model metago:graphType metago:noctuaCam; dc:date ?date; dc:title ?modelTitle; dc:contributor ?orcid',
        triple('?entity', 'rdf:type', 'owl:NamedIndividual'),
        triple('?entity', 'rdf:type', '?goid'),
        triple('?s', ' enabled_by:', '?gpentity'),
        triple('?gpentity', 'rdf:type', '?gpid '),
        'FILTER(?gpid != owl:NamedIndividual)');

    query.prefix(
        prefix('rdf', '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>'),
        prefix('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>'),
        prefix('dc', '<http://purl.org/dc/elements/1.1/>'),
        prefix('metago', '<http://model.geneontology.org/>'),
        prefix('owl', '<http://www.w3.org/2002/07/owl#>'),
        prefix('GO', '<http://purl.obolibrary.org/obo/GO_>'),
        prefix('BP', '<http://purl.obolibrary.org/obo/GO_0008150>'),
        prefix('MF', '<http://purl.obolibrary.org/obo/GO_0003674>'),
        prefix('CC', '<http://purl.obolibrary.org/obo/GO_0005575>'),
        prefix('providedBy', '<http://purl.org/pav/providedBy>'),
        prefix('vcard', '<http://www.w3.org/2006/vcard/ns#>'),
        prefix('has_affiliation', '<http://purl.obolibrary.org/obo/ERO_0000066>'),
        prefix('enabled_by', '<http://purl.obolibrary.org/obo/RO_0002333>'),
        prefix('obo', '<http://www.geneontology.org/formats/oboInOwl#>')
    ).select('?model ?modelTitle',
        '(GROUP_CONCAT(distinct ?spec;separator="@@") as ?species)',
        '(GROUP_CONCAT(distinct ?goid;separator="@@") as ?bpids)',
        '(GROUP_CONCAT(distinct ?goname;separator="@@") as ?bpnames)',
        '(GROUP_CONCAT(distinct ?gpid;separator="@@") as ?gpids)',
        '(GROUP_CONCAT(distinct ?gpname;separator="@@") as ?gpnames)'
    ).where(
        `BIND(${orcid} as ?orcid)`,
        'BIND(IRI(?orcid) as ?orcidIRI)',
        graphQuery,
        'VALUES ?aspect { BP: }',
        triple('?entity', 'rdf:type', '?aspect'),
        'filter(?goid != MF: )',
        'filter(?goid != BP: )',
        'filter(?goid != CC: )',
        triple('?goid', 'rdfs:label', '?goname'),
        optional(
            triple('?orcidIRI', 'rdfs:label', '?name')
        ),
        'BIND(IF(bound(?name), ?name, ?orcid) as ?name)',
        optional(
            triple('?orcidIRI', 'vcard:organization-name', '?organization'),
            triple('?orcidIRI', 'has_affiliation:', '?affiliationIRI '),
            triple('?affiliationIRI', 'rdfs:label', '?affiliation'),
            triple('?gpid', 'rdfs:label', '?gpname'),
            triple('?gpid', 'rdfs:subClassOf ?v0'),
            triple('?v0', 'owl:onProperty', '<http://purl.obolibrary.org/obo/RO_0002162>'),
            triple('?v0', 'owl:someValuesFrom', '?taxon'),
            triple('?taxon', 'rdfs:label', '?spec')
        )
    )
        .groupBy('?model ?modelTitle')
        .orderBy('?date', 'DESC');



    let query2 = `
      PREFIX metago: <http://model.geneontology.org/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
      PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
      PREFIX has_affiliation: <http://purl.obolibrary.org/obo/ERO_0000066> 
      PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>
      PREFIX obo: <http://www.geneontology.org/formats/oboInOwl#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX BP: <http://purl.obolibrary.org/obo/GO_0008150>
      PREFIX MF: <http://purl.obolibrary.org/obo/GO_0003674>
      PREFIX CC: <http://purl.obolibrary.org/obo/GO_0005575>
          
      SELECT  ?model ?modelTitle	(GROUP_CONCAT(distinct ?spec;separator="@@") as ?species)
                (GROUP_CONCAT(distinct ?goid;separator="@@") as ?bpids)
                (GROUP_CONCAT(distinct ?goname;separator="@@") as ?bpnames)
                (GROUP_CONCAT(distinct ?gpid;separator="@@") as ?gpids)
                (GROUP_CONCAT(distinct ?gpname;separator="@@") as ?gpnames)
      WHERE 
      {            
          BIND(` + orcid + ` as ?orcid) .
          BIND(IRI(?orcid) as ?orcidIRI) .
                    
          # Getting some information on the model
          GRAPH ?model 
          {
              ?model metago:graphType metago:noctuaCam ;
                      dc:date ?date ;
                      dc:title ?modelTitle ;
                      dc:contributor ?orcid .
              
             ?entity rdf:type owl:NamedIndividual .
             ?entity rdf:type ?goid .
  
              ?s enabled_by: ?gpentity .    
              ?gpentity rdf:type ?gpid .
              FILTER(?gpid != owl:NamedIndividual) .
         }
            
          VALUES ?aspect { BP: } . 
          # rdf:type faster then subClassOf+ but require filter 			
          # ?goid rdfs:subClassOf+ ?aspect .
      ?entity rdf:type ?aspect .
      
      # Filtering out the root BP, MF & CC terms
      filter(?goid != MF: )
      filter(?goid != BP: )
      filter(?goid != CC: )
      ?goid rdfs:label ?goname .
            
          # Getting some information on the contributor
          optional { ?orcidIRI rdfs:label ?name } .
          BIND(IF(bound(?name), ?name, ?orcid) as ?name) .
          optional { ?orcidIRI vcard:organization-name ?organization } .
          optional { 
              ?orcidIRI has_affiliation: ?affiliationIRI .
              ?affiliationIRI rdfs:label ?affiliation
          } .
            
        
          # Require each GP to have a correct URI, not the case for SYNGO at this time
          optional {
          ?gpid rdfs:label ?gpname .
          ?gpid rdfs:subClassOf ?v0 . 
          ?v0 owl:onProperty <http://purl.obolibrary.org/obo/RO_0002162> . 
          ?v0 owl:someValuesFrom ?taxon .
                
          ?taxon rdfs:label ?spec .  
          }
            
      }
      GROUP BY ?model ?modelTitle
      ORDER BY DESC(?date)
      `
    return query.build();
}

let buildCamsByPMIDQuery = (pmid: string) => {

    let query = new Query();
    let graphQuery = new Query();

    graphQuery.graph('?model',
        '?model metago:graphType metago:noctuaCam; dc:date ?date; dc:title ?modelTitle; dc:contributor ?contributor',
        optional('?model providedBy: ?providedBy'),
        triple('?entity', 'rdf:type', 'owl:NamedIndividual'),
        triple('?entity', 'rdf:type', '?term'),
        triple('?entity', 'dc:source', '?source'),
        'BIND(REPLACE(?source, " ", "") AS ?source)',
        `FILTER((CONTAINS(?source, "${pmid}")))`);

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
        .select(
            'distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date',
            '(GROUP_CONCAT(distinct ?entity;separator="@@") as ?entities)',
            '(GROUP_CONCAT(distinct ?contributor;separator="@@") as ?contributors)',
            '(GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups)'
        )
        .where(graphQuery)
        .groupBy('?model ?modelTitle ?aspect ?term ?termLabel ?date')
        .orderBy('?date', 'DESC');


    let query1 = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/> 
    PREFIX metago: <http://model.geneontology.org/>
    PREFIX providedBy: <http://purl.org/pav/providedBy>
            
    SELECT distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date
                        (GROUP_CONCAT( ?entity;separator="@@") as ?entities)
                        (GROUP_CONCAT(distinct ?contributor;separator="@@") as ?contributors)
                        (GROUP_CONCAT( ?providedBy;separator="@@") as ?providedBys)
    WHERE 
    {
        GRAPH ?model {
            ?model metago:graphType metago:noctuaCam ;    
                dc:date ?date;
                dc:title ?modelTitle; 
                dc:contributor ?contributor .
            optional {?model providedBy: ?providedBy } .
            ?entity dc:source ?source .
            BIND(REPLACE(?source, " ", "") AS ?source) .
            FILTER((CONTAINS(?source, "${pmid}")))
        }           
    }
    GROUP BY ?model ?modelTitle ?aspect ?term ?termLabel ?date
    ORDER BY DESC(?date)`

    return query.build();
}

let buildCamsByGPQuery = (gpIri: string) => {
    let query = new Query();
    let graphQuery = new Query();

    graphQuery.graph('?model',
        '?model metago:graphType metago:noctuaCam; dc:date ?date; dc:title ?modelTitle; dc:contributor ?contributor',
        optional('?model providedBy: ?providedBy'),
        triple('?s', 'enabled_by:', '?entity'),
        triple('?entity', 'rdf:type', '?identifier'),
        triple('?entity', 'rdf:type', '?term'),
        'BIND(REPLACE(?source, " ", "") AS ?source)',
        `FILTER(?term = <${gpIri}>)`);

    query.prefix(prefix('rdf', '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>'),
        prefix('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>'),
        prefix('dc', '<http://purl.org/dc/elements/1.1/>'),
        prefix('metago', '<http://model.geneontology.org/>'),
        prefix('owl', '<http://www.w3.org/2002/07/owl#>'),
        prefix('GO', '<http://purl.obolibrary.org/obo/GO_>'),
        prefix('BP', '<http://purl.obolibrary.org/obo/GO_0008150>'),
        prefix('MF', '<http://purl.obolibrary.org/obo/GO_0003674>'),
        prefix('CC', '<http://purl.obolibrary.org/obo/GO_0005575>'),
        prefix('enabled_by', '<http://purl.obolibrary.org/obo/RO_0002333>'),
        prefix('providedBy', '<http://purl.org/pav/providedBy>'))
        .select(
            'distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date',
            '(GROUP_CONCAT(distinct ?entity;separator="@@") as ?entities)',
            '(GROUP_CONCAT(distinct ?contributor;separator="@@") as ?contributors)',
            '(GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups)'
        )
        .where(graphQuery)
        .groupBy('?model ?modelTitle ?aspect ?term ?termLabel ?date')
        .orderBy('?date', 'DESC');


    let query2 = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
  PREFIX dc: <http://purl.org/dc/elements/1.1/> 
  PREFIX metago: <http://model.geneontology.org/>    
  PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>    
  PREFIX providedBy: <http://purl.org/pav/providedBy>
          
  SELECT distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date
                      (GROUP_CONCAT(distinct  ?entity;separator="@@") as ?entities)
                      (GROUP_CONCAT(distinct  ?contributor;separator="@@") as ?contributors)
                      (GROUP_CONCAT(distinct  ?providedBy;separator="@@") as ?providedBys)
  
  WHERE 
  {
  
    GRAPH ?model {
      ?model metago:graphType metago:noctuaCam;
          dc:date ?date;
          dc:title ?modelTitle; 
          dc:contributor ?contributor .

      optional {?model providedBy: ?providedBy } .
      ?s enabled_by: ?entity .    
      ?entity rdf:type ?identifier .
      FILTER(?identifier = <` + gpIri + `>) .         
    }
    
  }
  GROUP BY ?model ?modelTitle ?aspect ?term ?termLabel ?date
  ORDER BY DESC(?date)`

    return query.build();
}

let buildCamsByGroupQuery = (groupName: string) => {
    let query = new Query();
    let graphQuery = new Query();
    graphQuery.graph('?model',
        '?model metago:graphType metago:noctuaCam; dc:date ?date; dc:title ?modelTitle; dc:contributor ?orcid; providedBy: ?providedBy',
        'BIND( IRI(?orcid) AS ?orcidIRI )',
        'BIND( IRI(?providedBy) AS ?providedByIRI )'
    );

    query.prefix(
        prefix('rdf', '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>'),
        prefix('rdfs', '<http://www.w3.org/2000/01/rdf-schema#>'),
        prefix('dc', '<http://purl.org/dc/elements/1.1/>'),
        prefix('metago', '<http://model.geneontology.org/>'),
        prefix('owl', '<http://www.w3.org/2002/07/owl#>'),
        prefix('GO', '<http://purl.obolibrary.org/obo/GO_>'),
        prefix('BP', '<http://purl.obolibrary.org/obo/GO_0008150>'),
        prefix('MF', '<http://purl.obolibrary.org/obo/GO_0003674>'),
        prefix('CC', '<http://purl.obolibrary.org/obo/GO_0005575>'),
        prefix('providedBy', '<http://purl.org/pav/providedBy>'),
        prefix('vcard', '<http://www.w3.org/2006/vcard/ns#>'),
        prefix('has_affiliation', '<http://purl.obolibrary.org/obo/ERO_0000066>'),
        prefix('enabled_by', '<http://purl.obolibrary.org/obo/RO_0002333>'),
        prefix('obo', '<http://www.geneontology.org/formats/oboInOwl#>'))
        .select(
            'distinct ?model ?modelTitle ?date',
            '(GROUP_CONCAT(distinct ?entity;separator="@@") as ?entities)',
            '(GROUP_CONCAT(distinct ?orcid;separator="@@") as ?contributors)'
        ).where(
            `BIND("${groupName}" as ?groupName)`,
            graphQuery,
            optional(
                triple('?providedByIRI', 'rdfs:label', '?providedByLabel')
            ),
            'FILTER(?providedByLabel = ?groupName )',
            'BIND(IF(bound(?name), ?name, ?orcid) as ?name)',
        )
        .groupBy('?model ?modelTitle ?aspect ?date')
        .orderBy('?date', 'DESC')
        .limit(10)

    return query.build();
}
`
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
PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
PREFIX has_affiliation: <http://purl.obolibrary.org/obo/ERO_0000066>
PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>
PREFIX obo: <http://www.geneontology.org/formats/oboInOwl#>
prefix evidence: <http://geneontology.org/lego/evidence>
SELECT distinct ?model ?modelTitle ?axiom ?edge ?eve ?source
	(GROUP_CONCAT(distinct ?entity;separator="@@") as ?entities)

WHERE{
GRAPH ?model {
?model metago:graphType metago:noctuaCam; dc:title ?modelTitle .

  
  ?entity rdf:type GO:0017127.
  ?entity2 rdf:type <http://identifiers.org/uniprot/O95477>. 
 # ?entity enabled_by: ?entity2. 
  
   ?axiom owl:annotatedProperty enabled_by: .
   ?axiom owl:annotatedSource ?iri .
   ?axiom owl:annotatedTarget ?iri2 .
  
   ?axiom evidence: ?eve .
   ?eve dc:source ?source .
            BIND(REPLACE(?source, " ", "") AS ?source) .
            FILTER((CONTAINS(?source, "PMID:1234")))
   #?eve dc:source "PMID:1234"
#FILTER(?term = GO:0017127 ).
  

#?s enabled_by: ?entity2.
#FILTER(?term2 = <http://identifiers.org/uniprot/O95477>)

  }

}

GROUP BY ?model ?modelTitle ?axiom ?edge ?eve ?source
LIMIT 5`

console.log(buildCamsByGPQuery('http://identifiers.org/uniprot/O95477'))

console.log(buildCamsByGroupQuery('dictyBase')) 
