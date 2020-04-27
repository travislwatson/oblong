import { OblongCommand, OblongCommandIn, OblongCommandInIn, OblongCommandInInIn, OblongCommandInInInIn, OblongCommandInInInInOut, OblongCommandInInInOut, OblongCommandInInOut, OblongCommandInOut, OblongCommandOut, Unmaterialized } from './common';
declare type CommandAs<TDependencies> = {
    (inner: (dependencies: TDependencies & {
        args: [];
    }) => void): OblongCommand<TDependencies>;
    <TOut>(inner: (dependencies: TDependencies & {
        args: [];
    }) => TOut): OblongCommandOut<TDependencies, TOut>;
    <TIn1>(inner: (dependencies: TDependencies & {
        args: [TIn1];
    }) => void): OblongCommandIn<TDependencies, TIn1>;
    <TIn1, TOut>(inner: (dependencies: TDependencies & {
        args: [TIn1];
    }) => TOut): OblongCommandInOut<TDependencies, TIn1, TOut>;
    <TIn1, TIn2>(inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2];
    }) => void): OblongCommandInIn<TDependencies, TIn1, TIn2>;
    <TIn1, TIn2, TOut>(inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2];
    }) => TOut): OblongCommandInInOut<TDependencies, TIn1, TIn2, TOut>;
    <TIn1, TIn2, TIn3>(inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2, TIn3];
    }) => void): OblongCommandInInIn<TDependencies, TIn1, TIn2, TIn3>;
    <TIn1, TIn2, TIn3, TOut>(inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2, TIn3];
    }) => TOut): OblongCommandInInInOut<TDependencies, TIn1, TIn2, TIn3, TOut>;
    <TIn1, TIn2, TIn3, TIn4>(inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2, TIn3, TIn4];
    }) => void): OblongCommandInInInIn<TDependencies, TIn1, TIn2, TIn3, TIn4>;
    <TIn1, TIn2, TIn3, TIn4, TOut>(inner: (dependencies: TDependencies & {
        args: [TIn1, TIn2, TIn3, TIn4];
    }) => TOut): OblongCommandInInInInOut<TDependencies, TIn1, TIn2, TIn3, TIn4, TOut>;
};
export interface CommandBuilder<TDependencies> {
    with: <TNewDependencies>(dependencies: Unmaterialized<TNewDependencies>) => CommandBuilder<TNewDependencies>;
    displayName: (displayName: string) => CommandBuilder<TDependencies>;
    trace: () => CommandBuilder<TDependencies>;
    as: CommandAs<TDependencies>;
}
export declare const createCommand: () => CommandBuilder<unknown>;
export {};
