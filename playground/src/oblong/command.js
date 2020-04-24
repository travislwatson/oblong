let displayNameIncrementor = 0;
const defaultConfiguration = {
    displayName: '',
    dependencies: {},
    as: () => { },
};
const makeCommand = (configuration) => {
    const instance = (dispatch, getState) => {
        const boundDependencies = {};
        for (const prop of Object.keys(configuration.dependencies)) {
            const dependency = configuration.dependencies[prop];
            if (dependency.oblongType === 'command')
                Object.defineProperty(boundDependencies, prop, {
                    enumerable: true,
                    get: () => dependency(dispatch, getState),
                });
            if (dependency.oblongType === 'query')
                Object.defineProperty(boundDependencies, prop, {
                    enumerable: true,
                    get: () => dependency(getState()),
                });
        }
        return (...args) => {
            const o = Object.create(boundDependencies);
            o.args = args;
            return configuration.as(o);
        };
    };
    instance.configuration = configuration;
    instance.withDisplayName = (displayName) => {
        configuration.displayName = displayName;
        return instance;
    };
    instance.with = (dependencies) => {
        // Ugh, feels dirty, but I think it's safe? alternative would be creating a new instance, not great
        configuration.dependencies = dependencies;
        return instance;
    };
    instance.as = (as) => {
        // Ugh, feels dirty, but I think it's safe? alternative would be creating a new instance, not great
        configuration.as = as;
        return instance;
    };
    // TODO is this necessary?
    instance.oblongType = 'command';
    return instance;
};
export const createCommand = () => makeCommand(Object.assign(Object.assign({}, defaultConfiguration), { displayName: `UNNAMED COMMAND ${displayNameIncrementor++}` }));
// export class OblongCommandBuilder<TDependencies, TOutput>
//   implements OblongCommand<TOutput> {
//   constructor() {
//     const instance: Partial<OblongCommandBuilder<TDependencies, TOutput>> = (
//       dispatch: Dispatch,
//       getState: () => any
//     ) => {
//       // TODO
//     }
//     return instance
//   }
// }
// TODO how in the world can I allow this type of crazy?
// This isn't doing what I want. I can't figure out how to get interface overloading working right
// type ZeroVoid = () => void
// type OneVoid = <TArg1>(TArg1) => void
// type TwoVoid = <TArg1, TArg2>(TArg1, TArg2) => void
// type ZeroReturn = <TReturn>() => TReturn
// type OneReturn = <TArg1, TReturn>(TArg1) => TReturn
// type TwoReturn = <TArg1, TArg2, TReturn>(TArg1, TArg2) => TReturn
// type AnyFunc = ZeroVoid | OneVoid | TwoVoid | ZeroReturn | OneReturn | TwoReturn
// export interface OblongCommand extends AnyFunc {
//   name: string
// }
// type Query = <TReturn>(state: any) => TReturn
// const myFunc = (q: Query) => {
//   return () => q(null)
// }
