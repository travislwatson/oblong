import * as React from 'react'
import { useStore, useSelector } from 'react-redux'
import {
  Dependencies,
  Injectable,
  View,
  OblongStore,
  isQueryable,
  Queryable,
} from '../internals/types'

const noop = () => {}
const makeView = <TDep extends {}, TProps>(
  name: string,
  deps: Dependencies<TDep>,
  inner: React.FC<TDep & TProps>
) => {
  deps = deps ?? ({} as any)

  if (name && !inner.name) {
    inner.displayName = name
  }

  const dependencyKeys = Object.keys(deps)
  const queryableDependencies = dependencyKeys
    .map((i) => deps[i])
    .filter((i) => i[isQueryable])
    .map((i) => (i as Queryable<any>).selector)

  let register = (store: OblongStore) => {
    Object.values(deps)
      .filter((i) => (i as Injectable<unknown>).register)
      .forEach((i) => {
        ;(i as Injectable<unknown>).register(store)
        // Registrations should only occur once
        delete (i as Injectable<unknown>).register
      })
    register = noop
  }

  const unmemoized = (props: TProps) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const store = useStore() as OblongStore
    register(store)

    // Even though the results of the selectors are not used,
    // the hook must be called to trigger view re-renders
    // eslint-disable-next-line react-hooks/rules-of-hooks
    queryableDependencies.forEach((i) => useSelector(i))

    const o = {} as TDep

    const propertyDescriptors = dependencyKeys.reduce(
      (out, i) => ({
        ...out,
        [i]: {
          enumerable: true,
          ...(deps[i] as Injectable<any>).resolve(store),
        },
      }),
      {}
    )

    Object.defineProperties(o, propertyDescriptors)
    Object.assign(o, props)

    return inner(o as TDep & TProps)
  }

  unmemoized.displayName =
    name || inner.name ? `${name || inner.name}View` : 'UnnamedView'

  const output = React.memo(unmemoized) as unknown as View<TDep, TProps>

  output.inner = inner

  return output
}

export class ViewBuilder {
  private name: string

  constructor(name: string) {
    this.name = name
  }

  with<TDep>(dependencies: Dependencies<TDep>) {
    return new ViewBuilderWithDependencies(this.name, dependencies)
  }

  as<TProps = unknown>(inner: React.FC<TProps>) {
    return makeView(this.name, {}, inner)
  }
}

export class ViewBuilderWithDependencies<TDep> {
  private name: string
  private dependencies: Dependencies<TDep>

  constructor(name: string, dependencies: Dependencies<TDep>) {
    this.name = name
    this.dependencies = dependencies
  }

  as<TProps = unknown>(inner: React.FC<TDep & TProps>) {
    return makeView<TDep, TProps>(this.name, this.dependencies, inner)
  }
}

export const view = (name?: string) => new ViewBuilder(name)
