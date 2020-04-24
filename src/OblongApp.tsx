import * as React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { makeReducer } from './makeReducer'

type Props = {
  children: React.ReactNode
}

const makeStore = () => {
  const middlewares = []
  const middleWareEnhancer = applyMiddleware(...middlewares)

  return createStore(makeReducer(), composeWithDevTools(middleWareEnhancer))
}

export const OblongApp: React.FC<Props> = ({ children }) => {
  const store = React.useMemo(makeStore, [])
  return <Provider store={store}>{children}</Provider>
}
