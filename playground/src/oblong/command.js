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
                                    get: () => dependency.materialize(dispatch, getState),
                                });
                                break;
                        }
                    }
                    return (...args) => inner(Object.assign(Object.assign({}, boundDependencies), { args }));
                },
                inner,
            };
        },
    };
    // TODO This shimmy is due to not being able to get the `as` signature right above
    return builderInstance;
};
// const defaultConfiguration: CommandConfiguration<{}, void> = {
//   displayName: '',
//   dependencies: {},
//   as: () => {},
// }
// export interface OblongCommand<TOutput> {
//   (dispatch: Dispatch, getState: () => any): (...args: unknown[]) => TOutput
//   oblongType: 'command'
// }
// export interface OblongCommandBuilder<TDependencies, TOutput>
//   extends OblongCommand<TOutput> {
//   configuration: CommandConfiguration<TDependencies, TOutput>
//   withDisplayName: (
//     displayName: string
//   ) => OblongCommandBuilder<TDependencies, TOutput>
//   with: <TNewDependencies>(
//     dependencies: TNewDependencies
//   ) => OblongCommandBuilder<TNewDependencies, TOutput>
//   as: <TNewOutput>(
//     as: (o: TDependencies & { args: unknown[] }) => TNewOutput
//   ) => OblongCommandBuilder<TDependencies, TNewOutput>
// }
// const makeCommand = <TDependencies, TOutput>(
//   configuration: CommandConfiguration<TDependencies, TOutput>
// ): OblongCommandBuilder<TDependencies, TOutput> => {
//   const instance = (dispatch: Dispatch, getState: () => any) => {
//     const boundDependencies = {}
//     for (const prop of Object.keys(configuration.dependencies)) {
//       const dependency: OblongCommand<any> | OblongQuery<any> =
//         configuration.dependencies[prop]
//       if (dependency.oblongType === 'command')
//         Object.defineProperty(boundDependencies, prop, {
//           enumerable: true,
//           get: () => (dependency as OblongCommand<any>)(dispatch, getState),
//         })
//       if (dependency.oblongType === 'query')
//         Object.defineProperty(boundDependencies, prop, {
//           enumerable: true,
//           get: () => (dependency as OblongQuery<any>)(getState()),
//         })
//     }
//     return (...args) => {
//       const o: any = Object.create(boundDependencies)
//       o.args = args
//       return configuration.as(o)
//     }
//   }
//   instance.configuration = configuration
//   instance.withDisplayName = (displayName: string) => {
//     configuration.displayName = displayName
//     return instance
//   }
//   instance.with = <TNewDependencies>(dependencies: TNewDependencies) => {
//     // Ugh, feels dirty, but I think it's safe? alternative would be creating a new instance, not great
//     configuration.dependencies = dependencies as any
//     return (instance as unknown) as OblongCommandBuilder<
//       TNewDependencies,
//       TOutput
//     >
//   }
//   instance.as = <TNewOutput>(
//     as: (o: TDependencies & { args: unknown[] }) => TNewOutput
//   ) => {
//     // Ugh, feels dirty, but I think it's safe? alternative would be creating a new instance, not great
//     configuration.as = as as any
//     return (instance as unknown) as OblongCommandBuilder<
//       TDependencies,
//       TNewOutput
//     >
//   }
//   // TODO is this necessary?
//   instance.oblongType = 'command'
//   return instance as OblongCommandBuilder<TDependencies, TOutput>
// }
export const createCommand = () => makeCommand({});
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
