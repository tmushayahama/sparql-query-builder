import { Clause } from './../clause';

export const PREFIX: any = {
    rdf: '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    rdfs: '<http://www.w3.org/2000/01/rdf-schema#>',
    dc: '<http://purl.org/dc/elements/1.1/>',
    metago: '<http://model.geneontology.org/>',
    owl: '<http://www.w3.org/2002/07/owl#>',
    GO: '<http://purl.obolibrary.org/obo/GO_>',
    BP: '<http://purl.obolibrary.org/obo/GO_0008150>',
    MF: '<http://purl.obolibrary.org/obo/GO_0003674>',
    CC: '<http://purl.obolibrary.org/obo/GO_0005575>',
    providedBy: '<http://purl.org/pav/providedBy>',
    has_affiliation: '<http://purl.obolibrary.org/obo/ERO_0000066>'
}

export class Prefix extends Clause {
    private _prefix: string

    constructor(prefix: string, iri: string) {
        super();
        this._prefix = `PREFIX ${prefix}: ${iri}`;
    }

    build() {
        return this._prefix;
    }
}

export function prefix(prefix: string, iri: string) {
    return new Prefix(prefix, iri);
}
