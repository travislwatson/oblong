import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { useStore } from 'react-redux'
import { OblongStore } from '../foundation/types'

export const HistoryAttacher = () => {
  const history = useHistory()
  const store = useStore()
  React.useEffect(() => {
    ;(store as OblongStore).history = history
  }, [store, history])

  return null
}
