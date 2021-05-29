import { Reducer } from 'redux'
import { PortableReducer, isQueryable, OblongStore } from '../foundation/types'

const bannedLocations = ['oblong', 'app']
export const portableReducer = <TState>(
  location: string,
  reducer: Reducer<TState>
): PortableReducer<TState> => {
  let registeredStore: any = null
  if (bannedLocations.includes(location))
    throw new Error(`Cannot use this location for reducer: ${location}`)
  const selector = (state) => state?.[location]
  const resolve = (store: OblongStore) => {
    if (store !== registeredStore) {
      store.registerReducer(location, reducer)
      registeredStore = store
    }

    return {
      get: () => selector(store.getState()),
    }
  }
  return { location, reducer, selector, resolve, [isQueryable]: true }
}
