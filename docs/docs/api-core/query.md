---
sidebar_position: 3
---

# Query

Every front end application will need some amount of calculated information derived from the state. As a rule of thumb: **if you can calculate it, _you should_.** Keep your state as lean and normalized as is reasonable, and use queries for everything you can.

## Syntax

```tsx
const myQuery = O.query()
  .with({ your, dependencies, here })
  .as((o) => 'your result here')
```

### Dependencies

The `.with({ ... })` call allows you to specify any dependencies your query has. Queries cannot depend on commands, only state and other queries.

[Click here](#TODO) to read more about dependency injection in Oblong.

### Query Body

Your query body is just a function with a special first argument: "little o." This special first argument will contain resolved versions of whatever dependencies you specify. Your query body must be a pure function: no side effects! It should only use the dependencies supplied, and it must always return a value.
