import { Action } from 'redux';
declare type StateValue = null | undefined | number | boolean | string | object | any[];
interface StateConfiguration<TValue extends StateValue> {
    defaultValue: TValue;
    locator: string;
}
interface SetAction<TValue> extends Action {
    meta: {
        isOblong: true;
    };
    payload: TValue;
}
export declare class OblongState<TValue extends StateValue = undefined> {
    protected configuration: StateConfiguration<TValue>;
    protected cachedSelector: (state: any) => TValue;
    constructor(newConfiguration?: Partial<StateConfiguration<TValue>>);
    query(state: any): TValue;
    command(dispatch: any, getState: any): (newValue: TValue) => SetAction<TValue>;
}
export declare class OblongStateBuilder<TValue extends StateValue = undefined> extends OblongState<TValue> {
    constructor(newConfiguration?: Partial<StateConfiguration<TValue>>);
    withDefault<TNewValue extends StateValue>(defaultValue: TNewValue): OblongStateBuilder<TNewValue>;
    as(locator: string): OblongStateBuilder<TValue>;
}
export declare const createState: () => OblongStateBuilder<undefined>;
export {};
