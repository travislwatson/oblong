import { createSelector } from 'reselect'
import { Action } from 'redux'
import { OblongCommandIn, OblongQuery } from './common'

/**
 * Idea just came to me. Because of how materialize works (passing in both dispatch and getState), we can support
 * two different syntaxes with state: one using destructuring like:
 *   const [name, setName] = useState('John Doe')
 * and another similar to mobX and react-easy-state's proxy usage (but it doesn't need proxy support, only properties support)
 *   view...as((o) => <input type="text" value={o.name} onChange={e => o.name = e.target.value}) />
 * Because it can be implemented as a get/set property on the o bound dependencies!
 * And unlike useRef, where setting the .current value doesn't trigger a re-render, this does! Because it's just a dispatch! neat.
 */

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
    return createSelector(
      [unorganized],
      (unorganized) => unorganized[locator] || defaultValue
    )

  const isNamespaced = locator.includes('.')

  if (!isNamespaced)
    return createSelector(
      [oblongSelector],
      (oblongSelector) => oblongSelector[locator] || defaultUnorganized
    )

  const namespacePropSplitLocation = locator.lastIndexOf('.')

  const namespace = locator.substr(0, namespacePropSplitLocation)
  const namespaceSelector = getNamespaceSelector(namespace)
  const prop = locator.substr(namespacePropSplitLocation + 1)

  return createSelector([namespaceSelector], (namespaceSelector) => {
    return namespaceSelector[prop] || defaultValue
  })
}

export class OblongState<TValue extends StateValue = undefined> {
  protected configuration: StateConfiguration<TValue>
  public cachedSelector: (state: any) => TValue

  constructor(newConfiguration: Partial<StateConfiguration<TValue>> = {}) {
    this.configuration = {
      ...defaultConfiguration,
      ...newConfiguration,
    }

    if (!this.configuration.locator)
      this.configuration.locator = `Unnamed State ${locatorIdIncrementor++}`

    this.cachedSelector = makeSelector(this.configuration)
  }

  public get query(): OblongQuery<{}, TValue> {
    if (!this.cachedSelector)
      this.cachedSelector = makeSelector(this.configuration)

    return {
      oblongType: 'query',
      materialize: (_dispatch, getState) => {
        console.log({ materializing: this.cachedSelector(getState()) })
        return this.cachedSelector(getState())
      },
      inner: ({}) => undefined as any,
    }
  }

  public get command(): OblongCommandIn<{}, TValue> {
    if (!this.cachedSelector)
      this.cachedSelector = makeSelector(this.configuration)

    return {
      oblongType: 'command',
      materialize: (dispatch, _getState) => (newValue: TValue) =>
        dispatch({
          type: `SET ${this.configuration.locator}`,
          meta: { isOblong: true },
          payload: newValue,
        }),
      inner: ({}) => undefined as any,
    }
  }

  // public command(
  //   dispatch: any,
  //   // TODO use query + getState support setSomething(oldValue => oldValue + 1)
  //   // TODO use Object.is to bail out of state updates
  //   getState: any
  // ): (newValue: TValue) => SetAction<TValue> {
  //   return (newValue: TValue) =>
  //     dispatch({
  //       type: `SET ${this.configuration.locator}`,
  //       meta: { isOblong: true },
  //       payload: newValue,
  //     })
  // }
}

// TODO figure out how to support array destructuring for [query, command]
export class OblongStateBuilder<
  TValue extends StateValue = undefined
> extends OblongState<TValue> {
  constructor(newConfiguration: Partial<StateConfiguration<TValue>> = {}) {
    super(newConfiguration)
  }

  public withDefault<TNewValue extends StateValue>(defaultValue: TNewValue) {
    return new OblongStateBuilder<TNewValue>({
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
