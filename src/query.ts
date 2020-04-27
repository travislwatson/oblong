import { OblongQuery, Unmaterialized } from './common'
import { createSelector } from 'reselect'

interface QueryConfiguration<TDependencies> {
  dependencies: Unmaterialized<TDependencies>
  displayName: string
  trace: boolean
}

export interface QueryBuilder<TDependencies> {
  with: <TNewDependencies>(
    dependencies: Unmaterialized<TNewDependencies>
  ) => QueryBuilder<TNewDependencies>
  displayName: (displayName: string) => QueryBuilder<TDependencies>
  trace: () => QueryBuilder<TDependencies>
  as: <TOutput>(
    inner: (dependencies: TDependencies) => TOutput
  ) => OblongQuery<TDependencies, TOutput>
}

let displayNameIncrementor = 0

const makeQuery = <TDependencies>(
  initialDependencies: Unmaterialized<TDependencies>
) => {
  const configuration: QueryConfiguration<TDependencies> = {
    dependencies: initialDependencies,
    displayName: `Unknown Query ${displayNameIncrementor}`,
    trace: false,
  }

  const selectorCache: any

  const builderInstance: QueryBuilder<TDependencies> = {
    with: <TNewDependencies>(
      dependencies: Unmaterialized<TNewDependencies>
    ) => {
      // TODO, this type dance feels icky, but the types are good. Maybe is ok? Maybe need better way?
      configuration.dependencies = dependencies as any
      return (builderInstance as unknown) as QueryBuilder<TNewDependencies>
    },
    displayName: (displayName: string) => {
      configuration.displayName = displayName
      return builderInstance
    },
    trace: () => {
      configuration.trace = true
      return builderInstance
    },
    as: <TOutput>(inner: (dependencies: TDependencies) => TOutput) => {
      return {
        oblongType: 'query',
        materialize: (
          _dispatch: (action: any) => void,
          getState: () => any
        ) => {
          // OKAY gotta stop for the night, but I've totally borked this.
          // The .materialize syntax is not compatible with selectors, because they need to be
          // bound at definition time due to underlying reselect passthru compatibility
          // It also means queries aren't compatible with useSelector, which is kindof a huge bummer
          if (!selectorCache) {
            const dependencyKeys = Object.keys(
              configuration.dependencies
            ) as (keyof TDependencies)[]
            const dependencyValues = dependencyKeys.map((i) =>
              configuration.dependencies[i].materialize(_dispatch, getState)
            )

            const remappedInner = (...args) =>
              inner(
                dependencyKeys.reduce(
                  (out, i, index) => ({ ...out, [i]: args[index] }),
                  {}
                ) as any
              )

            selectorCache = createSelector(dependencyValues, remappedInner)
          }
          selector(getState())
        },
        inner,
      }
    },
  }

  return builderInstance
}

export const createQuery = () => makeQuery({})
