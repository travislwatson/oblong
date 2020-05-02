import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { OblongApp } from 'oblong'

const target = document.createElement('div')
document.body.appendChild(target)

ReactDOM.render(
  <React.StrictMode>
    <OblongApp>
      <App />
    </OblongApp>
  </React.StrictMode>,
  target
)
