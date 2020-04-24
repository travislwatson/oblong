import React, { useCallback, useMemo } from 'react'
import { OblongApp, O } from 'oblong'
import { useStore, useSelector } from 'react-redux'

const { query: nameQuery, command: nameCommand } = O.createState()
  .withDefault('John Doe')
  .as('user.profile.name')

const makeUpperCaseCommand = O.createCommand()
  .with({ nameQuery, nameCommand })
  .as((o) => {
    console.log(`Before: ${o.nameQuery}`)
    o.nameCommand(o.nameQuery?.toUpperCase() ?? 'BOOM')
    console.log(`After: ${o.nameQuery}`)
  })

const Greeter = () => {
  const { dispatch, getState } = useStore()
  const name = useSelector(nameQuery)
  const setName = useMemo(() => nameCommand(dispatch, getState), [
    dispatch,
    getState,
  ])
  const onChangeName = useCallback((e) => setName(e.target.value), [setName])
  const makeUpperCase = useMemo(
    () => makeUpperCaseCommand(dispatch, getState),
    [dispatch, getState]
  )

  return (
    <>
      <div>Name: {name}</div>
      <div>
        <input type="text" value={name} onChange={onChangeName} />
      </div>
      <div>
        <button type="button" onClick={makeUpperCase}>
          Make Upper Case
        </button>
      </div>
    </>
  )
}

export const App = () => (
  <OblongApp>
    <h1>Hello world</h1>
    <Greeter />
  </OblongApp>
)
