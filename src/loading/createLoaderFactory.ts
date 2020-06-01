import { state } from '../core/state'
import { Loader } from '../foundation/types'
import { makeId } from '../utils/makeId'

// TODO make this configurable
const LOADER_DELAY = 50

export const createLoaderFactory = (location: string) => {
  const createLoadingState = (name: string) => state(`oblong.loading.${location}.${name}`).as(0)

  return (): Loader => {
    let id = makeId()

    let loadingCount = createLoadingState(id)

    const startLoader = (store) => {
      let isLoading = false
      let isStopped = false
      window.setTimeout(() => {
        if (isStopped) return
        isLoading = true
        const current = loadingCount.selector(store.getState())
        store.dispatch(loadingCount.actionCreator(current + 1))
      }, LOADER_DELAY)
      return () => {
        if (isLoading) {
          const current = loadingCount.selector(store.getState())
          store.dispatch(loadingCount.actionCreator(current - 1))
        }
        isStopped = true
      }
    }

    const output = {
      resolve: (store) => ({
        get: () => ({
          isLoading: !!loadingCount.selector(store.getState()),
          track: async <TOut>(asyncAction: () => Promise<TOut>) => {
            const stopLoader = startLoader(store)
            try {
              return await asyncAction()
            } catch (e) {
            } finally {
              stopLoader()
            }
          },
        }),
      }),
      named: (name: string) => {
        loadingCount = createLoadingState(name)
        return output
      },
    }

    return output
  }
}
