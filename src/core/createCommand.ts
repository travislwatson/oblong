import { Command, Dependencies, CommandArgs, Injectable } from './types'
import { makeId } from '../utils/makeId'
import { createGlobalLoader } from '../loading/globalLoading'

export interface CommandBuilder<TDep> {
  with: <TNewDep>(dependencies: Dependencies<TNewDep>) => CommandBuilder<TNewDep>
  named: (name: string) => CommandBuilder<TDep>
  as: <TArgs extends any[], TOut>(
    inner: (dependencies: CommandArgs<TDep, TArgs>) => TOut
  ) => Command<TDep, TArgs, TOut>
}

export const createCommand = <TDep>() => {
  let deps = {} as Dependencies<TDep>
  let id = makeId()

  const instance: CommandBuilder<TDep> = {
    with: <TNewDep>(dependencies: Dependencies<TNewDep>) => {
      deps = dependencies as any
      return (instance as unknown) as CommandBuilder<TNewDep>
    },
    named: (name: string) => {
      id = name
      return instance
    },
    as: <TArgs extends any[], TOut>(inner: (dependencies: CommandArgs<TDep, TArgs>) => TOut) => {
      const dependencyKeys = Object.keys(deps)
      const { start, stop } = createGlobalLoader(id)

      return {
        inner,
        id,
        resolve: (store) => {
          const boundDependencies = {} as TDep & { args: TArgs }

          const propertyDescriptors = dependencyKeys.reduce(
            (out, i) => ({
              ...out,
              [i]: (deps[i] as Injectable<any>).resolve(store),
            }),
            {}
          )

          Object.defineProperties(boundDependencies, propertyDescriptors)
          // Todo delay loader so as not to be so chatty, especially for commands that aren't async
          const startLoader = () => {
            let isLoading = false
            let isStopped = false
            setTimeout(() => {
              if (isStopped) return
              isLoading = true
              start(store)
            }, 50)
            return () => {
              if (isLoading) stop(store)
              isStopped = true
            }
          }

          return {
            get: () => (...args: TArgs) => {
              store.dispatch({ type: `COMMAND ${id}` })
              boundDependencies.args = args

              const output = inner(boundDependencies) as any

              const stopLoader = startLoader()
              Promise.resolve(output).then(stopLoader, stopLoader)

              return output
            },
            set: () => {
              throw new Error(`Cannot assign to command.`)
            },
          }
        },
      }
    },
  }

  return instance
}
