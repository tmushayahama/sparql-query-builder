import { INDENT_SIZE } from "./../../config/config";
import { find, remove } from "lodash";

export abstract class Clause {
    private _id: string;
    private _indent: string = '';
    protected _components: any = [];
    /**
     * Turns the clause into a query string.
     * @return {string} Partial query string.
     */
    abstract build(): string;

    get id() {
        return this._id;
    }

    set id(id) {
        id = this._id;
    }

    findComponent(component: Clause | string) {
        const self = this;

        let srcComponent = component.toString();
        return find(this._components, (destComponent: Clause | string) => {
            if (component instanceof Clause) {
                return srcComponent === destComponent.toString()
            }
            return srcComponent === destComponent;
        });
    }

    removeComponent(component: Clause | string) {
        const self = this;

        let srcComponent = component.toString();
        return remove(this._components, (destComponent: Clause | string) => {
            if (component instanceof Clause) {
                return srcComponent === destComponent.toString()
            }
            return srcComponent === destComponent;
        });
    }
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
