import { createInternalState } from '../core/createState'
import { createSelector } from 'reselect'
import { asQueryable } from '../injectables/asQueryable'
import { OblongState } from '../core/types'

export const globallyLoading = createInternalState()
  .withDefault<{ [k: string]: number }>({})
  .as('loading.globallyLoading')

export const isLoading = asQueryable(
  createSelector([globallyLoading.selector], (globallyLoading) =>
    Object.keys(globallyLoading).some((i) => globallyLoading[i])
  )
)

export const createGlobalLoader = (commandId: string) => ({
  start: (store: OblongState) => {
    const current = globallyLoading.selector(store.getState())
    store.dispatch({
      type: `SET loading.globallyLoading`,
      meta: { isOblongInternal: true },
      payload: {
        ...current,
        [commandId]: (current[commandId] || 0) + 1,
      },
    })
  },
  stop: (store: OblongState) => {
    const current = globallyLoading.selector(store.getState())
    store.dispatch({
      type: `SET loading.globallyLoading`,
      meta: { isOblongInternal: true },
      payload: {
        ...current,
        [commandId]: current[commandId] - 1,
      },
    })
  },
})
