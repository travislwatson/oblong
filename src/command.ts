import { OblongCommand, Unmaterialized, Dependency } from './common'

// Look here: https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-inference-in-conditional-types
// The second example there with nested conditional types and `infer` MIGHT be what we need to get command signature correct

// type Test<T> = T extends Dependency<
//   (a: infer TA, b: infer TB, c: infer TC) => infer TOut
// >
//   ? (a: TA, b: TB, c: TC) => TOut
//   : T extends Dependency<(a: infer TA, b: infer TB) => infer TOut>
//   ? (a: TA, b: TB) => TOut
//   : T extends Dependency<(a: infer TA) => infer TOut>
//   ? (a: TA) => TOut
//   : (...args: any[]) => any

// const unwrap = <T>(input: T): Test<T> => {
//   return 0 as any
// }

// const test = <TIn1, TOut>(input: Dependency<(arg1: string) => number>) => {
//   const a = unwrap(input)
//   // this should work... sigh
//   const aOut = a('blah')
// }

interface Config<TDep> {
  dependencies: Unmaterialized<TDep>
}

export interface CommandBuilder<TDep> {
  with: <TNewDep>(
    dependencies: Unmaterialized<TNewDep>
  ) => CommandBuilder<TNewDep>
  as: (
    inner: (dependencies: TDep & { args: any[] }) => any
  ) => OblongCommand<TDep>
}

const makeCommand = <TDep>(initialDependencies: Unmaterialized<TDep>) => {
  const configuration: Config<TDep> = {
    dependencies: initialDependencies,
  }

  // TODO type this : CommandBuilder<TDependencies>
  const builderInstance = {
    with: <TNewDep>(dependencies: Unmaterialized<TNewDep>) => {
      // TODO, this type dance feels icky, but the types are good. Maybe is ok? Maybe need better way?
      configuration.dependencies = dependencies as any
      return (builderInstance as unknown) as CommandBuilder<TNewDep>
    },
    // I don't know how to define this...
    // Is this related? https://github.com/microsoft/TypeScript/issues/5453
    as: (inner) => {
      return {
        oblongType: 'command',
        materialize: (dispatch: (action: any) => void, getState: () => any) => {
          const boundDependencies = {} as TDep

          for (const key in configuration.dependencies) {
            const dependency = configuration.dependencies[key]

            switch (dependency.oblongType) {
              case 'command':
                boundDependencies[key] = dependency.materialize(
                  dispatch,
                  getState
                )
                break
              case 'query':
                Object.defineProperty(boundDependencies, key, {
                  enumerable: true,
                  get: () => (dependency as any).selector(getState()),
                })
                break
              case 'state':
                Object.defineProperty(boundDependencies, key, {
                  enumerable: true,
                  get: () => (dependency as any).query.selector(getState()),
                  set: (dependency as any).command.materialize(
                    dispatch,
                    getState
                  ),
                })
                break
              default:
                throw new Error('Unknown dependency provided to Oblong view')
            }
          }

          return (...args) => {
            ;(boundDependencies as any).args = args
            return inner(boundDependencies)
          }
        },
        inner,
      }
    },
  }

  // TODO This shimmy is due to not being able to get the `as` signature right above
  return (builderInstance as unknown) as CommandBuilder<TDep>
}

export const createCommand = () => makeCommand({})
