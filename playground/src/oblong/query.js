import { createSelector } from 'reselect';
let displayNameIncrementor = 0;
const makeQuery = (initialDependencies) => {
    const configuration = {
        dependencies: initialDependencies,
        displayName: `Unknown Query ${displayNameIncrementor}`,
        trace: false,
    };
    const builderInstance = {
        with: (dependencies) => {
            // TODO, this type dance feels icky, but the types are good. Maybe is ok? Maybe need better way?
            configuration.dependencies = dependencies;
            return builderInstance;
        },
        displayName: (displayName) => {
            configuration.displayName = displayName;
            return builderInstance;
        },
        trace: () => {
            configuration.trace = true;
            return builderInstance;
        },
        as: (inner) => {
            const dependencyKeys = Object.keys(configuration.dependencies);
            const dependencyValues = dependencyKeys.map((i) => {
                const dependency = configuration.dependencies[i];
                switch (dependency.oblongType) {
                    case 'query':
                        return dependency.selector;
                    case 'state':
                        return dependency.query.selector;
                    default:
                        throw new Error('Invalid dependency provided to Oblong view');
                }
            });
            const remappedInner = (...args) => inner(dependencyKeys.reduce((out, i, index) => (Object.assign(Object.assign({}, out), { [i]: args[index] })), {}));
            const selector = createSelector(dependencyValues, remappedInner);
            return {
                oblongType: 'query',
                // TODO is this even necessary
                materialize: (dispatch, getState) => selector(getState),
                inner,
                selector,
            };
        },
    };
    return builderInstance;
};
export const createQuery = () => makeQuery({});
