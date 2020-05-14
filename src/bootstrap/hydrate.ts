import { Injectable } from '../core/types'
export const hydrate: Injectable<(state: any) => void> = {
  resolve: (store) => ({
    get: () => (state) => {
      store.dispatch({ type: 'HYDRATE', payload: state, meta: { isOblongHydrate: true } })
    },
    set: () => {
      throw new Error(`Cannot assign to hydrate.`)
    },
  }),
}
