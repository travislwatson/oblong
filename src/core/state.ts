import { createSelector, Selector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { State, OblongState, isQueryable, Queryable } from './types'
import { deepFreeze } from '../utils/deepFreeze'

declare var process: {
  env: {
    NODE_ENV: string
  }
}

const nestingLocatorPattern = /^([a-z0-9_-]+\.)*([a-z0-9_-]+)$/i

const empty = {}
if (process.env.NODE_ENV !== 'production') Object.freeze(empty)

const app = (state) => (state ? state.app : empty)
const oblong = (state) => (state ? state.oblong : empty)

const unorganized = createSelector([oblong], (oblong) => oblong.unorganized || empty)

const namespaceSelectorCache: { [key: string]: (state: any) => any } = {}
const internalNamespaceSelectorCache: {
  [key: string]: (state: any) => any
} = {}

const getNamespaceSelector = (namespace: string, internal: boolean) => {
  const namespaceCache = internal ? internalNamespaceSelectorCache : namespaceSelectorCache
  if (!namespaceCache.hasOwnProperty(namespace)) {
    const namespacePieces = namespace.split('.')

    // TODO revisit this and see if there's a faster way to do it
    // Maybe the new Function from string trick?
    // This selector needs to be very fast
    namespaceCache[namespace] = createSelector([internal ? oblong : app], (root) => {
      let currentStep = root
      for (const namespacePiece of namespacePieces) {
        currentStep = currentStep[namespacePiece] || empty
      }
      return currentStep
    })
  }

  return namespaceCache[namespace]
}

const makeSelector = <TValue>(
  defaultSelector: (state: any) => TValue,
  locator: string,
  internal: boolean
): Selector<OblongState, TValue> => {
  const isNestingLocator = nestingLocatorPattern.test(locator)

  if (!isNestingLocator)
    return createSelector([unorganized, defaultSelector], (unorganized, defaultValue) =>
      unorganized.hasOwnProperty(locator) ? unorganized[locator] : defaultValue
    )

  const isNamespaced = locator.includes('.')

  if (!isNamespaced)
    return createSelector([internal ? oblong : app, defaultSelector], (root, defaultValue) =>
      root.hasOwnProperty(locator) ? root[locator] : defaultValue
    )

  const namespacePropSplitLocation = locator.lastIndexOf('.')

  const namespace = locator.substr(0, namespacePropSplitLocation)
  const namespaceSelector = getNamespaceSelector(namespace, internal)
  const prop = locator.substr(namespacePropSplitLocation + 1)

  return createSelector([namespaceSelector, defaultSelector], (namespaceSelector, defaultValue) =>
    namespaceSelector.hasOwnProperty(prop) ? namespaceSelector[prop] : defaultValue
  )
}

type EqualityFn<T> = 'exact' | 'shallow' | 'never' | ((oldValue: T, newValue: T) => boolean)

export interface StateBuilder<T> {
  setEquality: (equality: EqualityFn<T>) => StateBuilder<T>
  as: <TNew = T>(defaultValue: TNew | Queryable<TNew>) => State<TNew>
}

const equalityFns = {
  exact: (a, b) => a === b,
  never: () => false,
  shallow: shallowEqual,
  // TODO maybe support deep?
}

const builtinEqualityFns = Object.keys(equalityFns)

// TODo change this to put the locator in the inital call createState(locator)
let id = 0
const createStateUnknown = <T>(internal: boolean, name: string = `?-${id++}`) => {
  let equalityFn: (a: any, b: any) => boolean = equalityFns.exact

  const instance: StateBuilder<T> = {
    setEquality: (equality) => {
      if (typeof equality === 'string' && builtinEqualityFns.indexOf(equality) > -1) {
        equalityFn = equalityFns[equality]
      } else if (typeof equality === 'function') {
        equalityFn = equality
      } else {
        throw new Error(
          `Equality must either be a function or one of: ${builtinEqualityFns.join(', ')}`
        )
      }
      return instance
    },
    as: <TNew = T>(defaultValue: TNew | Queryable<TNew>) => {
      let defaultSelector: (state: any) => TNew
      if (defaultValue?.[isQueryable]) {
        defaultSelector = (defaultValue as Queryable<TNew>).selector as any
      } else {
        if (process.env.NODE_ENV !== 'production') deepFreeze(defaultValue)
        defaultSelector = (() => defaultValue) as any
      }
      const actionCreator = (payload: TNew) => ({
        type: `${name}=`,
        meta: { [internal ? 'isOblongInternal' : 'isOblong']: true },
        payload,
      })

      const selector = makeSelector(defaultSelector, name, internal)

      return {
        [isQueryable]: true,
        selector,
        actionCreator,
        resolve: (store) => ({
          get: () => selector(store.getState()),
          set: (newValue: TNew) => {
            if (equalityFn(selector(store.getState()), newValue)) return

            if (process.env.NODE_ENV !== 'production') deepFreeze(newValue)

            store.dispatch(actionCreator(newValue))
          },
        }),
      }
    },
  }

  return instance
}

export const createInternalState = (name: string) => createStateUnknown(true, name)
export const state = (name?: string) => createStateUnknown(false, name)
