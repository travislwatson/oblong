import { Injectable } from '../core/types'

export const fromActionCreator = <TArgs extends any[]>(
  actionCreator: (...args: TArgs) => any
): Injectable<(...args: TArgs) => void> => ({
  resolve: (store) => ({
    get: () => (...args) => store.dispatch(actionCreator(...args)),
    set: () => {
      throw new Error(`Cannot assign to action creator.`)
    },
  }),
})
