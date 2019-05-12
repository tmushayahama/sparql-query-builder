import { Query, Triple, Graph, Optional } from "./models";

let query = new Query();
let graphQuery = new Query();

graphQuery.graph('?model',
    '?model metago:graphType metago:noctuaCam; dc:date ?date; dc:title ?modelTitle; dc:contributor ?contributor',
    new Optional('?model providedBy: ?providedBy'),
    new Triple('?entity ', 'rdf:type', 'owl:NamedIndividual'),
    new Triple('?entity', 'rdf:type', '?term'),
    'FILTER(?term = GO:0017127)');

query.prefix(
    'rdf',
    'rdfs',
    'dc',
    'metago',
    'owl',
    'GO',
    'BP',
    'MF',
    'CC',
    'providedBy')
    .select(
        'distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date',
        '(GROUP_CONCAT(distinct  ?entity;separator="@@") as ?entities)',
        '(GROUP_CONCAT(distinct ?contributor;separator="@@") as ?contributors)',
        '(GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups)'
    )
    .where(graphQuery,
        'VALUES ?aspect { BP: MF: CC: }',
        new Triple('?entity', 'rdf:type', '?aspect'),
        new Triple('?term', 'rdfs:label', '?termLabel'))
    .groupBy('?model ?modelTitle ?aspect ?term ?termLabel ?date')
    .orderBy('?date', 'DESC')


console.log(query.build()) 