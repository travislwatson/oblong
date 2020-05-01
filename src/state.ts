import { createSelector } from 'reselect'
import { OblongCommand, OblongQuery } from './common'

const empty = Object.freeze({})

const oblongSelector = (state) => (state ? state.oblong : empty)

type StateValue = null | undefined | number | boolean | string | object | any[]

interface Config<TVal extends StateValue> {
  defaultValue: TVal
  locator: string
}

let locatorIdIncrementor = 0

const unorganized = createSelector(
  [oblongSelector],
  (oblongSelector) => oblongSelector.unorganized || empty
)

const defaultConfiguration: Config<undefined> = {
  defaultValue: undefined,
  locator: '',
}

const nestingLocatorPattern = /^([a-z_]+\.)*([a-z_]+)$/i

const namespaceSelectorCache: { [key: string]: (state: any) => any } = {}

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
          currentStep = currentStep[namespacePiece] || empty
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
}: Config<TValue>) => {
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

export class OblongState<TValue extends StateValue = undefined> {
  protected configuration: Config<TValue>
  public cachedSelector: (state: any) => TValue
  public oblongType = 'state'

  constructor(newConfiguration: Partial<Config<TValue>> = {}) {
    this.configuration = {
      ...defaultConfiguration,
      ...newConfiguration,
    }

    if (!this.configuration.locator)
      this.configuration.locator = `?-${locatorIdIncrementor++}`
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
  TVal extends StateValue = undefined
> extends OblongState<TVal> {
  constructor(newConfiguration: Partial<Config<TVal>> = {}) {
    super(newConfiguration)
  }

  public withDefault<TNewVal extends StateValue>(defaultValue: TNewVal) {
    Object.freeze(defaultValue)
    return new OblongStateBuilder<typeof defaultValue>({
      ...this.configuration,
      defaultValue,
    })
  }

  public as(locator: string) {
    return new OblongStateBuilder<TVal>({
      ...this.configuration,
      locator,
    })
  }
}

export const createState = () => new OblongStateBuilder()
