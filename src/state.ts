import { createSelector, Selector } from 'reselect'
import { State, StateValue, OblongState, isQueryable } from './coreTypes'
import { deepFreeze } from './utils/deepFreeze'

declare var process: {
  env: {
    NODE_ENV: string
  }
}

const nestingLocatorPattern = /^([a-z_]+\.)*([a-z_]+)$/i

const empty = {}
if (process.env.NODE_ENV !== 'production') Object.freeze(empty)

const oblong = (state) => (state ? state.oblong : empty)
const unorganized = createSelector(
  [oblong],
  (oblong) => oblong.unorganized || empty
)

const namespaceSelectorCache: { [key: string]: (state: any) => any } = {}

const getNamespaceSelector = (namespace: string) => {
  if (!namespaceSelectorCache.hasOwnProperty(namespace)) {
    const namespacePieces = namespace.split('.')

    // TODO revisit this and see if there's a faster way to do it
    // Maybe the new Function from string trick?
    // This selector needs to be very fast
    namespaceSelectorCache[namespace] = createSelector(
      [oblong],
      (oblongSelector) => {
        let currentStep = oblongSelector
        for (const namespacePiece of namespacePieces) {
          currentStep = currentStep[namespacePiece] || empty
        }
        return currentStep
      }
    )
  }

  return namespaceSelectorCache[namespace]
}

const makeSelector = <TValue extends StateValue>(
  defaultValue: TValue,
  locator: string
): Selector<OblongState, TValue> => {
  const isNestingLocator = nestingLocatorPattern.test(locator)

  if (!isNestingLocator)
    return createSelector([unorganized], (unorganized) =>
      unorganized.hasOwnProperty(locator) ? unorganized[locator] : defaultValue
    )

  const isNamespaced = locator.includes('.')

  if (!isNamespaced)
    return createSelector([oblong], (oblongSelector) =>
      oblongSelector.hasOwnProperty(locator)
        ? oblongSelector[locator]
        : defaultValue
    )

  const namespacePropSplitLocation = locator.lastIndexOf('.')

  const namespace = locator.substr(0, namespacePropSplitLocation)
  const namespaceSelector = getNamespaceSelector(namespace)
  const prop = locator.substr(namespacePropSplitLocation + 1)

  return createSelector([namespaceSelector], (namespaceSelector) =>
    namespaceSelector.hasOwnProperty(prop)
      ? namespaceSelector[prop]
      : defaultValue
  )
}

export interface StateBuilder<T extends StateValue> {
  withDefault: <TNew extends StateValue>(
    defaultValue: TNew
  ) => StateBuilder<TNew>
  as: (locator: string) => State<T>
}

let id = 0
export const createState = <T extends StateValue>() => {
  let def: T = undefined

  const instance: StateBuilder<T> = {
    withDefault: <TNew extends StateValue>(defaultValue: TNew) => {
      if (process.env.NODE_ENV !== 'production') deepFreeze(defaultValue)
      def = defaultValue as any
      return (instance as unknown) as StateBuilder<TNew>
    },
    as: (locator: string = `?-${id++}`): State<T> => {
      const selector = makeSelector(def, locator)

      return {
        [isQueryable]: true,
        selector,
        resolve: (store) => ({
          get: () => selector(store.getState()),
          set: (newValue) => {
            // Skip the dispatch if it's guaranteed not to change anything
            if (newValue === selector(store.getState())) return

            if (process.env.NODE_ENV !== 'production') deepFreeze(newValue)

            store.dispatch({
              type: `SET ${locator}`,
              meta: { isOblong: true },
              payload: newValue,
            })
          },
        }),
      }
    },
  }

  return instance
}
