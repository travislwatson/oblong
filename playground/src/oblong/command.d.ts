import { Dispatch } from 'redux';
interface CommandConfiguration<TDependencies, TOutput> {
    displayName: string;
    dependencies: TDependencies;
    as: (o: TDependencies & {
        args: unknown[];
    }) => TOutput;
}
export interface OblongCommand<TOutput> {
    (dispatch: Dispatch, getState: () => any): (...args: unknown[]) => TOutput;
    oblongType: 'command';
}
export interface OblongCommandBuilder<TDependencies, TOutput> extends OblongCommand<TOutput> {
    configuration: CommandConfiguration<TDependencies, TOutput>;
    withDisplayName: (displayName: string) => OblongCommandBuilder<TDependencies, TOutput>;
    with: <TNewDependencies>(dependencies: TNewDependencies) => OblongCommandBuilder<TNewDependencies, TOutput>;
    as: <TNewOutput>(as: (o: TDependencies & {
        args: unknown[];
    }) => TNewOutput) => OblongCommandBuilder<TDependencies, TNewOutput>;
}
export declare const createCommand: () => OblongCommandBuilder<{}, void>;
export {};
