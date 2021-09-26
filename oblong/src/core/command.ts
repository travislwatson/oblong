import {
  Command,
  Dependencies,
  CommandInner,
  Injectable,
  OblongStoreExtension,
  OblongStore,
} from '../internals/types'
import { makeId } from '../utils/makeId'

const makeCommand = <TDep, TArgs extends unknown[], TOut>(
  name: string,
  deps: Dependencies<TDep>,
  inner: CommandInner<TDep, TArgs, TOut>
): Command<TDep, TArgs, TOut> => {
  deps = deps ?? ({} as any)
  name = name ?? `?${makeId()}`

  const dependencyKeys = Object.keys(deps)
  let storeCache: OblongStore
  let logStart = () => {
    switch (storeCache.oblong.commandDebugLevel) {
      case 'none':
        break
      case 'redux-single':
        storeCache.dispatch({ type: `${name}()` })
        break
      case 'redux-detailed':
        storeCache.dispatch({ type: `${name}(...` })
        break
      case 'console':
        console.log(`${name}(...`)
        break
    }
  }
  let logEnd = () => {
    switch (storeCache.oblong.commandDebugLevel) {
      case 'none':
      case 'redux-single':
        break
      case 'redux-detailed':
        storeCache.dispatch({ type: `${name}(...)` })
        break
      case 'console':
        console.log(`${name}(...)`)
        break
    }
  }
  let logThen = () => {
    switch (storeCache.oblong.commandDebugLevel) {
      case 'none':
      case 'redux-single':
        break
      case 'redux-detailed':
        storeCache.dispatch({ type: `${name}.then()` })
        break
      case 'console':
        console.log(`${name}.then()`)
        break
    }
  }
  let logCatch = () => {
    switch (storeCache.oblong.commandDebugLevel) {
      case 'none':
      case 'redux-single':
        break
      case 'redux-detailed':
        storeCache.dispatch({ type: `${name}.catch()` })
        break
      case 'console':
        console.log(`${name}.catch()`)
        break
    }
  }

  const bound = (...args: TArgs) => {
    const boundDependencies = {} as TDep

    const propertyDescriptors = dependencyKeys.reduce(
      (out, i) => ({
        ...out,
        [i]: (deps[i] as Injectable<any>).resolve(storeCache),
      }),
      {}
    )

    Object.defineProperties(boundDependencies, propertyDescriptors)

    logStart()

    const output = inner(boundDependencies, ...args) as any

    if (output?.then) {
      output.then(logThen, logCatch)
    } else {
      logEnd()
    }

    return output
  }

  const command: Command<TDep, TArgs, TOut> = {
    inner,
    name,
    resolve: (store) => {
      storeCache = store

      return {
        get: () => bound,
      }
    },
  }

  return command
}

export class CommandBuilder {
  private name: string

  constructor(name: string) {
    this.name = name
  }

  with<TDep>(dependencies: Dependencies<TDep>) {
    return new CommandBuilderWithDependencies(this.name, dependencies)
  }

  as<TArgs extends unknown[], TOut>(inner: CommandInner<{}, TArgs, TOut>) {
    return makeCommand<{}, TArgs, TOut>(this.name, {}, inner)
  }
}

export class CommandBuilderWithDependencies<TDep> {
  private name: string
  private dependencies: Dependencies<TDep>

  constructor(name: string, dependencies: Dependencies<TDep>) {
    this.name = name
    this.dependencies = dependencies
  }

  as<TArgs extends unknown[], TOut>(inner: (o: TDep, ...args: TArgs) => TOut) {
    return makeCommand<TDep, TArgs, TOut>(this.name, this.dependencies, inner)
  }
}

export const command = (name?: string) => new CommandBuilder(name)
