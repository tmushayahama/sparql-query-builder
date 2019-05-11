import { Query } from "./models";

let query = new Query();

query.prefix('rdf',
    'rdfs',
    'dc',
    'metago',
    'owl',
    'GO',
    'BP',
    'MF',
    'CC')
    .prefix('providedBy')
    .select(
        'distinct ?model ?modelTitle ?aspect ?term ?termLabel ?date',
        '(GROUP_CONCAT(distinct  ?entity;separator="@@") as ?entities)',
        '(GROUP_CONCAT(distinct ?contributor;separator="@@") as ?contributors)',
        '(GROUP_CONCAT(distinct ?providedBy;separator="@@") as ?groups)'
    )


console.log(query.build())