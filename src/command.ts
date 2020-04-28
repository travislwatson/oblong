import {
  OblongCommand,
  OblongCommandIn,
  OblongCommandInIn,
  OblongCommandInInIn,
  OblongCommandInInInIn,
  OblongCommandInInInInOut,
  OblongCommandInInInOut,
  OblongCommandInInOut,
  OblongCommandInOut,
  OblongCommandOut,
  Unmaterialized,
} from './common'

interface CommandConfiguration<TDependencies> {
  dependencies: Unmaterialized<TDependencies>
  displayName: string
  trace: boolean
}

type CommandAs<TDependencies> = {
  (inner: (dependencies: TDependencies & { args: [] }) => void): OblongCommand<
    TDependencies
  >
  <TOut>(
    inner: (dependencies: TDependencies & { args: [] }) => TOut
  ): OblongCommandOut<TDependencies, TOut>
  <TIn1>(
    inner: (dependencies: TDependencies & { args: [TIn1] }) => void
  ): OblongCommandIn<TDependencies, TIn1>
  <TIn1, TOut>(
    inner: (dependencies: TDependencies & { args: [TIn1] }) => TOut
  ): OblongCommandInOut<TDependencies, TIn1, TOut>
  <TIn1, TIn2>(
    inner: (dependencies: TDependencies & { args: [TIn1, TIn2] }) => void
  ): OblongCommandInIn<TDependencies, TIn1, TIn2>
  <TIn1, TIn2, TOut>(
    inner: (dependencies: TDependencies & { args: [TIn1, TIn2] }) => TOut
  ): OblongCommandInInOut<TDependencies, TIn1, TIn2, TOut>
  <TIn1, TIn2, TIn3>(
    inner: (dependencies: TDependencies & { args: [TIn1, TIn2, TIn3] }) => void
  ): OblongCommandInInIn<TDependencies, TIn1, TIn2, TIn3>
  <TIn1, TIn2, TIn3, TOut>(
    inner: (dependencies: TDependencies & { args: [TIn1, TIn2, TIn3] }) => TOut
  ): OblongCommandInInInOut<TDependencies, TIn1, TIn2, TIn3, TOut>
  <TIn1, TIn2, TIn3, TIn4>(
    inner: (
      dependencies: TDependencies & { args: [TIn1, TIn2, TIn3, TIn4] }
    ) => void
  ): OblongCommandInInInIn<TDependencies, TIn1, TIn2, TIn3, TIn4>
  <TIn1, TIn2, TIn3, TIn4, TOut>(
    inner: (
      dependencies: TDependencies & { args: [TIn1, TIn2, TIn3, TIn4] }
    ) => TOut
  ): OblongCommandInInInInOut<TDependencies, TIn1, TIn2, TIn3, TIn4, TOut>
}

export interface CommandBuilder<TDependencies> {
  with: <TNewDependencies>(
    dependencies: Unmaterialized<TNewDependencies>
  ) => CommandBuilder<TNewDependencies>
  displayName: (displayName: string) => CommandBuilder<TDependencies>
  trace: () => CommandBuilder<TDependencies>
  as: CommandAs<TDependencies>
}

let displayNameIncrementor = 0

const makeCommand = <TDependencies>(
  initialDependencies: Unmaterialized<TDependencies>
) => {
  const configuration: CommandConfiguration<TDependencies> = {
    dependencies: initialDependencies,
    displayName: `Unknown Command ${displayNameIncrementor}`,
    trace: false,
  }

  // TODO type this : CommandBuilder<TDependencies>
  const builderInstance = {
    with: <TNewDependencies>(
      dependencies: Unmaterialized<TNewDependencies>
    ) => {
      // TODO, this type dance feels icky, but the types are good. Maybe is ok? Maybe need better way?
      configuration.dependencies = dependencies as any
      return (builderInstance as unknown) as CommandBuilder<TNewDependencies>
    },
    displayName: (displayName: string) => {
      configuration.displayName = displayName
      return builderInstance
    },
    trace: () => {
      configuration.trace = true
      return builderInstance
    },
    // I don't know how to define this...
    // Is this related? https://github.com/microsoft/TypeScript/issues/5453
    as: (inner) => {
      return {
        oblongType: 'command',
        materialize: (dispatch: (action: any) => void, getState: () => any) => {
          const boundDependencies = {} as TDependencies

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
  return (builderInstance as unknown) as CommandBuilder<TDependencies>
}

export const createCommand = () => makeCommand({})
