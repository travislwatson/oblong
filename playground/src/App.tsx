import { React, O, currentLocation, Link, isLoading, asQueryable, createLoader } from 'oblong'

const twoSeconds = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 2000)
  })
const twoSecondsFail = () =>
  new Promise((_, reject) => {
    setTimeout(reject, 2000)
  })

const age = O.createState().withDefault<number>(0).as('user.age')

const profile = O.createState()
  .withDefault({ name: 'John Doe' })
  .setEquality('shallow')
  .as('user.profile')

const firstName = O.createQuery()
  .with({ profile })
  .as((o) => o.profile.name.split(' ')[0])

const testQueryMutation = O.createQuery()
  .with({ profile, age })
  .as((o) => ({ name: o.profile.name, age: o.age }))

const flipCase = O.createCommand()
  .with({ profile, age, testQueryMutation })
  .named('flipCase')
  .as<[boolean], void>((o) => {
    const [upper] = o.args

    o.profile = {
      ...o.profile,
      name: o.profile.name[upper ? 'toUpperCase' : 'toLowerCase'](),
    }

    o.age = 15
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
      <div>
        <Link to="/apple">Apple</Link> | <Link to="/banana">Banana</Link>
      </div>
    </>
  ))

const Greeter = O.createView()
  .with({ firstName })
  .as((o) => <h2>Hello, {o.firstName}</h2>)

const LocationViewer = O.createView()
  .with({ currentLocation })
  .as((o) => <div>{JSON.stringify(o.currentLocation)}</div>)

const isOnBananaRoute = O.createQuery()
  .with({ currentLocation })
  .as((o) => o.currentLocation.pathname === '/banana')

const BananaRoute = O.createView()
  .with({ isOnBananaRoute })
  .as((o) => {
    if (!o.isOnBananaRoute) return null
    return <h4>BANANA TIME</h4>
  })

const doGoodSlow = O.createCommand()
  .named('doGoodSlow')
  .as(async () => {
    await twoSeconds()
  })

const doBadSlow = O.createCommand()
  .named('doBadSlow')
  .as(async () => {
    await twoSecondsFail()
  })

const withoutLoader = O.createCommand()
  .named('withoutLoader')
  .ignoreLoading()
  .as(async () => {
    await twoSeconds()
  })

const namedLoader = createLoader().named('namedLoader')

const withNamedLoader = O.createCommand()
  .with({ namedLoader })
  .named('withNamedLoader')
  .ignoreLoading()
  .as(async (o) => {
    await o.namedLoader.track(async () => {
      await twoSeconds()
    })
  })

const loaderState = asQueryable((state) => JSON.stringify(state?.oblong?.loading, undefined, 1))

const LoaderTest = O.createView()
  .with({
    isLoading,
    doGoodSlow,
    doBadSlow,
    loaderState,
    withoutLoader,
    withNamedLoader,
    namedLoader,
  })
  .as((o) => (
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
    </div>
  ))

export const App = () => (
  <>
    <h1>Playground</h1>
    <Greeter />
    <Profile />
    <LocationViewer />
    <BananaRoute />
    <LoaderTest />
  </>
)
