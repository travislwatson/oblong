import { createSelector, Selector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { State, OblongState, isQueryable } from './types'
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
  defaultValue: TValue,
  locator: string,
  internal: boolean
): Selector<OblongState, TValue> => {
  const isNestingLocator = nestingLocatorPattern.test(locator)

  if (!isNestingLocator)
    return createSelector([unorganized], (unorganized) =>
      unorganized.hasOwnProperty(locator) ? unorganized[locator] : defaultValue
    )

  const isNamespaced = locator.includes('.')

  if (!isNamespaced)
    return createSelector([internal ? oblong : app], (root) =>
      root.hasOwnProperty(locator) ? root[locator] : defaultValue
    )

  const namespacePropSplitLocation = locator.lastIndexOf('.')

  const namespace = locator.substr(0, namespacePropSplitLocation)
  const namespaceSelector = getNamespaceSelector(namespace, internal)
  const prop = locator.substr(namespacePropSplitLocation + 1)

  return createSelector([namespaceSelector], (namespaceSelector) =>
    namespaceSelector.hasOwnProperty(prop) ? namespaceSelector[prop] : defaultValue
  )
}

type EqualityFn<T> = 'exact' | 'shallow' | 'never' | ((oldValue: T, newValue: T) => boolean)

export interface StateBuilder<T> {
  withDefault: <TNew>(defaultValue: TNew) => StateBuilder<TNew>
  setEquality: (equality: EqualityFn<T>) => StateBuilder<T>
  as: (locator?: string) => State<T>
}

const equalityFns = {
  exact: (a, b) => a === b,
  never: () => false,
  shallow: shallowEqual,
  // TODO maybe support deep?
}

const builtinEqualityFns = Object.keys(equalityFns)

let id = 0
const createStateUnknown = <T>(internal: boolean) => {
  let def: T = undefined
  let equalityFn: (a: T, b: T) => boolean = equalityFns.exact

  const instance: StateBuilder<T> = {
    withDefault: <TNew>(defaultValue: TNew) => {
      if (process.env.NODE_ENV !== 'production') deepFreeze(defaultValue)
      def = defaultValue as any
      return (instance as unknown) as StateBuilder<TNew>
    },
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
    as: (locator: string = `?-${id++}`): State<T> => {
      const selector = makeSelector(def, locator, internal)
      const actionCreator = (payload: T) => ({
        type: `SET ${locator}`,
        meta: { [internal ? 'isOblongInternal' : 'isOblong']: true },
        payload,
      })

      return {
        [isQueryable]: true,
        selector,
        actionCreator,
        resolve: (store) => ({
          get: () => selector(store.getState()),
          set: (newValue) => {
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

export const createInternalState = () => createStateUnknown(true)
export const createState = () => createStateUnknown(false)
