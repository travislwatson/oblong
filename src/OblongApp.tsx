import * as React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

type Props = {
  children: React.ReactNode
}

const rootReducer = (state, action: any): any => {
  if (action.type === 'hello world') return { boom: true }
  return state
}

const makeStore = () => {
  const middlewares = []
  const middleWareEnhancer = applyMiddleware(...middlewares)

  return createStore(rootReducer, composeWithDevTools(middleWareEnhancer))
}

export const OblongApp: React.FC<Props> = ({ children }) => {
  const store = React.useMemo(makeStore, [])
  return <Provider store={store}>{children}</Provider>
}
