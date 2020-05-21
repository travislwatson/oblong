# Warning

This project is extremely early and in proof of concept phase. The API is mostly still missing. Core features are buggy. It has almost no documentation. Tests are non-existent.

Proceed at your own peril.

If you're curious about something, the answer might be in [FAQ](faq.md). If you want to look at some of the things that have steered the development of Oblong, check out [References](references.md). To look at the growing list of what needs to be done for the MVP, see [TODO](todo.md).

# Installation

Install Oblong and dependencies from `npm i oblong react react-redux react-router-dom redux redux-devtools-extension reselect`.

Wrap the root of your application with `<OblongApp>`:

```js
import React from 'react'
import { OblongApp } from 'oblong'

export const App = () => (
  <OblongApp>
    <h1>Hello World</h1>
  </OblongApp>
)
```

Congratulations, you now have a fully configured Oblong application!

# Quick Start Guide

Oblong revolves around four fundamental atomic building blocks:

1. **State** - where you store everything in a normalized way
2. **Command** - how you handle user input and interact with the outside world (side effects)
3. **Query** - transforms your normalized state into more useful representations
4. **View** - renders all your components and interacts with the user

Hopefully the name of each of these gives you a clue to their purpose. Let's explore an example of each of them.

## State

State is anything you wish to store. It can be simple values like strings, numbers, or booleans. It can be complex objects or arrays.

```js
import { O } from 'oblong'

export const name = O.state().withDefault('John Doe').as('user.profile.name')
```

So we're creating a piece of state which has a default of `'John Doe'`. But what's the `as` bit? This is how Oblong stores and locates your data in the Redux state tree. In this case, if we called `name = 'Jane Doe'`, then our state tree would look like:

```json
{
  "user": {
    "profile": {
      "name": "Jane Doe"
    }
  }
}
```

While highly recommended, both the default and the locator are optional. `O.state().as()` will create a unique piece of state with a default value of `undefined`.

State can be read and used inside of a command, query or view. It can be changed inside of a command or view.

## Command

Commands encapsulate all your application side effects. This is where all your imperative code should live.

```js
import { O } from 'oblong'
import { newName, profile } from './profile'

export const saveProfile = O.command()
  .with({ newName, profile })
  .as(async (o) => {
    const response = await fetch('/profile', {
      method: 'PUT',
      body: { name: o.newName },
    })

    const updatedProfile = await response.json()

    o.profile = updatedProfile
  })
```

While optional, a command without any dependencies in `with` or without an implementation in `as` won't be very useful. `O.command().as()` is required to create a bare minimum no-op command.

Commands can depend on on other commands, and can use the results of queries and state.

## Query

Oblong is designed for normalized state storage, which mean queries to denormalize that data into something more useful are critical in making your application fast and organized. They should be pure declarative functions: use only the inputs and return only the outputs.

```js
import { O } from 'oblong'
import { firstName, middleInitial, lastName } from './profile'

const middleInitialWithDot = O.query()
  .with({ middleInitial })
  .as((o) => (o.middleInitial ? `${o.middleInitial}.` : ''))

export const fullName = O.query()
  .with({ firstName, middleInitialWithDot, lastName })
  .as((o) => `${o.firstName} ${o.middleInitialWithDot} ${o.lastName}`)
```

A query can depend on state or other queries. Queries cannot depend on commands, and state cannot be changed inside queries.

While optional, a query without any dependencies in `with` or without an implementation in `as` won't be very useful. `O.query().as()` is required to create a bare minimum no-op query that always returns `undefined`.

## View

Last, but far from least, views wrap all your hard work creating state, commands, and queries into a neat package for your user.

Views can depend on any combination of commands, queries, and state. State can be set inside views, but you might find it more manageable to prefer commands for your state assignments.

Technically, views are Functional React Components, which means you have the full power of hooks available.

```js
import { O } from 'oblong'
import { name, save } from './profile'

export const EditProfile = O.view()
  .with({ name, save })
  .as((o) => (
    <>
      <label>
        Name:
        <input
          type="text"
          value={o.name}
          onChange={(e) => {
            o.name = e.target.value
          }}
        />
      </label>
      <button type="button" onClick={o.save}>
        Save
      </button>
    </>
  ))
```
