import { Unmaterialized } from './common';
import * as React from 'react';
export interface OblongView<TDependencies, TProps> extends React.FC<TProps> {
    inner: React.FC<TDependencies & TProps>;
}
export interface ViewBuilder<TDependencies> {
    with: <TNewDependencies>(dependencies: Unmaterialized<TNewDependencies>) => ViewBuilder<TNewDependencies>;
    displayName: (displayName: string) => ViewBuilder<TDependencies>;
    as: <TProps = {}>(inner: React.FC<TDependencies & TProps>) => OblongView<TDependencies, TProps>;
}
export declare const createView: () => ViewBuilder<unknown>;
