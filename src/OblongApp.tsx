import * as React from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

type Props = {
  children: React.ReactNode
}

const rootReducer = (state, action: any): any => {
  if (action.type === 'hello world') return { boom: true }
  return state
}

const store = createStore(rootReducer)

export const OblongApp: React.FC<Props> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}
