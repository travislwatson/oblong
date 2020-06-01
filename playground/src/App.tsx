import {
  React,
  O,
  currentLocation,
  isLoading,
  fromSelector,
  createLoader,
  fromActionCreator,
  portableReducer,
  hydrate,
} from 'oblong'
import { Link } from 'react-router-dom'
import { testHydrateState } from './testHydrateState'

const twoSeconds = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 2000)
  })
const twoSecondsFail = () =>
  new Promise((_, reject) => {
    setTimeout(reject, 2000)
  })

const defaultAge = O.query()
  .with({ currentLocation })
  .as((o) => o.currentLocation.pathname.length)

const age = O.state('user.age').as<number>(defaultAge)

const profile = O.state('user.profile').setEquality('shallow').as({ name: 'John Doe' })

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

const Links = O.view('Links').as(() => (
  <div>
    <Link to="/apple">Apple</Link> | <Link to="/banana">Banana</Link>
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
      <Links />
    </>
  ))

const Greeter = O.view('Greeter')
  .with({ firstName })
  .if((o) => !!o.firstName)
  .as((o) => {
    const [ignore] = React.useState()
    if (ignore) return null

    return <h2>Hello, {o.firstName}</h2>
  })

const LocationViewer = O.view('LocationViewer')
  .with({ currentLocation })
  .as((o) => <div>{JSON.stringify(o.currentLocation)}</div>)

const isOnBananaRoute = O.query()
  .with({ currentLocation })
  .as((o) => o.currentLocation.pathname === '/banana')

const BananaRoute = O.view('BananaRoute')
  .with({ isOnBananaRoute })
  .as((o) => {
    if (!o.isOnBananaRoute) return null
    return <h4>BANANA TIME</h4>
  })

const doGoodSlow = O.command('doGoodSlow').as(async () => {
  await twoSeconds()
})

const doBadSlow = O.command('doBadSlow').as(async () => {
  await twoSecondsFail()
})

const withoutLoader = O.command('withoutLoader')
  .with({})
  .ignoreLoading()
  .as(async () => {
    await twoSeconds()
  })

const namedLoader = createLoader().named('namedLoader')

const withNamedLoader = O.command('withNamedLoader')
  .with({ namedLoader })
  .ignoreLoading()
  .as(async (o) => {
    await o.namedLoader.track(async () => {
      await twoSeconds()
    })
  })

const loaderState = fromSelector((state) => JSON.stringify(state?.oblong?.loading, undefined, 1))

const LoaderTest = O.view('LoaderTest')
  .with({
    isLoading,
    doGoodSlow,
    doBadSlow,
    loaderState,
    withoutLoader,
    withNamedLoader,
    namedLoader,
  })
  .as<{ user: { name: string } }>((o) => (
    <div>
      <h4>LoaderTest</h4>
      <div>Is Global Loading: {o.isLoading.toString()}</div>
      <div>
        <button type="button" onClick={o.doGoodSlow}>
          Good
        </button>
        <button type="button" onClick={o.doBadSlow}>
          Bad
        </button>
        <button type="button" onClick={o.withoutLoader}>
          Without Loader
        </button>
        <button type="button" onClick={o.withNamedLoader} disabled={o.namedLoader.isLoading}>
          With Named Loader
        </button>
      </div>
      <pre style={{ fontSize: '0.9rem' }}>
        <code>{o.loaderState}</code>
      </pre>
      <div>Child: {o.user.name}</div>
    </div>
  ))

const doWeirdRaw = (name: string, age: number) => ({ type: 'doWeird', payload: { name, age } })
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

const counter = portableReducer('counter', (previous: number = 0) => previous + 1)

const Counter = O.view('Counter')
  .with({ counter })
  .as((o) => <div>Counter: {o.counter}</div>)

const Hydrate = O.view()
  .with({ hydrate })
  .as(function Hydrate(o) {
    return (
      <div>
        Hydrate:
        <button
          onClick={() => {
            o.hydrate(testHydrateState)
          }}
        >
          Do it
        </button>
      </div>
    )
  })

export const App = () => (
  <>
    <h1>Playground</h1>
    <Greeter />
    <Profile />
    <LocationViewer />
    <BananaRoute />
    <LoaderTest user={{ name: 'Titus' }} />
    <DoWierdTest />
    <Counter />
    <Hydrate />
  </>
)
