import { OblongCommand, OblongQuery } from './common';
declare type StateValue = null | undefined | number | boolean | string | object | any[];
interface StateConfiguration<TValue extends StateValue> {
    defaultValue: TValue;
    locator: string;
}
export declare class OblongState<TValue extends StateValue = undefined> {
    protected configuration: StateConfiguration<TValue>;
    cachedSelector: (state: any) => TValue;
    oblongType: string;
    constructor(newConfiguration?: Partial<StateConfiguration<TValue>>);
    get query(): OblongQuery<{}, TValue>;
    get command(): OblongCommand<{}>;
}
export declare class OblongStateBuilder<TValue extends StateValue = undefined> extends OblongState<TValue> {
    constructor(newConfiguration?: Partial<StateConfiguration<TValue>>);
    withDefault<TNewValue extends StateValue>(defaultValue: TNewValue): OblongStateBuilder<TNewValue>;
    as(locator: string): OblongStateBuilder<TValue>;
}
export declare const createState: () => OblongStateBuilder<undefined>;
export {};
