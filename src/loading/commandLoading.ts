import { createSelector } from 'reselect'
import { asQueryable } from '../injectables/asQueryable'
import { createLoaderFactory } from './createLoaderFactory'

const empty = {}
const commandLoading = (state) => state?.oblong?.loading?.command ?? empty

export const isLoading = asQueryable(
  createSelector([commandLoading], (commandLoading) =>
    Object.keys(commandLoading).some((i) => commandLoading[i])
  )
)

export const createCommandLoader = createLoaderFactory(`loading.command`)
