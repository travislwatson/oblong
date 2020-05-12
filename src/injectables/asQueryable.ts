import { Queryable, isQueryable, Injectable } from '../core/types'
import { Selector } from 'reselect'

export const asQueryable = <TOut>(
  selector: Selector<any, TOut>
): Injectable<TOut> & Queryable<TOut> => ({
  selector,
  [isQueryable]: true,
  resolve: (store) => ({
    get: () => selector(store.getState()),
    set: () => {
      throw new Error(`Cannot assign to query.`)
    },
  }),
})
