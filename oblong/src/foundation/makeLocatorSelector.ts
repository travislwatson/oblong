import { createSelector, Selector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { State, OblongState, isQueryable, Queryable } from './types'

const empty = {}
if (process.env.NODE_ENV !== 'production') Object.freeze(empty)

const rootSelector = (state) => state ?? empty

const selectorCache: { [key: string]: (state: any) => any } = {}

const getSelector = (parent: (state: any) => unknown, key: string, prop: string) => {
  if (!selectorCache.hasOwnProperty(key)) {
    selectorCache[key] = createSelector([parent], (parent) =>
      parent && parent.hasOwnProperty(prop) ? parent[prop] : undefined
    )
  }

  return selectorCache[key]
}

const nestingLocatorPattern = /^([a-z0-9_-]+\.)*([a-z0-9_-]+)$/i
const isNestingLocator = (locator) => nestingLocatorPattern.test(locator)

export const makeLocatorSelector = <TValue>(
  locator: string,
  defaultValue?: TValue | ((state?: any) => TValue)
): Selector<OblongState, TValue> => {
  const locatorParts = isNestingLocator(locator) ? locator.split('.') : ['?', locator]

  let iKey
  let iSelector = rootSelector
  for (const iPart of locatorParts) {
    iKey = iKey ? `${iKey}.${iPart}` : iPart
    iSelector = getSelector(iSelector, iKey, iPart)
  }

  return typeof defaultValue === 'function'
    ? createSelector(
        [iSelector, defaultValue as (state?: any) => TValue],
        (iSelector, defaultValue) => (typeof iSelector === 'undefined' ? defaultValue : iSelector)
      )
    : createSelector([iSelector], (iSelector) =>
        typeof iSelector === 'undefined' ? defaultValue : iSelector
      )
}
