import { Command, Dependencies, CommandArgs, Injectable } from '../foundation/types'
import { makeId } from '../utils/makeId'
import { createCommandLoader } from '../loading/commandLoading'
import { globalErrorSink } from '../errors/globalErrorSink'

const makeCommand = <TDep, TArgs extends unknown[], TOut>(
  name: string,
  deps: Dependencies<TDep>,
  ignoreLoading: boolean,
  ignoreErrors: boolean,
  inner: (dependencies: CommandArgs<TDep, TArgs>) => TOut
): Command<TDep, TArgs, TOut> => {
  deps = deps ?? ({} as any)
  name = name ?? `?${makeId()}`

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

    try {
      const output = inner(boundDependencies) as any

      if (!ignoreErrors && output?.catch) {
        output.catch((error) => {
          if (Array.isArray(error) || typeof error === 'string') {
            globalErrorSink.resolve(storeCache).get().logError(error)
          } else {
            globalErrorSink.resolve(storeCache).get().logError('An unknown error occurred.')
            console?.error?.(error)
          }
        })
      }

      if (!ignoreLoading) {
        loader.get().track(async () => await Promise.resolve(output))
      }

      return output
    } catch (e) {
      if (ignoreErrors) {
        throw e
      } else {
        console?.error?.(e)
        globalErrorSink.resolve(storeCache).get().logError('An unknown error occurred.')
      }
    }
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
}

export class CommandBuilder {
  private name: string

  constructor(name: string) {
    this.name = name
  }

  with<TDep>(dependencies: Dependencies<TDep>) {
    return new CommandBuilderWithDependencies(this.name, dependencies)
  }

  as<TArgs extends any[], TOut>(inner: (o: CommandArgs<{}, TArgs>) => TOut) {
    return makeCommand<{}, TArgs, TOut>(this.name, {}, false, false, inner)
  }
}

export class CommandBuilderWithDependencies<TDep> {
  private name: string
  private dependencies: Dependencies<TDep>
  private isIgnoringLoading: boolean
  private isIgnoringErrors: boolean

  constructor(name: string, dependencies: Dependencies<TDep>) {
    this.name = name
    this.dependencies = dependencies
  }

  ignoreLoading() {
    this.isIgnoringLoading = true
    return this as Omit<this, 'ignoreLoading'>
  }

  ignoreErrors() {
    this.isIgnoringErrors = true
    return this as Omit<this, 'ignoreErrors'>
  }

  as<TArgs extends any[], TOut>(inner: (o: CommandArgs<TDep, TArgs>) => TOut) {
    return makeCommand<TDep, TArgs, TOut>(
      this.name,
      this.dependencies,
      this.isIgnoringLoading,
      this.isIgnoringErrors,
      inner
    )
  }
}

export const command = (name?: string) => new CommandBuilder(name)
