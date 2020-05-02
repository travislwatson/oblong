import * as React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom'
import { makeReducer } from './makeReducer'
import { OblongStore } from '../core/types'
import { RouteWatcher } from '../routing/RouteWatcher'
import { HistoryAttacher } from '../routing/HistoryAttacher'

type OblongConfigProps = BrowserRouterProps & {
  children: React.ReactNode
}

const makeStore = (): OblongStore => {
  const middlewares = []
  const middleWareEnhancer = applyMiddleware(...middlewares)

  const store = createStore(
    makeReducer(),
    composeWithDevTools(middleWareEnhancer)
  ) as Partial<OblongStore>

  return store as OblongStore
}

export const OblongApp: React.FC<OblongConfigProps> = React.memo((props) => (
  <Provider store={makeStore()}>
    <BrowserRouter {...props}>
      <>
        <RouteWatcher />
        <HistoryAttacher />
        {props.children}
      </>
    </BrowserRouter>
  </Provider>
))
