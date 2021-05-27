import * as React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, Reducer } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { makeReducer } from '../foundation/makeReducer'
import { OblongStore, Command, Event } from '../foundation/types'
import { eventingMiddleware } from '../foundation/eventingMiddleware'
import { portableReducers } from '../foundation/portableReducers'
import { eventHandlers } from '../foundation/eventHandlers'

type OblongConfigProps = {
  children: React.ReactNode
}

const makeStore = (): OblongStore => {
  const middlewares = [eventingMiddleware]
  const middleWareEnhancer = applyMiddleware(...middlewares)

  const store = createStore(
    makeReducer(portableReducers),
    composeWithDevTools(middleWareEnhancer)
  ) as Partial<OblongStore>

  store.registerReducer = (location: string, reducer: Reducer) => {
    portableReducers[location] = reducer
    store.replaceReducer(makeReducer(portableReducers))
  }

  store.registerEventHandler = (event: Event, command: Command<any, [], any>) => {
    if (!eventHandlers.hasOwnProperty(event.name)) {
      eventHandlers[event.name] = []
    }

    eventHandlers[event.name].push(command)
  }

  return store as OblongStore
}

export const OblongApp: React.FC<OblongConfigProps> = React.memo((props) => (
  <Provider store={makeStore()}>
    <>{props.children}</>
  </Provider>
))
