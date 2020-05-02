import React from 'react'
import { O } from 'oblong'

const age = O.createState().withDefault<number>(0).as('user.age')

const profile = O.createState()
  .withDefault({ name: 'John Doe' })
  .as('user.profile')

const firstName = O.createQuery()
  .with({ profile })
  .as((o) => o.profile.name.split(' ')[0])

const flipCase = O.createCommand()
  .with({ profile })
  .as<[boolean], void>((o) => {
    const [upper] = o.args

    o.profile = {
      ...o.profile,
      name: o.profile.name[o.args[0] ? 'toUpperCase' : 'toLowerCase'](),
    }
  })

const Profile = O.createView()
  .with({ profile, flipCase, age })
  .as((o) => (
    <>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={o.profile.name}
            onChange={(e) => {
              o.profile = {
                ...o.profile,
                name: e.target.value,
              }
            }}
          />
        </label>
        <button type="button" onClick={() => o.flipCase(true)}>
          Upper
        </button>
        <button type="button" onClick={() => o.flipCase(false)}>
          Lower
        </button>
      </div>
      <div>
        <label>
          Age:
          <input
            type="text"
            value={o.age}
            onChange={(e) => {
              o.age = parseInt(e.target.value) || 0
            }}
          />
        </label>
      </div>
    </>
  ))

const Greeter = O.createView()
  .with({ firstName })
  .as((o) => <h2>Hello, {o.firstName}</h2>)

export const App = () => (
  <>
    <h1>Playground</h1>
    <Greeter />
    <Profile />
  </>
)
