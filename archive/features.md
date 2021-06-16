# Features

This is effectively a ToDo list for API documentation

- Code Quality
  - State values and query results are frozen to avoid accidental mutation
  - Queries and Commands don't allow accidentally setting them
- Interop
  - `fromSelector` to allow plain selectors to be used as a dependency
  - `fromActionCreator` to allow plain action creators to be used as a
    dependency
  - `portableReducer` to allow either reducer creation or third party redux library integration
  - `dispatch`/`getState` for access to those raw underlying functions
- Routing
  - `currentLocation` query for current route
- Miscellaneous
  - `hydrate` to restore a serialized state
  - `rootState` for grabbing the entire state tree, useful in combination with `hydrate`
