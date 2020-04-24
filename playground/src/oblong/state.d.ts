import { Action } from 'redux';
declare type StateValue = null | undefined | number | boolean | string | object | any[];
interface StateConfiguration<TValue extends StateValue> {
    defaultValue: TValue;
    locator: string;
}
interface SetAction<TValue> extends Action {
    meta: {
        isOblongSetter: true;
    };
    payload: TValue;
}
export declare class OblongState<TValue extends StateValue = undefined> {
    private configuration;
    private cachedSelector;
    constructor(newConfiguration?: Partial<StateConfiguration<TValue>>);
    query(state: any): TValue;
    command(dispatch: any, getState: any): (newValue: TValue) => SetAction<TValue>;
    withDefault<TNewValue extends StateValue>(defaultValue: TNewValue): OblongState<TNewValue>;
    as(locator: string): OblongState<TValue>;
}
export declare const createState: () => OblongState<undefined>;
export {};
