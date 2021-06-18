import { Dispatch } from 'redux'
import { Injectable } from '../internals/types'

export const dispatch: Injectable<Dispatch> = {
  resolve: (store) => ({
    get() {
      return store.dispatch
    },
  }),
}
