# TODO

These are the items currently planned to be worked on before MVP 1.0. The list will definitely change, but mostly grow, not shrink.

- ~~Change the freeze to a deep freeze and only run it in debug~~
- ~~Provide a query for the current location from React Router~~
- ~~Re-export React???~~
- ~~Use Object.is to bail out of mutations~~
- ~~object.freeze query results~~
- ~~Loading tracking by watching async commands~~
- ~~Accept a Queryable for withDefault~~
- ~~Portable reducers~~
- ~~Hydrate~~
- ~~.if on a view for short circuit null rendering~~
- ~~create-react-app template~~
- Error tracking using throw (catch promises, and if the error was a default type, re-throw it so React error boundaries can work properly. Also need an OblongError type for state-based errors. Also maybe something like .onError for automatic error boundary creation)
- Events + Emits + Subscription
- Routing events
- state namespace
- Traits
- Linting to catch stuff like using a dependency without binding it, or trying to use `o.something` without `something` being specified in the dependencies
- form support
- Tests
- Packaging optimization
- Persist to local/session storage
- Persist to query string
- support class syntax -- quick test didn't look promising on this... the defineProperty tactic doesn't work ... oh hey, what if we pass the entirety of `o` in? So you access it like `props.o` when in a class?
- Add support for
- BUG: When using the event inside a command, I was seeing synthetic event errors. Need to check into this. (I looked into this, I was able to repro in an async function after an await, maybe we can invoke event.persist() on arg[0] when the command returns a promise)
- BUG: Intellisense seems to be broken inside of JS views now (TS still works). what happened here?
