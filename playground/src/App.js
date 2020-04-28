import React from 'react'
import { OblongApp, O } from 'oblong'

const profile = O.createState().withDefault().as()

const changeCase = O.createCommand()
  .with({ profile })
  .as((o) => {
    const up = o.args[0]

    o.profile = {
      ...o.profile,
      name: o.profile?.name[up ? 'toUpperCase' : 'toLowerCase']() ?? 'BOOM',
    }
  })

const firstName = O.createQuery()
  .with({ profile })
  .as((o) => o.profile?.name.split(' ')[0])

const Greeter = O.createView()
  .with({
    profile,
    changeCase,
    firstName,
  })
  .as((o) => (
    <>
      <div>Name: {o.profile?.name}</div>
      <div>First Name: {o.firstName}</div>
      <div>
        <input
          type="text"
          value={o.profile?.name}
          onChange={(e) => {
            o.profile = {
              ...o.profile,
              name: e.target.value,
            }
          }}
        />
      </div>
      <div>
        <button type="button" onClick={() => o.changeCase(true)}>
          Make Upper Case
        </button>
        <button type="button" onClick={() => o.changeCase(false)}>
          Make Lower Case
        </button>
      </div>
    </>
  ))

export const App = () => (
  <OblongApp>
    <h1>Hello world</h1>
    <Greeter />
  </OblongApp>
)
