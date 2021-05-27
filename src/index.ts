import * as React from 'react'
// Re-exporting common dependencies
export { React }

// Bootstrap
export { OblongApp } from './bootstrap/OblongApp'

// Core
export { command } from './core/command'
export { query } from './core/query'
export { state } from './core/state'
export { view } from './core/view'

// Types
export { Queryable, Injectable, isQueryable } from './foundation/types'

// Extras
export { isLoading } from './loading/commandLoading'
export { createLoader } from './loading/createLoader'
export { fromSelector } from './injectables/fromSelector'
export { fromActionCreator } from './injectables/fromActionCreator'
export { portableReducer } from './injectables/portableReducer'
export { hydrate } from './injectables/hydrate'
export { rootState } from './injectables/rootState'
export { globalErrorSink } from './errors/globalErrorSink'
export { createErrorSink } from './errors/createErrorSink'
export { OblongError } from './errors/OblongError'
export { makeEvent } from './foundation/makeEvent'
export { dispatch } from './injectables/dispatch'
export { getState } from './injectables/getState'
