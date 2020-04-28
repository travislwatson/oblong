let displayNameIncrementor = 0;
const makeCommand = (initialDependencies) => {
    const configuration = {
        dependencies: initialDependencies,
        displayName: `Unknown Command ${displayNameIncrementor}`,
        trace: false,
    };
    // TODO type this : CommandBuilder<TDependencies>
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
        // I don't know how to define this...
        // Is this related? https://github.com/microsoft/TypeScript/issues/5453
        as: (inner) => {
            return {
                oblongType: 'command',
                materialize: (dispatch, getState) => {
                    const boundDependencies = {};
                    for (const key in configuration.dependencies) {
                        const dependency = configuration.dependencies[key];
                        switch (dependency.oblongType) {
                            case 'command':
                                boundDependencies[key] = dependency.materialize(dispatch, getState);
                                break;
                            case 'query':
                                Object.defineProperty(boundDependencies, key, {
                                    enumerable: true,
                                    get: () => dependency.query.selector(getState()),
                                });
                                break;
                            case 'state':
                                Object.defineProperty(boundDependencies, key, {
                                    enumerable: true,
                                    get: () => dependency.query.selector(getState()),
                                    set: dependency.command.materialize(dispatch, getState),
                                });
                                break;
                            default:
                                throw new Error('Unknown dependency provided to Oblong view');
                        }
                    }
                    return (...args) => {
                        ;
                        boundDependencies.args = args;
                        return inner(boundDependencies);
                    };
                },
                inner,
            };
        },
    };
    // TODO This shimmy is due to not being able to get the `as` signature right above
    return builderInstance;
};
export const createCommand = () => makeCommand({});
