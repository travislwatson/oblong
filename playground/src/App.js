import React from 'react'
import { OblongApp, O } from 'oblong'

const name = O.createState().withDefault('John Doe').as('user.name')
const hasBeenGreeted = O.createState().withDefault(false).as('hasBeenGreeted')

const firstName = O.createQuery()
  .with({ name })
  .as((o) => o.name.split(' ')[0])

const greet = O.createCommand()
  .with({ firstName, hasBeenGreeted })
  .as((o) => {
    alert(`Hello ${o.firstName}`)
    o.hasBeenGreeted = true
  })

const Profile = O.createView()
  .with({ name, firstName, hasBeenGreeted, greet })
  .as((o) => (
    <div>
      <h2>Profile for {o.firstName}</h2>
      <label>
        Name:
        <input
          type="text"
          value={o.name}
          onChange={(event) => {
            o.name = event.target.value
          }}
        />
      </label>
      {!o.hasBeenGreeted && (
        <div>
          <button onClick={o.greet}>Greet</button>
        </div>
      )}
    </div>
  ))

export const App = () => (
  <OblongApp>
    <Profile />
  </OblongApp>
)
