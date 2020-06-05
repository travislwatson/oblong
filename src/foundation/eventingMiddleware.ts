import { OblongStore } from '../foundation/types'
import { eventHandlers } from '../foundation/eventHandlers'

export const eventingMiddleware = (store: OblongStore) => (next: any) => (action: {
  meta?: {
    oblong?: {
      isEvent?: boolean
      eventName?: string
    }
  }
}) => {
  const isEvent = action?.meta?.oblong?.isEvent && action?.meta?.oblong?.eventName
  // TODO make this smarter, perhaps with a queue. Ideally it would all occur in a batch
  // Maybe even a safety check for infinite loops... like if it hits 100 subscribers, toss an error
  if (isEvent && eventHandlers?.hasOwnProperty(action.meta.oblong.eventName)) {
    setTimeout(() => {
      eventHandlers[action.meta.oblong.eventName]
        .map((unresolvedCommand) => unresolvedCommand.resolve(store).get())
        .forEach((command) => {
          command()
        })
    }, 0)
  }

  return next(action)
}
