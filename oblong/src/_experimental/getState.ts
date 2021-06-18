import { Injectable } from '../internals/types'

export const getState: Injectable<() => unknown> = {
  resolve: (store) => ({
    get() {
      return store.getState
    },
  }),
}
