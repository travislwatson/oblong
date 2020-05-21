import * as React from 'react'
import { useStore, useSelector } from 'react-redux'
import { Dependencies, Injectable, View, OblongStore, isQueryable, Queryable } from './types'

export interface ViewBuilder<TDep> {
  with: <TNewDep>(dependencies: Dependencies<TNewDep>) => ViewBuilder<TNewDep>
  if: <TProps>(condition: (o: TDep & TProps) => boolean) => ViewBuilder<TDep>
  as: <TProps>(inner: React.FC<TDep & TProps>) => View<TDep, TProps>
}

const defaultCondition = () => true
export const createView = <TDep>() => {
  let deps = {} as Dependencies<TDep>
  let renderCondition: (o: any) => boolean = defaultCondition

  const instance: ViewBuilder<TDep> = {
    with: <TNewDep>(dependencies: Dependencies<TNewDep>) => {
      deps = dependencies as any
      return (instance as unknown) as ViewBuilder<TNewDep>
    },
    if: <TProps>(condition: (o: TDep & TProps) => boolean) => {
      renderCondition = condition
      return instance
    },
    as: <TProps = {}>(inner: React.FC<TDep & TProps>) => {
      const dependencyKeys = Object.keys(deps)
      const queryableDependencies = dependencyKeys
        .map((i) => deps[i])
        .filter((i) => i[isQueryable])
        .map((i) => (i as Queryable<any>).selector)

      const output = (React.memo((props: TProps) => {
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

        // TODO think about this. We can't conditionally call inner because if
        // it has hooks, then conditionally rendering changes hook execution
        const innerOutput = inner(boundDependencies as TDep & TProps)

        return renderCondition(boundDependencies) ? innerOutput : null
      }) as unknown) as View<TDep, TProps>

      output.inner = inner

      return output
    },
  }

  return instance
}
