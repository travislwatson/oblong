import { OblongCommand, Unmaterialized } from './common'

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
                  get: () => (dependency as any).query.selector(getState()),
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
