import { Command, Dependencies, CommandArgs, Injectable } from './coreTypes'

export interface CommandBuilder<TDep> {
  with: <TNewDep>(
    dependencies: Dependencies<TNewDep>
  ) => CommandBuilder<TNewDep>
  as: <TArgs extends any[], TOut>(
    inner: (dependencies: CommandArgs<TDep, TArgs>) => TOut
  ) => Command<TDep, TArgs, TOut>
}

export const createCommand = <TDep>() => {
  let deps = {} as Dependencies<TDep>

  const instance: CommandBuilder<TDep> = {
    with: <TNewDep>(dependencies: Dependencies<TNewDep>) => {
      deps = dependencies as any
      return (instance as unknown) as CommandBuilder<TNewDep>
    },
    as: <TArgs extends any[], TOut>(
      inner: (dependencies: CommandArgs<TDep, TArgs>) => TOut
    ) => {
      const dependencyKeys = Object.keys(deps)

      return {
        inner,
        resolve: (store) => ({
          get: () => (...args: TArgs) => {
            const boundDependencies = {} as TDep & { args: TArgs }

            const propertyDescriptors = dependencyKeys.reduce(
              (out, i) => ({
                ...out,
                [i]: (deps[i] as Injectable<any>).resolve(store),
              }),
              {}
            )

            Object.defineProperties(boundDependencies, propertyDescriptors)

            boundDependencies.args = args

            return inner(boundDependencies)
          },
          set: () => {
            throw new Error(`Cannot assign to command.`)
          },
        }),
      }
    },
  }

  return instance
}
