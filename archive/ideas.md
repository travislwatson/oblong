## Idea

Maybe if we can have some helper for developing a query for "entity" style objects.

Maybe something like:

```tsx
const people = O.state('people').as([])

const fullName = O.query()
  .with({})
  .as((o) => (person) => `${person.firstName} ${person.lastName}`)

export const richPeople = O.query().with(people).as({
  fullName,
})
```

I guess there can only be one main dependency
