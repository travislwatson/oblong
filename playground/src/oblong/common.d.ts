export interface OblongDependency<TMaterialized> {
    oblongType: 'command' | 'query' | 'state' | 'view';
    materialize: (dispatch: (action: any) => void, getState: () => any) => TMaterialized;
}
export interface OblongCommand<TDependencies> extends OblongDependency<(...args: any[]) => any> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: any[];
    }) => any;
}
export interface OblongQuery<TDependencies, TOutput> extends OblongDependency<TOutput> {
    oblongType: 'query';
    inner: (dependencies: TDependencies) => TOutput;
    selector: (state: any) => TOutput;
}
export declare type Unmaterialized<T> = {
    [P in keyof T]: OblongDependency<T[P]>;
};
