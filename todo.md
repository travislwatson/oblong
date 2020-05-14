# TODO

These are the items currently planned to be worked on before MVP 1.0. The list will definitely change, but mostly grow, not shrink.

- ~~Change the freeze to a deep freeze and only run it in debug~~
- ~~Provide a query for the current location from React Router~~
- ~~Re-export React???~~
- ~~Use Object.is to bail out of mutations~~
- ~~object.freeze query results~~
- ~~Loading tracking by watching async commands~~
- ~~Accept a Queryable for withDefault~~
- Events + Emits + Subscription
- Portable reducers
- Hydrate
- state namespace
- create-react-app template
- Traits
- Error tracking using throw (catch promises, and if the error was a default type, re-throw it so React error boundaries can work properly. Also need an OblongError type for state-based errors. Also maybe something like .onError for automatic error boundary creation)
- Routing events
- Linting to catch stuff like using a dependency without binding it, or trying to use `o.something` without `something` being specified in the dependencies
- .if on a component for short circuit null rendering
- form support
- Tests
- Packaging optimization
- Persist to local/session storage
- Persist to query string
- support class syntax -- quick test didn't look promising on this... the defineProperty tactic doesn't work
