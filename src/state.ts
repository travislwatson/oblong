import { createSelector } from 'reselect'
import { Action } from 'redux'
import { OblongCommand, OblongQuery } from './common'

const defaultOblong = {}
const oblongSelector = (state) => (state ? state.oblong : defaultOblong)

type StateValue = null | undefined | number | boolean | string | object | any[]

interface StateConfiguration<TValue extends StateValue> {
  defaultValue: TValue
  locator: string
}

interface SetAction<TValue> extends Action {
  meta: { isOblong: true }
  payload: TValue
}

let locatorIdIncrementor = 0

const defaultUnorganized = {}
const unorganized = createSelector(
  [oblongSelector],
  (oblongSelector) => oblongSelector.unorganized || defaultUnorganized
)

const defaultConfiguration: StateConfiguration<undefined> = {
  defaultValue: undefined,
  locator: '',
}

const nestingLocatorPattern = /^([a-z_]+\.)*([a-z_]+)$/i

const namespaceSelectorCache: { [key: string]: (state: any) => any } = {}
const emptyNamespace = {}
const getNamespaceSelector = (namespace: string) => {
  if (!namespaceSelectorCache.hasOwnProperty(namespace)) {
    const namespacePieces = namespace.split('.')

    // TODO revisit this and see if there's a faster way to do it
    // Maybe the new Function from string trick?
    // This selector needs to be very fast
    namespaceSelectorCache[namespace] = createSelector(
      [oblongSelector],
      (oblongSelector) => {
        let currentStep = oblongSelector
        for (const namespacePiece of namespacePieces) {
          currentStep = currentStep[namespacePiece] || emptyNamespace
        }
        return currentStep
      }
    )
  }

  return namespaceSelectorCache[namespace]
}
const makeSelector = <TValue extends StateValue>({
  defaultValue,
  locator,
}: StateConfiguration<TValue>) => {
  const isNestingLocator = nestingLocatorPattern.test(locator)

  if (!isNestingLocator)
    return createSelector([unorganized], (unorganized) =>
      unorganized.hasOwnProperty(locator) ? unorganized[locator] : defaultValue
    )

  const isNamespaced = locator.includes('.')

  if (!isNamespaced)
    return createSelector([oblongSelector], (oblongSelector) =>
      oblongSelector.hasOwnProperty(locator)
        ? oblongSelector[locator]
        : defaultUnorganized
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

export class OblongState<TValue extends StateValue = undefined> {
  protected configuration: StateConfiguration<TValue>
  public cachedSelector: (state: any) => TValue
  public oblongType = 'state'

  constructor(newConfiguration: Partial<StateConfiguration<TValue>> = {}) {
    this.configuration = {
      ...defaultConfiguration,
      ...newConfiguration,
    }

    if (!this.configuration.locator)
      this.configuration.locator = `Unnamed State ${locatorIdIncrementor++}`
  }

  public get query(): OblongQuery<{}, TValue> {
    if (!this.cachedSelector)
      this.cachedSelector = makeSelector(this.configuration)

    return {
      oblongType: 'query',
      // This probably won't be used... is it required? Does materialize have to be on everything?
      materialize: (_dispatch, getState) => this.cachedSelector(getState()),
      inner: () => undefined as any,
      selector: this.cachedSelector,
    }
  }

  public get command(): OblongCommand<{}> {
    if (!this.cachedSelector)
      this.cachedSelector = makeSelector(this.configuration)

    return {
      oblongType: 'command',
      materialize: (dispatch, _getState) => (newValue: any) => {
        Object.freeze(newValue)
        return dispatch({
          type: `SET ${this.configuration.locator}`,
          meta: { isOblong: true },
          payload: newValue,
        })
      },
      inner: () => undefined as any,
    }
  }
}

// TODO figure out how to support array destructuring for [query, command]
export class OblongStateBuilder<
  TValue extends StateValue = undefined
> extends OblongState<TValue> {
  constructor(newConfiguration: Partial<StateConfiguration<TValue>> = {}) {
    super(newConfiguration)
  }

  public withDefault<TNewValue extends StateValue>(defaultValue: TNewValue) {
    Object.freeze(defaultValue)
    return new OblongStateBuilder<typeof defaultValue>({
      ...this.configuration,
      defaultValue,
    })
  }

  public as(locator: string) {
    return new OblongStateBuilder<TValue>({
      ...this.configuration,
      locator,
    })
  }
}

export const createState = () => new OblongStateBuilder()
