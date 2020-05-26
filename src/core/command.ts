import { Command, Dependencies, CommandArgs, Injectable } from './types'
import { makeId } from '../utils/makeId'
import { createCommandLoader } from '../loading/commandLoading'

export interface CommandBuilder<TDep> {
  with: <TNewDep>(dependencies: Dependencies<TNewDep>) => CommandBuilder<TNewDep>
  ignoreLoading: () => CommandBuilder<TDep>
  as: <TArgs extends any[], TOut>(
    inner: (dependencies: CommandArgs<TDep, TArgs>) => TOut
  ) => Command<TDep, TArgs, TOut>
}

export const command = <TDep>(name?: string) => {
  let deps = {} as Dependencies<TDep>
  name = name ?? makeId()
  let ignoreLoading = false

  const instance: CommandBuilder<TDep> = {
    with: <TNewDep>(dependencies: Dependencies<TNewDep>) => {
      deps = dependencies as any
      return (instance as unknown) as CommandBuilder<TNewDep>
    },
    ignoreLoading: () => {
      ignoreLoading = true
      return instance
    },
    as: <TArgs extends any[], TOut>(inner: (dependencies: CommandArgs<TDep, TArgs>) => TOut) => {
      const dependencyKeys = Object.keys(deps)
      const loaderInjectable = createCommandLoader().named(name)
      let storeCache

      const bound = (...args: TArgs) => {
        const boundDependencies = {} as TDep & { args: TArgs }

        const propertyDescriptors = dependencyKeys.reduce(
          (out, i) => ({
            ...out,
            [i]: (deps[i] as Injectable<any>).resolve(storeCache),
          }),
          {}
        )

        const loader = loaderInjectable.resolve(storeCache)

        Object.defineProperties(boundDependencies, propertyDescriptors)

        storeCache.dispatch({ type: `${name}()` })
        boundDependencies.args = args

        const output = inner(boundDependencies) as any
        if (!ignoreLoading) {
          loader.get().track(async () => await Promise.resolve(output))
        }

        return output
      }

      return {
        inner,
        name,
        resolve: (store) => {
          storeCache = store
          return {
            get: () => bound,
          }
        },
      }
    },
  }

  return instance
}
