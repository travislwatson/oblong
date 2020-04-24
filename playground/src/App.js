import React, { useCallback, useMemo } from 'react'
import { OblongApp, O } from 'oblong'
import { useStore, useSelector } from 'react-redux'

const { query: nameQuery, command: nameCommand } = O.createState()
  .withDefault('John Doe')
  .as('user.profile.name')

const Greeter = () => {
  const { dispatch, getState } = useStore()
  const name = useSelector(nameQuery)
  const setName = useMemo(() => nameCommand(dispatch, getState), [
    dispatch,
    getState,
  ])
  const onChangeName = useCallback((e) => setName(e.target.value), [setName])

  return (
    <>
      <div>Name: {name}</div>
      <input type="text" value={name} onChange={onChangeName} />
    </>
  )
}

export const App = () => (
  <OblongApp>
    <h1>Hello world</h1>
    <Greeter />
  </OblongApp>
)
