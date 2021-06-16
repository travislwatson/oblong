---
sidebar_position: 4
---

# State

State is best imagined as a couplet: a getter and a setter. The getter is observable to serve as a reactive trigger. The setter is simply a mutation... an assignment.

## Syntax

```tsx
const name = O.state('user.profile.name').as('Travis')
```

### State Path

In the above example, you see `user.profile.name`. This might look like an object accessor, and that's not a coincidence. Oblong uses Redux which is a single object state, so the path provided tells Oblong where to store the value. In this example, if we change the name to `John` and have nothing else stored, our Redux state tree will look like:

```json
{
  "user": {
    "profile": {
      "name": "John"
    }
  }
}
```

### Default Value

If you're used to Redux, one unusual thing to how State works is that the default value is not stored. Regardless of how many pieces of State you define, your Redux tree will be empty until you start making mutations.

A logical conclusion to this is if the default value is just a calculation, can it be a query? Yes!

```tsx
const defaultName = O.query()
  .with({ gender })
  .as((o) => (o.gender === 'male' ? 'John Doe' : 'Jane Doe'))

const name = O.state('name').as(defaultName)
```

This is also your solution to computationally expensive default state values.

## Usage

When using State, just use normal assignment syntax:

```tsx
const MyView = O.view()
  .with({ name })
  .as((o) => (
    <input
      value={o.name}
      onChange={(e) => {
        o.name = e.target.value
      }}
    />
  ))
```

If your piece of state is an object or array, you will not be able to mutate it. You can use an immutable update pattern such as:

```tsx
o.people = [...o.people, newPerson]
```

The Immer library can also a great fit:

```tsx
import produce from 'immer'

o.people = produce(o.people, (draftState) => {
  draftState.push(newPerson)
})
```

## Equality Checking

To prevent unnecessary chatter, State mutations go through an equality check. If the new value is the same according to the equality function, then the mutation is skipped.

There are three built-in checkers:

- "exact" performs a `===` check and is the default
- "never" will disable this optimization entirely and always log a mutation change
- "shallow" goes one level deep into your object or array and will check for strict `===` equality at that level

You can also specify your own function:

```tsx
O.state('myState')
  .setEquality((a, b) => a === b)
  .as({})
```

## Unit Testing

TODO, mocking helper
