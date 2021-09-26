import * as React from 'react'
import { Provider } from 'react-redux'
import { createStore, Reducer, Store, ReducersMapObject } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { autoReducer, makeComplexAutoReducer } from '../internals/auto-reducer'
import { CommandDebugLevel, OblongStoreExtension } from '../internals/types'

export type OblongConfig = {
  createStore?: (reducer: Reducer<unknown, any>) => Store<unknown, any>
  otherReducers?: ReducersMapObject<any, any>
  commandDebugLevel?: CommandDebugLevel
}

const defaults: OblongConfig = {
  createStore: (reducer) => createStore(reducer, composeWithDevTools()),
  otherReducers: null,
  commandDebugLevel: 'none',
}

export const createApp = (config: OblongConfig = defaults): React.FC => {
  const actualConfig = {
    ...defaults,
    ...config,
  }

  const store = actualConfig.createStore(
    actualConfig.otherReducers
      ? makeComplexAutoReducer(actualConfig.otherReducers)
      : autoReducer
  )

  ;(store as any as { oblong: OblongStoreExtension }).oblong = {
    commandDebugLevel: actualConfig.commandDebugLevel,
  }

  return React.memo((props) => (
    <Provider store={store}>
      <>{props.children}</>
    </Provider>
  ))
}
