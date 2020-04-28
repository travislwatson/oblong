import { useSelector, useStore } from 'react-redux';
import * as React from 'react';
let displayNameIncrementor = 0;
const makeView = (initialDependencies) => {
    const configuration = {
        dependencies: initialDependencies,
        displayName: `UnknownView${displayNameIncrementor}`,
        trace: false,
    };
    // TODO type this : ViewBuilder<TDependencies>
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
            const dependencyKeys = Object.keys(configuration.dependencies);
            const output = ((props) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const { dispatch, getState } = useStore();
                const boundDependencies = {};
                for (const key of dependencyKeys) {
                    const dependency = configuration.dependencies[key];
                    switch (dependency.oblongType) {
                        case 'command':
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            boundDependencies[key] = React.useCallback(dependency.materialize(dispatch, getState), [dispatch, getState]);
                            break;
                        case 'query':
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            boundDependencies[key] = useSelector(dependency.selector);
                            break;
                        case 'state':
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const currentValue = useSelector(dependency.query.selector);
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const setter = React.useCallback(dependency.command.materialize(dispatch, getState), [dispatch, getState]);
                            Object.defineProperty(boundDependencies, key, {
                                enumerable: true,
                                get: () => currentValue,
                                set: (newValue) => {
                                    console.log({ newValue });
                                    setter(newValue);
                                },
                            });
                            break;
                        default:
                            throw new Error('Unknown dependency provided to Oblong view');
                    }
                }
                Object.assign(boundDependencies, props);
                return inner(boundDependencies);
            });
            output.inner = inner;
            return output;
        },
    };
    // TODO This shimmy is due to not being able to get the `as` signature right above
    return builderInstance;
};
export const createView = () => makeView({});
