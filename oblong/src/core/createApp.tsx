import * as React from 'react'
import { Provider } from 'react-redux'
import { createStore, Reducer, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { autoReducer } from '../foundation/auto-reducer'

export type OblongConfig = {
  createStore: (reducer: Reducer<unknown, any>) => Store<unknown, any>
}

const defaults: OblongConfig = {
  createStore: (reducer) => createStore(reducer, composeWithDevTools()),
}

export const createApp = (config: OblongConfig = defaults): React.FC => {
  const actualConfig = {
    ...defaults,
    ...config,
  }

  const store = actualConfig.createStore(autoReducer)

  return React.memo((props) => (
    <Provider store={store}>
      <>{props.children}</>
    </Provider>
  ))
}
