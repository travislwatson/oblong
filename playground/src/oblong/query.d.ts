import { OblongQuery, Unmaterialized } from './common';
export interface QueryBuilder<TDependencies> {
    with: <TNewDependencies>(dependencies: Unmaterialized<TNewDependencies>) => QueryBuilder<TNewDependencies>;
    displayName: (displayName: string) => QueryBuilder<TDependencies>;
    as: <TOutput>(inner: (dependencies: TDependencies) => TOutput) => OblongQuery<TDependencies, TOutput>;
}
export declare const createQuery: () => QueryBuilder<unknown>;
