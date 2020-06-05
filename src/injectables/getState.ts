import { Injectable } from '../foundation/types'

export const getState: Injectable<() => unknown> = {
  resolve: (store) => ({
    get() {
      return store.getState
    },
  }),
}
