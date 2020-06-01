import { state } from '../core/state'
import { ErrorSink, isQueryable } from '../foundation/types'

export const createErrorSink = (name: string): ErrorSink => {
  const errors = state(`oblong.errors.${name}`).as<string[]>([])

  const clear = (store) => store.dispatch(errors.actionCreator([]))
  const dismiss = (store, error: string) => {
    const existingErrors = errors.selector(store.getState())
    const newErrors = existingErrors.filter((i) => i !== error)
    store.dispatch(errors.actionCreator(newErrors))
  }
  const logError = (store, error: string | string[]) => {
    const existingErrors = errors.selector(store.getState())
    store.dispatch(
      errors.actionCreator([...existingErrors, ...(Array.isArray(error) ? error : [error])])
    )
  }

  return {
    [isQueryable]: true,
    resolve: (store) => ({
      get: () => ({
        clear: () => clear(store),
        dismiss: (error: string) => dismiss(store, error),
        errors: errors.selector(store.getState()),
        logError: (error: string | string[]) => logError(store, error),
      }),
    }),
    selector: errors.selector,
  }
}
