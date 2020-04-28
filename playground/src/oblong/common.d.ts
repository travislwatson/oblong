export interface OblongDependency<TMaterialized> {
    oblongType: 'command' | 'query' | 'state' | 'view';
    materialize: (dispatch: (action: any) => void, getState: () => any) => TMaterialized;
}
export interface OblongCommand<TDependencies> extends OblongDependency<() => void> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: [];
    }) => void;
}
export interface OblongCommandOut<TDependencies, TOut> extends OblongDependency<() => TOut> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: [];
    }) => TOut;
}
export interface OblongCommandIn<TDependencies, TIn1> extends OblongDependency<(in1: TIn1) => void> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: [TIn1];
    }) => void;
}
export interface OblongCommandInOut<TDependencies, TIn1, TOut> extends OblongDependency<(in1: TIn1) => TOut> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: [TIn1];
    }) => TOut;
}
export interface OblongCommandInIn<TDependencies, TIn1, TIn2> extends OblongDependency<(in1: TIn1, in2: TIn2) => void> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2];
    }) => void;
}
export interface OblongCommandInInOut<TDependencies, TIn1, TIn2, TOut> extends OblongDependency<(in1: TIn1, in2: TIn2) => TOut> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2];
    }) => TOut;
}
export interface OblongCommandInInIn<TDependencies, TIn1, TIn2, TIn3> extends OblongDependency<(in1: TIn1, in2: TIn2, in3: TIn3) => void> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2, TIn3];
    }) => void;
}
export interface OblongCommandInInInOut<TDependencies, TIn1, TIn2, TIn3, TOut> extends OblongDependency<(in1: TIn1, in2: TIn2, in3: TIn3) => TOut> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2, TIn3];
    }) => TOut;
}
export interface OblongCommandInInInIn<TDependencies, TIn1, TIn2, TIn3, TIn4> extends OblongDependency<(in1: TIn1, in2: TIn2, in3: TIn3, in4: TIn4) => void> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2, TIn3, TIn4];
    }) => void;
}
export interface OblongCommandInInInInOut<TDependencies, TIn1, TIn2, TIn3, TIn4, TOut> extends OblongDependency<(in1: TIn1, in2: TIn2, in3: TIn3, in4: TIn4) => TOut> {
    oblongType: 'command';
    inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2, TIn3, TIn4];
    }) => TOut;
}
export interface OblongQuery<TDependencies, TOutput> extends OblongDependency<TOutput> {
    oblongType: 'query';
    inner: (dependencies: TDependencies) => TOutput;
    selector: (state: any) => TOutput;
}
export declare type Unmaterialized<T> = {
    [P in keyof T]: OblongDependency<T[P]>;
};
