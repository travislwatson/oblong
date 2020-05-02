import * as React from 'react'
import { useStore, useSelector } from 'react-redux'
import {
  Dependencies,
  Injectable,
  View,
  OblongStore,
  isQueryable,
  Queryable,
} from './coreTypes'

export interface ViewBuilder<TDep> {
  with: <TNewDep>(dependencies: Dependencies<TNewDep>) => ViewBuilder<TNewDep>
  as: <TProps>(inner: React.FC<TDep & TProps>) => View<TDep, TProps>
}

export const createView = <TDep>() => {
  let deps = {} as Dependencies<TDep>

  const instance: ViewBuilder<TDep> = {
    with: <TNewDep>(dependencies: Dependencies<TNewDep>) => {
      deps = dependencies as any
      return (instance as unknown) as ViewBuilder<TNewDep>
    },
    as: <TProps = {}>(inner: React.FC<TDep & TProps>) => {
      const dependencyKeys = Object.keys(deps)
      const queryableDependencies = dependencyKeys
        .map((i) => deps[i])
        .filter((i) => i[isQueryable])
        .map((i) => (i as Queryable<any>).selector)

      const output = (props: TProps) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const store = useStore() as OblongStore

        // Even though the results of the selectors are not used,
        // the hook must be called to trigger view re-renders
        // eslint-disable-next-line react-hooks/rules-of-hooks
        queryableDependencies.forEach((i) => useSelector(i))

        const boundDependencies = {} as TDep

        const propertyDescriptors = dependencyKeys.reduce(
          (out, i) => ({
            ...out,
            [i]: (deps[i] as Injectable<any>).resolve(store),
          }),
          {}
        )

        Object.defineProperties(boundDependencies, propertyDescriptors)

        Object.assign(boundDependencies, props)

        return inner(boundDependencies as TDep & TProps)
      }

      output.inner = inner

      return output
    },
  }

  return instance
}
