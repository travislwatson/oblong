import { Event, OblongStore } from '../foundation/types'

export const makeEvent = <TArgs extends any[] = []>(name: string): Event<TArgs> => ({
  resolve: (store: OblongStore) => ({
    get() {
      return {
        emit: (...args: TArgs) => {
          store.dispatch({
            type: `>${name}`,
            meta: { oblong: { isEvent: true, eventName: name } },
            payload: args,
          })
        },
      }
    },
  }),
  name,
})
