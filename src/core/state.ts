import { Selector } from 'reselect'
import { shallowEqual } from 'react-redux'
import { State, isQueryable, Queryable } from '../foundation/types'
import { deepFreeze } from '../utils/deepFreeze'
import { makeLocatorSelector } from '../foundation/makeLocatorSelector'

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
export const state = <T>(name: string = `~${id++}`) => {
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
      const actionCreator = (payload: TNew) => ({
        type: `${name}=`,
        meta: { oblong: { isSet: true, locator: name } },
        payload,
      })

      const selector = makeLocatorSelector(
        name,
        defaultValue?.[isQueryable] ? (defaultValue as Queryable<TNew>).selector : defaultValue
      ) as Selector<any, TNew>

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
