# Installation

Install Oblong from `npm i oblong`.

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

export const name = O.createState()
  .withDefault('John Doe')
  .as('user.profile.name')
```

Okay, so we're creating a piece of state which has a default of `'John Doe'`. So far so good, but what's the `as` bit? This is how Oblong stores and locates your data in the Redux state tree. In this case, if we called `name = 'Jane Doe'`, then our state tree would look like:

```json
{
  "user": {
    "profile": {
      "name": "Jane Doe"
    }
  }
}
```

While highly recommended, both the default and the locator are optional. `O.createState().as()` will create a unique piece of state with a default value of `undefined`.

## Command

Commands encapsulate all your application side effects. This is where all your imperative code should live.

```js
import { O } from 'oblong'
import { newName, setProfile } from './profile'

export const saveProfile = O.createCommand()
  .with({ newName, setProfile })
  .as(async (o) => {
    const response = await fetch('/profile', {
      method: 'PUT',
      body: { name: o.newName },
    })

    const updatedProfile = await response.json()

    o.setProfile(updatedProfile)
  })
```

Again, while highly recommended, `with` and `as` are optional. Nothing more than `O.createCommand()` is required to create a no-op command.

## Query

Oblong is designed for normalized state storage, which mean queries play a key role in making your application fast and organized. They should be pure declarative functions: use only the inputs and return only the outputs.

```js
import { O } from 'oblong'
import { firstName, middleInitial, lastName } from './profile'

const middleInitialWithDot = O.createQuery()
  .with({ middleInitial })
  .as((o) => (o.middleInitial ? `${o.middleInitial}.` : ''))

export const fullName = O.createQuery()
  .with({ firstName, middleInitialWithDot, lastName })
  .as((o) => `${o.firstName} ${o.middleInitialWithDot} ${o.lastName}`)
```

Queries tend to be more manageable when they're smaller. As a general rule of thumb, if the selector gets large enough for you to want an explicit `return` lambda just due to its complexity, consider breaking it down.

## View

Last, but far from least, views wrap all your hard work creating state, commands, and queries into a neat package for your user:

```js
import { O } from 'oblong'
import { name, setName, saveProfile } from './profile'

export const EditProfile = O.createView()
  .with({ name, setName, saveProfile })
  .as((o) => (
    <>
      <label>
        Name: <input type="text" value={o.name} onChange={o.setName} />
      </label>
      <button type="button" onClick={saveProfile}>
        Save
      </button>
    </>
  ))
```
