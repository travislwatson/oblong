# TODO

Done items have now been moved to [features.md](features.md).

## Path to v1

Features:

- Command debouncing
- Allow .get and .set on state(), including a common .with
- Routing events (decouple routing from component lifecycle)
- Allow using DI for passthru simple dependency decoupling (just helps with mocking unit tests)
- Minimal form support
- Need a query factory to get params from a url
- Support function syntax for getting name for commands like views
- Warn about collisions when creating state
- Add an action creator that triggers a recreation of root state object. One use case is for a .get that returns a promise or generator
- Support creating error boundary, maybe a simple `.onError` for views?
- Support portal rendering, maybe `.inPortal`

Also need tests, documentation, and website. Might also inspect the packaging and make sure it's good and clean. BundlePhobia.com.

## Maybe Future Version Features

- Debug help: if .with({}) sees a builder instance instead of an injectable/queryable, throw an error (more helpful for JS users, since TS should catch it). An alternative to this is to do a .setTimeout of 0 or something inside the first step of builder creation that would log an error, and just clear that timeout if the .as is called.
- Investigate conditional dependencies to make routing optional (check out react-redux does this for their batch re-export)

## Investigate

- Is there a cleaner syntax for the NODE_ENV mode production check?
- Would there be a way to have cancelable commands? Maybe they can convert all the `get` & `set` to throw immediately something like `new CancelError`, then catch that in the command execution context and swallow it.
- Where can we use generators? It could be used for commands in multiple ways. It might be usable in views, something like Crank.js. It might be useful for asynchronous state or queries. It might be useful as a generic result of `get` on definProperty
- Can I override the state getter to provide immutable variants for things like .push on an array? Also, what about doing custom property definition on objects to support single level assignment like o.person.name = 'Foo'?

## Integrations

- SAGA: need to either provide a solution, or document a pattern
- FSM: need to either provide a solution, or document a pattern
- Rx.js: need to either provide interop, or document integration
- Immer: need to document integration
- Immutable: investigate usage, might not be worthy of integration. Mark Erikson suggests avoiding it, and he makes good points

## Nice to Have

- Linter rules to catch stuff like using a dependency without binding it, or trying to use `o.something` without `something` being specified in the dependencies
