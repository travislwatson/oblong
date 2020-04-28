import { OblongCommand, Unmaterialized } from './common';
export interface CommandBuilder<TDependencies> {
    with: <TNewDependencies>(dependencies: Unmaterialized<TNewDependencies>) => CommandBuilder<TNewDependencies>;
    displayName: (displayName: string) => CommandBuilder<TDependencies>;
    trace: () => CommandBuilder<TDependencies>;
    as: (inner: (dependencies: TDependencies & {
        args: any[];
    }) => any) => OblongCommand<TDependencies>;
}
export declare const createCommand: () => CommandBuilder<unknown>;
