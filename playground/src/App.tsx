import React from 'react'
import { O } from 'oblong'
import {
  dispatch,
  fromActionCreator,
  fromSelector,
  getState,
  hydrate,
  rootState,
} from 'oblong/dist/experimental'

const twoSeconds = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 2000)
  })
const twoSecondsFail = () =>
  new Promise((_, reject) => {
    setTimeout(reject, 2000)
  })

const defaultAge = fromSelector((o) => new Date().getDate())

const age = O.state('user.age').as(defaultAge)

const profile = O.state('user.profile')
  .setEquality('shallow')
  .as({ name: 'John Doe' })

const firstName = O.query()
  .with({ profile })
  .as((o) => o.profile.name.split(' ')[0])

const testQueryMutation = O.query()
  .with({ profile, age })
  .as((o) => ({ name: o.profile.name, age: o.age }))

const flipCase = O.command('flipCase')
  .with({ profile, age, testQueryMutation })
  .as<[boolean], void>((o) => {
    const [upper] = o.args

    o.profile = {
      ...o.profile,
      name: o.profile.name[upper ? 'toUpperCase' : 'toLowerCase'](),
    }

    o.age = 15
  })

const trySomething = O.command('trySomething')
  .with({})
  .as(async (o) => {
    if (Math.random() > 0.5) {
      await twoSeconds()
    } else {
      await twoSecondsFail()
    }
  })

const TrySomething = O.view('TrySomething')
  .with({ trySomething })
  .as((o) => (
    <div>
      <button onClick={o.trySomething}>Try Something</button>
    </div>
  ))

const Profile = O.view('Profile')
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

const Greeter = O.view('Greeter')
  .with({ firstName })
  .as((o) => {
    const [ignore] = React.useState()
    if (ignore) return null

    return <h2>Hello, {o.firstName}</h2>
  })

const doWeirdRaw = (name: string, age: number) => ({
  type: 'doWeird',
  payload: { name, age },
})
const doWeird = fromActionCreator(doWeirdRaw)
const DoWierdTest = O.view('DoWierdTest')
  .with({ doWeird })
  .as((o) => (
    <div>
      <button type="button" onClick={() => o.doWeird('john', 1)}>
        doWeird
      </button>
    </div>
  ))

const hydrateSet = O.command('hydrateSet')
  .with({ rootState })
  .as((o) => {
    sessionStorage.setItem('oblong.playground', JSON.stringify(o.rootState))
  })
const hydrateGet = O.command('hydrateGet')
  .with({ hydrate })
  .as((o) => {
    const stored = sessionStorage.getItem('oblong.playground')
    if (stored) {
      o.hydrate(JSON.parse(stored))
    }
  })
const Hydrate = O.view()
  .with({ hydrateGet, hydrateSet })
  .as(function Hydrate(o) {
    return (
      <div>
        Hydrate:
        <button onClick={o.hydrateSet}>Set</button>
        <button onClick={o.hydrateGet}>Get</button>
      </div>
    )
  })

export const App = () => (
  <>
    <h1>Playground</h1>
    <Greeter />
    <Profile />
    <TrySomething />
    <DoWierdTest />
    <Hydrate />
  </>
)
