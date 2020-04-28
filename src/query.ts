import { OblongQuery, Unmaterialized } from './common'
import { createSelector } from 'reselect'

interface QueryConfiguration<TDependencies> {
  dependencies: Unmaterialized<TDependencies>
}

export interface QueryBuilder<TDependencies> {
  with: <TNewDependencies>(
    dependencies: Unmaterialized<TNewDependencies>
  ) => QueryBuilder<TNewDependencies>
  as: <TOutput>(
    inner: (dependencies: TDependencies) => TOutput
  ) => OblongQuery<TDependencies, TOutput>
}

const makeQuery = <TDependencies>(
  initialDependencies: Unmaterialized<TDependencies>
) => {
  const configuration: QueryConfiguration<TDependencies> = {
    dependencies: initialDependencies,
  }

  const builderInstance: QueryBuilder<TDependencies> = {
    with: <TNewDependencies>(
      dependencies: Unmaterialized<TNewDependencies>
    ) => {
      // TODO, this type dance feels icky, but the types are good. Maybe is ok? Maybe need better way?
      configuration.dependencies = dependencies as any
      return (builderInstance as unknown) as QueryBuilder<TNewDependencies>
    },
    as: <TOutput>(inner: (dependencies: TDependencies) => TOutput) => {
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
