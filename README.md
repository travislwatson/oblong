# Installation

Install Oblong `npm i oblong`.

Run your app:

```ts
import { renderOblongApp } from 'oblong'

const App = () => <h1>Hello World</h1>

renderOblongApp({
  routes: {
    '/': App,
  },
})
```

Congratulations, you now have a fully functional Oblong application!

# Quick Start Guide

Oblong revolves around four fundamental atomic building blocks:

1. `O.state()` - where you store everything in a normalized way
2. `O.command()` - how you handle user input and interact with the outside world (side effects)
3. `O.query()` - transforms your normalized state into more useful representations
4. `O.view()` - renders all your components and interacts with the user

For each of those blocks, there are three common methods to their definitions:

1. `O.state('name')`, etc. - Each definition accepts a string name as its sole argument
2. `.with({ ... })` - When dependencies are needed, they are specified here
3. `.as(...)` - Where all the business happens, this is where you write _your_ code

See below for how to combine these four blocks with each common method

## State

State is anything you wish to store, as long as it is serializable. It can be simple values like strings, numbers, or booleans. It can be complex objects or arrays.

```js
import { O } from 'oblong'

export const name = O.state('user.profile.name').as('John Doe')
```

So we're creating a piece of state which has a default of `'John Doe'`. But what's the `user.profile.name` bit? This is how Oblong stores and locates your data in the Redux state tree. In this case, if we called `name = 'Jane Doe'`, then our state tree would look like:

```json
{
  "user": {
    "profile": {
      "name": "Jane Doe"
    }
  }
}
```

While highly recommended, both the default and the locator are optional. `O.state().as()` will create a unique piece of state in an unorganized area with a default value of `undefined`.

State can be read and used inside of a command, query or view. It can be changed inside of a command or view. To change a piece of state, assign to it: `o.name = 'New Name'`.

There's no `.with({ ... })` in this example. For most simple state storage, you will not need dependencies. For advanced state usage, see TODO.

## Command

Commands encapsulate all your application side effects. This is where your code goes that "does" something.

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

If a name is provided (in this case it would look like `O.command('saveProfile')`) it is used for debugging. This allows you to view your command calls in the Redux DevTools. This example would look like `saveProfile()`.

## Query

Oblong is designed for normalized state storage, which mean queries to de-normalize that data into something more useful are critical in making your application fast and organized. They should be pure declarative functions: use only the inputs and return only the outputs.

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

Like commands, queries can be named to assist with debugging.

## View

Last, but far from least, views wrap all your hard work creating state, commands, and queries into a neat package for your user.

Views can depend on any combination of commands, queries, and state. State can be set inside views, but you might find it more manageable to prefer commands for your state assignments.

Once the dependency injection is accounted for, views are nearly identical to Functional React Components. The most important thing this means is that you have the full power of hooks available.

```js
import { O, React } from 'oblong'
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

If a name is provided (such as `O.view('EditProfile')`) it is used in the React DevTools.

# Disclaimer

The ideas and design of this project, the code contained within this repository that implements those ideas, and the views, opinions, or general communications expressed in relation to this project are my sole authorship and responsibility and do not represent my employer in any way.
