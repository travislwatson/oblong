# TODO

Done items have now been moved to [features.md](features.md).

## Ready to Start

- Change state syntax to inline the queryable default
- `rootState` or similar selector for getting the entire state (for coupling with `hydrate`)

## Planned Features

- Error tracking using throw (catch promises, and if the error was a default type, re-throw it so React error boundaries can work properly. Also need an OblongError type for state-based errors. Also maybe something like .onError for automatic error boundary creation)
- Events + Emits + Subscription
- Commands should auto-emit 3 events: (), .then, and .catch. Only async commands will emit .then and .catch
- Routing events
- form support
- Command debouncing
- BUG: When using the event inside a command, I was seeing synthetic event errors. Need to check into this. (I looked into this, I was able to repro in an async function after an await, maybe we can invoke event.persist() on arg[0] when the command returns a promise)
- BUG: Intellisense seems to be broken inside of JS views now (TS still works). what happened here? (I thought about this, it might be TProps, since the JS has no way of specifying what the props could be, it ends up being any, and when combined like TDep & TProps, the result ends up being any. What if we put props into .props property)
- Need a query factory to get params from a url
- Allow .get and .set on state(), including a common .with
- Debug help: if .with({}) sees a builder instance instead of an injectable/queryable, throw an error (more helpful for JS users, since TS should catch it). An alternative to this is to do a .setTimeout of 0 or something inside the first step of builder creation that would log an error, and just clear that timeout if the .as is called.
- Investigate conditional dependencies to make routing optional (check out react-redux does this for their batch re-export)
- Allow specifiying a .persist() or similar on state as an alternate to specific .get/.set
- Allow using DI for passthru simple dependency decoupling (just helps with mocking unit tests)
- Provide a unit test helper for everything special (for instance the property creation get and set stuff and maybe the array .push whatknot)

## Improve Code Quality

- Create a locator/selector/setter manager to cache things, warn about collisons, and create a unique place for things
- Support hook syntax for views, like `const o = useWith({ a, b , c })`. Might be able to reuse this internally to simplify implementation
- Add an action creator that triggers a recreation of root state object. This is useful for a .get that returns a promise
- Investigate and optimize the library around closure/memory usage. Many places are retaining access to builder instances that are useless after initial creation. Can also investigate certain situations such as portable reducers where one-time registration is done. Might be able to just rewrite the function.
- Related to prior point, investigate way of doing the builder syntax where we use publicly available properties behind symbol names as a way to have private state without relying on closure. This might make the builders more memory efficient
- Look into reselect overloads to see if there's some way to support the object syntax natively to avoid all the array reshuffling I'm doing now.
- Improve debugging in queries, perhaps computation logging or debug message tracing, maybe a catch+re-throw for exceptions

## Investigate

- Is there a cleaner syntax for the NODE_ENV mode production check?
- Would there be a way to have cancelable commands? Maybe they can convert all the `get` & `set` to throw immediately something like `new CancelError`, then catch that in the command execution context and swallow it.
- Need some thought an investigation. Where can we use generators? It could be used for commands in multiple ways. It might be usable in views, something like Crank.js. It might be useful for asynchronous state or queries. It might be useful as a generic result of `get` on definProperty
- Need some thought an investigation... Namespaces. Can we create and use a namespace via context and have `O.state` naturally organize itself under that namespace? This would support clean decoupled state usage for things that are instanceable, like an input.
- Need investigation: can I override the state getter to provide immutable variants for things like .push on an array? Also, what about doing custom property definition on objects to support single level assignment like o.person.name = 'Foo'?
- support class syntax -- quick test didn't look promising on this... the defineProperty tactic doesn't work ... oh hey, what if we pass the entirety of `o` in? So you access it like `props.o` when in a class? I experimented with this. It's probably possible since I got the actual code to work, but I couldn't get the TypeScript syntax to work. Maybe not worth the effort
- Can we assist with portal generation and usage?

## Integrations

- SAGA: need to either provide a solution, or document a pattern
- FSM: need to either provide a solution, or document a pattern
- Rx.js: need to either provide interop, or document integration
- Immer: need to document integration
- Immutable: investigate usage, might not be worthy of integration. Mark Erikson suggests avoiding it, and he makes good points

## General Tasks

- Linting to catch stuff like using a dependency without binding it, or trying to use `o.something` without `something` being specified in the dependencies
- Packaging optimization
- Tests
- Traits
