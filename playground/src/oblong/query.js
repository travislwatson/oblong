import { createSelector } from 'reselect';
let displayNameIncrementor = 0;
const makeQuery = (initialDependencies) => {
    const configuration = {
        dependencies: initialDependencies,
        displayName: `Unknown Query ${displayNameIncrementor}`,
        trace: false,
    };
    const selectorCache;
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
            return {
                oblongType: 'query',
                materialize: (_dispatch, getState) => {
                    // OKAY gotta stop for the night, but I've totally borked this.
                    // The .materialize syntax is not compatible with selectors, because they need to be
                    // bound at definition time due to underlying reselect passthru compatibility
                    // It also means queries aren't compatible with useSelector, which is kindof a huge bummer
                    if (!selectorCache) {
                        const dependencyKeys = Object.keys(configuration.dependencies);
                        const dependencyValues = dependencyKeys.map((i) => configuration.dependencies[i].materialize(_dispatch, getState));
                        const remappedInner = (...args) => inner(dependencyKeys.reduce((out, i, index) => (Object.assign(Object.assign({}, out), { [i]: args[index] })), {}));
                        selectorCache = createSelector(dependencyValues, remappedInner);
                    }
                    selector(getState());
                },
                inner,
            };
        },
    };
    return builderInstance;
};
export const createQuery = () => makeQuery({});
