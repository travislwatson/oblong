interface ViewConfiguration<TDependencies> {
    displayName: string;
    dependencies: TDependencies;
}
declare class ViewBuilder<TDependencies> {
    private configuration;
    constructor(configuration: ViewConfiguration<TDependencies>);
    with<TNewDependencies>(dependencies: TNewDependencies): ViewBuilder<TNewDependencies>;
    name(displayName: string): ViewBuilder<TDependencies>;
    as(functionalComponent: (o: TDependencies) => any): {
        (props: any): any;
        displayName: string;
    };
}
export declare const view: (configuration?: ViewConfiguration<{}>) => ViewBuilder<{}>;
export {};
