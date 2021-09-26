import React from 'react'
import ReactDOM from 'react-dom'
import { createApp } from 'oblong'
import { App } from './App'

const OblongApp = createApp({
  otherReducers: {
    foo: (prev: number = 0, action: any) => prev + 1,
  },
  commandDebugLevel: 'redux-single',
})

ReactDOM.render(
  <React.StrictMode>
    <OblongApp>
      <App />
    </OblongApp>
  </React.StrictMode>,
  document.getElementById('root')
)
