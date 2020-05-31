import { Injectable } from '../foundation/types'

export const fromActionCreator = <TArgs extends any[]>(
  actionCreator: (...args: TArgs) => any
): Injectable<(...args: TArgs) => void> => ({
  resolve: (store) => ({
    get: () => (...args) => store.dispatch(actionCreator(...args)),
  }),
})
