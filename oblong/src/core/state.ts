import { Selector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { State, isQueryable, Queryable } from '../internals/types'
import { deepFreezeDev } from '../utils/deepFreeze'
import { makeLocatorSelector } from '../internals/makeLocatorSelector'
import { makeLocatorActionCreator } from '../internals/makeLocatorActionCreator'

type EqualityChecker<T> = (from: T, to: T) => boolean
const equalityFns = {
  exact: ((a, b) => a === b) as EqualityChecker<any>,
  never: (() => false) as EqualityChecker<any>,
  shallow: shallowEqual as EqualityChecker<any>,
  // TODO maybe support deep?
}
type EqualityFn<T> = keyof typeof equalityFns | EqualityChecker<T>

type DefaultValue<T> = T | Queryable<T>

let id = 0
const makeState = <T>(
  locator: string = `~${id++}`,
  equality: EqualityFn<T>,
  defaultValue: DefaultValue<T>
): State<T> => {
  const equalityFn = (
    typeof equality === 'function'
      ? equality
      : equalityFns[equality] ?? equalityFns.exact
  ) as EqualityChecker<T>

  const actionCreator = makeLocatorActionCreator<T>(locator)

  const selector = makeLocatorSelector(
    locator,
    (defaultValue as Queryable<T>)?.selector ?? defaultValue
  ) as Selector<any, T>

  return {
    [isQueryable]: true,
    selector,
    actionCreator,
    resolve: (store) => ({
      get: () => selector(store.getState()),
      set: (newValue: T) => {
        if (equalityFn(selector(store.getState()), newValue)) return

        deepFreezeDev(newValue)

        store.dispatch(actionCreator(newValue))
      },
    }),
  }
}

export class StateBuilder<TState> {
  private equalityFn: EqualityFn<TState>
  private locator: string

  constructor(locator: string) {
    this.locator = locator
  }

  setEquality(newEqualityFn: EqualityFn<TState>) {
    this.equalityFn = newEqualityFn

    return this as Omit<this, 'setEquality'>
  }

  as<TDefault extends TState>(
    defaultValue: unknown extends TState
      ? TDefault | Queryable<TDefault>
      : TState | Queryable<TState>
  ) {
    return makeState<unknown extends TState ? TDefault : TState>(
      this.locator,
      this.equalityFn,
      defaultValue as any
    )
  }
}

export const state = <T>(locator?: string) => new StateBuilder<T>(locator)
