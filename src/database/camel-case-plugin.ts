import { CamelCasePlugin, CamelCasePluginOptions, UnknownRow } from 'kysely';
import isPlainObject from 'lodash/isPlainObject.js';

export class MyCamelCasePlugin extends CamelCasePlugin {
    private _excludedColumns: string[];
    
    constructor({ excludeColumns = [], ...opt }: { excludeColumns?: string[] } & CamelCasePluginOptions = {}) {
        super(opt);
        this._excludedColumns = excludeColumns;
    }
    
    protected mapRow(row: UnknownRow): UnknownRow {
        return Object.keys(row).reduce((obj: Record<string, any>, key) => {
            let value = row[key];
            if (this._excludedColumns.includes(key)) {
                obj[key] = value;
            } else if (Array.isArray(value)) {
                value = value.map((it) => (this.canMap(it, this.opt) ? this.mapRow(it) : it));
            }
            else if (this.canMap(value, this.opt)) {
                value = this.mapRow(value as UnknownRow);
            }
            obj[this.camelCase(key)] = value;
            return obj;
        }, {});
    }
    
    private canMap(obj: any, opt: any) {
        return isPlainObject(obj) && !opt?.maintainNestedObjectKeys;
    }
}
