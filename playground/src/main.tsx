import React from 'react'
import ReactDOM from 'react-dom'
import { createApp } from 'oblong'
import { App } from './App'

const OblongApp = createApp()

ReactDOM.render(
  <React.StrictMode>
    <OblongApp>
      <App />
    </OblongApp>
  </React.StrictMode>,
  document.getElementById('root')
)
