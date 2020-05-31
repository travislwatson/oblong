import { Queryable, isQueryable, Injectable } from '../foundation/types'
import { Selector } from 'reselect'

export const fromSelector = <TOut>(
  selector: Selector<any, TOut>
): Injectable<TOut> & Queryable<TOut> => ({
  selector,
  [isQueryable]: true,
  resolve: (store) => ({
    get: () => selector(store.getState()),
  }),
})
