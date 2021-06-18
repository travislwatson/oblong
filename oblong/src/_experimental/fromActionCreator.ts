import { Injectable } from '../internals/types'

export const fromActionCreator = <TArgs extends unknown[]>(
  actionCreator: (...args: TArgs) => any
): Injectable<(...args: TArgs) => void> => ({
  resolve: (store) => ({
    get:
      () =>
      (...args) =>
        store.dispatch(actionCreator(...args)),
  }),
})
