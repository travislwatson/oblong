import React, { useCallback, useMemo } from 'react'
import { OblongApp, O } from 'oblong'
import { useStore, useSelector } from 'react-redux'

const {
  query: nameQuery,
  command: nameCommand,
  cachedSelector,
} = O.createState().withDefault('John Doe').as('user.profile.name')

const makeUpperCaseCommand = O.createCommand()
  .with({ nameQuery, nameCommand })
  .as((o) => {
    console.log(`Before: ${o.nameQuery}`)
    o.nameCommand(o.nameQuery?.toUpperCase() ?? 'BOOM')
    console.log(`After: ${o.nameQuery}`)
  })

const firstNameQuery = O.createQuery()
  .with({ name: nameQuery })
  .as((o) => o.name.split(' ')[0])

const Greeter = () => {
  const { dispatch, getState } = useStore()
  const name = nameQuery.materialize(dispatch, getState)
  const firstName = firstNameQuery.materialize(dispatch, getState)
  const setName = useMemo(() => nameCommand.materialize(dispatch, getState), [
    dispatch,
    getState,
  ])
  // no way to trigger a re-render yet... uh oh.
  const ignored = useSelector(cachedSelector)
  const onChangeName = useCallback((e) => setName(e.target.value), [setName])
  const makeUpperCase = useMemo(
    () => makeUpperCaseCommand.materialize(dispatch, getState),
    [dispatch, getState]
  )

  return (
    <>
      <div>Name: {name}</div>
      <div>First Name: {firstName}</div>
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
