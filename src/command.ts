import { Dispatch } from 'redux'
import { OblongQuery } from './query'

interface CommandConfiguration<TDependencies, TOutput> {
  displayName: string
  dependencies: TDependencies
  // TODO figure out how to support statically typed args
  // TODO extras in o, like logError, or startLoader
  as: (o: TDependencies & { args: unknown[] }) => TOutput
}

let displayNameIncrementor = 0

const defaultConfiguration: CommandConfiguration<{}, void> = {
  displayName: '',
  dependencies: {},
  as: () => {},
}

export interface OblongCommand<TOutput> {
  (dispatch: Dispatch, getState: () => any): (...args: unknown[]) => TOutput
  oblongType: 'command'
}

export interface OblongCommandBuilder<TDependencies, TOutput>
  extends OblongCommand<TOutput> {
  configuration: CommandConfiguration<TDependencies, TOutput>
  withDisplayName: (
    displayName: string
  ) => OblongCommandBuilder<TDependencies, TOutput>
  with: <TNewDependencies>(
    dependencies: TNewDependencies
  ) => OblongCommandBuilder<TNewDependencies, TOutput>
  as: <TNewOutput>(
    as: (o: TDependencies & { args: unknown[] }) => TNewOutput
  ) => OblongCommandBuilder<TDependencies, TNewOutput>
}

const makeCommand = <TDependencies, TOutput>(
  configuration: CommandConfiguration<TDependencies, TOutput>
): OblongCommandBuilder<TDependencies, TOutput> => {
  const instance = (dispatch: Dispatch, getState: () => any) => {
    const boundDependencies = {}

    for (const prop of Object.keys(configuration.dependencies)) {
      const dependency: OblongCommand<any> | OblongQuery<any> =
        configuration.dependencies[prop]

      if (dependency.oblongType === 'command')
        Object.defineProperty(boundDependencies, prop, {
          enumerable: true,
          get: () => (dependency as OblongCommand<any>)(dispatch, getState),
        })
      if (dependency.oblongType === 'query')
        Object.defineProperty(boundDependencies, prop, {
          enumerable: true,
          get: () => (dependency as OblongQuery<any>)(getState()),
        })
    }

    return (...args) => {
      const o: any = Object.create(boundDependencies)
      o.args = args
      return configuration.as(o)
    }
  }

  instance.configuration = configuration

  instance.withDisplayName = (displayName: string) => {
    configuration.displayName = displayName
    return instance
  }

  instance.with = <TNewDependencies>(dependencies: TNewDependencies) => {
    // Ugh, feels dirty, but I think it's safe? alternative would be creating a new instance, not great
    configuration.dependencies = dependencies as any
    return (instance as unknown) as OblongCommandBuilder<
      TNewDependencies,
      TOutput
    >
  }

  instance.as = <TNewOutput>(
    as: (o: TDependencies & { args: unknown[] }) => TNewOutput
  ) => {
    // Ugh, feels dirty, but I think it's safe? alternative would be creating a new instance, not great
    configuration.as = as as any
    return (instance as unknown) as OblongCommandBuilder<
      TDependencies,
      TNewOutput
    >
  }

  // TODO is this necessary?
  instance.oblongType = 'command'

  return instance as OblongCommandBuilder<TDependencies, TOutput>
}

export const createCommand = () =>
  makeCommand({
    ...defaultConfiguration,
    displayName: `UNNAMED COMMAND ${displayNameIncrementor++}`,
  })

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
