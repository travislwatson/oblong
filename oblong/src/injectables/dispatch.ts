import { Dispatch } from 'redux'
import { Injectable } from '../foundation/types'

export const dispatch: Injectable<Dispatch> = {
  resolve: (store) => ({
    get() {
      return store.dispatch
    },
  }),
}
