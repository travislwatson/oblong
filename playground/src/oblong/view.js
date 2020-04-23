const defaultConfiguration = {
    displayName: null,
    dependencies: {},
};
class ViewBuilder {
    constructor(configuration) {
        this.configuration = configuration;
    }
    with(dependencies) {
        return new ViewBuilder(Object.assign(Object.assign({}, this.configuration), { dependencies }));
    }
    name(displayName) {
        return new ViewBuilder(Object.assign(Object.assign({}, this.configuration), { displayName }));
    }
    as(functionalComponent) {
        const output = (props) => {
            const o = Object.assign({}, props);
            return functionalComponent(o);
        };
        // TODO here, bind commands and queries
        // TODO compute merged return type of stateless functional component using TDependencies combined with supplementals (dispatch, getState)
        // Also need to allow incoming props to have a generic type, and merge that generic type with above 2
        // BBIIGG TODO... how the hell do I map the types of queries, like (state: TState) => whatever to just whatever for selectors, and from (whatever) => {type: string, etc} to (whatever) => void
        if (this.configuration.displayName)
            output.displayName = this.configuration.displayName;
        return output;
    }
}
export const view = (configuration = defaultConfiguration) => new ViewBuilder(configuration);
