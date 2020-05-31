import { createSelector } from 'reselect'
import { fromSelector } from '../injectables/fromSelector'
import { createLoaderFactory } from './createLoaderFactory'

const empty = {}
const commandLoading = (state) => state?.oblong?.loading?.command ?? empty

export const isLoading = fromSelector(
  createSelector([commandLoading], (commandLoading) =>
    Object.keys(commandLoading).some((i) => commandLoading[i])
  )
)

export const createCommandLoader = createLoaderFactory(`command`)
