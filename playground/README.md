# Getting Started

Install Oblong using `npm i oblong` or `yarn add oblong`.

Then wrap the root of your application with `<OblongApp>` like so:

```js
import React from 'react'
import { OblongApp } from 'oblong'

export const App = () => (
  <OblongApp>
    <h1>Hello World</h1>
  </OblongApp>
)
```

That's it! Now you can use all the features of Oblong.

# Fundamentals

Oblong aims to provide the full power of React and Redux when you need it, but the standard API is both extremely powerful and simple. It consists of four atomic building blocks:

1. **State** - holds all your application data
2. **Command** - accepts user input and interact with the outside world
3. **Query** - transforms your normalized state into a useful, clean representation
4. **View** - interacts with the user

Hopefully these are all common names, and you can deduce from them what type of code should go where, but lets explore each one.

## State

State can be anything which can be stored in Redux. This normally means anything serializable.

```js
import { O } from 'oblong'

export const [name, setName] = O.createState()
  .withDefault('John Doe')
  .as('user.profile.name')
```

Okay, so we're creating a piece of state which has a default of `'John Doe'`. So far so good, but what's the `as` bit? This is how Oblong stores and locates your data in the Redux state tree. In this case, if we called `setName('Jane Doe')`, then our state tree would look like:

```json
{
  "user": {
    "profile": {
      "name": "Jane Doe"
    }
  }
}
```

While highly recommended, both the default and the locator are optional. `O.createState()` will create a unique piece of state with a default value of `undefined`.

The output is an array so you can use array destructuring. The format for destructuring is `[get: Query, set: Command]`.

There's surprisingly little magic here, but one thing worth mentioning: in debug mode, your object is frozen to avoid incidental mutation. This is a development-time feature that does not affect production code (for performance considerations).

## Command

Commands encapsulate all your application side effects. This is where all your imperative code should live.

```js
import { O } from 'oblong'
import { newName, newEmailAddress, setProfile } from './profile'

// There's a lot going on here, on purpose! Side effects are complicated, it's better to be realistic
export const saveProfile = O.createCommand()
  // These are all the dependencies our command needs. Can be queries or other commands
  .with({ newName, newEmailAddress, setProfile })
  // The dependencies are available on this o. argument with TypeScript powered autocompletion
  .as(async (o) => {
    try {
      const response = await fetch('/profile', {
        method: 'PUT',
        // For queries, you can use the values directly
        body: { name: o.newName, emailAddress: o.newEmailAddress },
      })

      const updatedProfile = await response.json()

      // For commands, call them as regular functions
      o.setProfile(updatedProfile)
    } catch (e) {
      // Oblong provides some helpers by default. One of them is a logError function
      o.logError('Unable to save user profile.')
    }
  })
```

Again, while highly recommended, `with` and `as` are optional. Nothing more than `O.createCommand()` is required to create a no-op command.

## Query

Queries allow your commands to remain clean and simple and your state to remain normalized. They can be as simple or as complex as you would like, but it is important to keep them declarative. This is where your functional programming prowess can shine!

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

Queries tend to work better when they're smaller. As a general rule of thumb, if the selector gets large enough for you to want an explicit `return` lambda just due to its complexity, maybe break it down.

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
