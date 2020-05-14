import * as React from 'react'
import { Link } from 'react-router-dom'
// Re-exporting common dependencies
export { React, Link }

// Bootstrap
export { OblongApp } from './bootstrap/OblongApp'

// Core
export { createCommand } from './core/createCommand'
export { createQuery } from './core/createQuery'
export { createState } from './core/createState'
export { createView } from './core/createView'
export { O } from './core/O'

// Extras
export { currentLocation } from './routing/currentRoute'
export { isLoading } from './loading/commandLoading'
export { createLoader } from './loading/createLoader'
export { asQueryable } from './injectables/asQueryable'
