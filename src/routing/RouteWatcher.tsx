import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { updateLocation } from './currentRoute'
import { O } from '../core/O'

export const RouteWatcher = O.view()
  .with({ updateLocation })
  .as(({ updateLocation }) => {
    const location = useLocation()
    React.useEffect(() => {
      // This could trigger a re-assignment, but the state diff-checking should short-circuit it
      updateLocation(location)
    }, [updateLocation, location])
    return null
  })
