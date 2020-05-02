import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { OblongApp } from 'oblong'

const target = document.createElement('div')
document.body.appendChild(target)

ReactDOM.render(
  <React.StrictMode>
    <h6>Outside OblongApp</h6>
    <OblongApp>
      <h6>Outside App</h6>
      <App />
    </OblongApp>
  </React.StrictMode>,
  target
)
