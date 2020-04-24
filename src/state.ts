import { createSelector } from 'reselect'
import { Action } from 'redux'

type StateValue = null | undefined | number | boolean | string | object | any[]

interface StateConfiguration<TValue extends StateValue> {
  defaultValue: TValue
  locator: string
}

interface SetAction<TValue> extends Action {
  meta: { isOblongSetter: true }
  payload: TValue
}

let locatorIdIncrementor = 0

const defaultUnorganized = {}
const unorganized = (state) =>
  (state && state.unorganized) || defaultUnorganized

const defaultConfiguration: StateConfiguration<undefined> = {
  defaultValue: undefined,
  locator: '',
}

const nestingLocatorPattern = /^([a-z_]+\.)*([a-z\_]+)$/i

const namespaceSelectorCache: { [key: string]: (state: any) => any } = {}
const emptyNamespace = {}
const getNamespaceSelector = (namespace: string) => {
  if (!namespaceSelectorCache.hasOwnProperty(namespace)) {
    const namespacePieces = namespace.split('.')

    // TODO revisit this and see if there's a faster way to do it
    // Maybe the new Function from string trick?
    // This selector needs to be very fast
    namespaceSelectorCache[namespace] = (state: any) => {
      if (!state) return emptyNamespace

      let currentStep = state
      for (const namespacePiece of namespacePieces) {
        currentStep = currentStep[namespacePiece] || emptyNamespace
      }
    }
  }

  return namespaceSelectorCache[namespace]
}
const makeSelector = <TValue extends StateValue>({
  defaultValue,
  locator,
}: StateConfiguration<TValue>) => {
  const isNestingLocator = nestingLocatorPattern.test(locator)

  if (!isNestingLocator)
    return createSelector(
      [unorganized],
      (unorganized) => unorganized[locator] || defaultValue
    )

  if (!locator.includes('.'))
    return (state: any): TValue =>
      (state && state[locator]) || defaultUnorganized

  const namespacePropSplitLocation = locator.lastIndexOf('.')

  const namespace = locator.substr(0, namespacePropSplitLocation)
  const namespaceSelector = getNamespaceSelector(namespace)
  const prop = locator.substr(namespacePropSplitLocation)

  return createSelector(
    [namespaceSelector],
    (namespaceSelector) => namespaceSelector[prop] || defaultValue
  )
}

// TODO figure out how to support array destructuring for [query, command]
export class OblongState<TValue extends StateValue = undefined> {
  private configuration: StateConfiguration<TValue>
  private cachedSelector: (state: any) => TValue

  constructor(newConfiguration: Partial<StateConfiguration<TValue>> = {}) {
    this.configuration = {
      ...defaultConfiguration,
      ...newConfiguration,
    }

    if (!this.configuration.locator)
      this.configuration.locator = `UNNAMED ${locatorIdIncrementor++}`

    this.query = this.query.bind(this)
    this.command = this.command.bind(this)
  }

  public query(state: any): TValue {
    if (!this.cachedSelector)
      this.cachedSelector = makeSelector(this.configuration)

    return this.cachedSelector(state)
  }

  public command(
    dispatch: any,
    // TODO use query + getState support setSomething(oldValue => oldValue + 1)
    // TODO use Object.is to bail out of state updates
    getState: any
  ): (newValue: TValue) => SetAction<TValue> {
    return (newValue: TValue) =>
      dispatch({
        type: `SET ${this.configuration.locator}`,
        meta: { isOblongSetter: true },
        payload: newValue,
      })
  }

  public withDefault<TNewValue extends StateValue>(defaultValue: TNewValue) {
    return new OblongState<TNewValue>({
      ...this.configuration,
      defaultValue,
    })
  }

  public as(locator: string) {
    return new OblongState<TValue>({
      ...this.configuration,
      locator,
    })
  }
}

export const createState = () => new OblongState()
