import { OblongQuery, Unmaterialized } from './common'
import { createSelector } from 'reselect'

interface Config<TDep> {
  dependencies: Unmaterialized<TDep>
}

export interface QueryBuilder<TDep> {
  with: <TNewDep>(
    dependencies: Unmaterialized<TNewDep>
  ) => QueryBuilder<TNewDep>
  as: <TOut>(inner: (dependencies: TDep) => TOut) => OblongQuery<TDep, TOut>
}

const makeQuery = <TDep>(initialDependencies: Unmaterialized<TDep>) => {
  const configuration: Config<TDep> = {
    dependencies: initialDependencies,
  }

  const builderInstance: QueryBuilder<TDep> = {
    with: <TNewDep>(dependencies: Unmaterialized<TNewDep>) => {
      // TODO, this type dance feels icky, but the types are good. Maybe is ok? Maybe need better way?
      configuration.dependencies = dependencies as any
      return (builderInstance as unknown) as QueryBuilder<TNewDep>
    },
    as: <TOut>(inner: (dependencies: TDep) => TOut) => {
      const dependencyKeys = Object.keys(configuration.dependencies)
      const dependencyValues = dependencyKeys.map((i) => {
        const dependency = configuration.dependencies[i]
        switch (dependency.oblongType) {
          case 'query':
            return dependency.selector
          case 'state':
            return dependency.query.selector
          default:
            throw new Error('Invalid dependency provided to Oblong view')
        }
      })

      const remappedInner = (...args) =>
        inner(
          dependencyKeys.reduce(
            (out, i, index) => ({ ...out, [i]: args[index] }),
            {}
          ) as any
        )

      const selector = createSelector(dependencyValues, remappedInner)

      return {
        oblongType: 'query',
        // TODO is this even necessary
        materialize: (dispatch: (action: any) => void, getState: () => any) =>
          selector(getState),
        inner,
        selector,
      }
    },
  }

  return builderInstance
}

export const createQuery = () => makeQuery({})
