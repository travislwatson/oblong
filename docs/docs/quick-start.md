---
sidebar_position: 1
---

# Quick Start

The best way to learn something is to use it! So let's build a counter game where we have to click the counter up fast enough to hit the max. You can see a complete and interactive version [on StackBlitz](https://stackblitz.com/edit/oblong-counter-game?file=index.tsx). While this is a very simple example, the goal is to use the CQSV pieces of Oblong, so let's get to it!

## Installation

If you want to skip the installation, and just learn about how Oblong works, you can jump to [The Game](#the-game).

This example is going to be in the browser, so we'll need both Oblong and ReactDOM:

```
npm i oblong react-dom
```

## Setup

In your root file (typically `index.tsx`, but depends on your build setup), we're going to setup Oblong:

```tsx
import { render } from 'react-dom'
import { createApp, React } from 'oblong'
import { Home } from './home'

export const App = createApp({
  routes: {
    '/': Home,
  },
})

render(<App />, document.getElementById('root'))
```

A couple notes: first, React is re-exported from `'oblong'` for convenience only, if you prefer to import it directly from `'react'`, that's perfectly fine. Secondly, while Oblong does require you to define routes to be able to render anything, the above minimal setup is all that is necessary if you don't intend to use routing. Just know it's there when you need it!

We are going to define our "real" Home view below, but for now it's a good idea to create a Hello World to make sure everything works. So let's create our `home.tsx` file with this temporary content

```tsx
import { O, React } from 'oblong'

export const Home = () => <h1>Hello World</h1>
```

At this point you should see Hello World rendered on the screen. Congratulations, your Oblong app is ready to go!

## The Game

The above code got us an Oblong app ready to go, but now it's time to actually code the game. If you want to skip the setup and just want to follow along for the fun part, then you can use [this Stackblitz](https://stackblitz.com/edit/oblong-counter-game-starter?file=home.tsx) as a starting point.

We are done with the `index.tsx`. **All of the changes below should go in your `home.tsx` file.**

### State

Our game will need to store how many "hits" we currently have. For this we use state:

```tsx
const hitCount = O.state('myGame.hitCount').as(0)
```

You can read this as "I want to store some `number` state in the Redux tree at `myGame.hitCount` with a default value of `0`."

### Query

We are going to need to calculate whether or not we've completed the game. We are going to do this simply based on the hitCount.

That is exactly what query is made for:

```tsx
const isPlaying = O.query()
  .with({ hitCount }) // ⬅ Dependency Injection! 🎉
  .as((o) => o.hitCount < 10)
```

Queries are reactive, they will watch their dependencies and recalculate only when they need to. Efficient!

### Command

A game is going to be boring if you can't interact with it. Here we let the user "hit," but it only lasts for 2 seconds. You can see that unlike redux-thunk calculated values like `o.isPlaying` and the state values like `o.hitCount` are live, no need to worry about stale values, and asynchronous works exactly as you expect!

```tsx
const hit = O.command()
  .with({ hitCount, isPlaying })
  .as((o) => {
    if (o.isPlaying) {
      o.hitCount = o.hitCount + 1 // ⬅ That's actually immutable Redux! 💪

      // A hit only lasts for 2 seconds
      setTimeout(() => {
        if (o.isPlaying) {
          o.hitCount = o.hitCount - 1
        }
      }, 2000)
    }
  })
```

### View

Now that your value, calculations, and interactivity are broken out away from your actual UI (as they should be 😉), views can focus on what they do best! Let's redefine our Home component with an actual Oblong view:

```tsx
export const Home = O.view()
  .with({ hitCount, hit, isPlaying })
  .as((o) => (
    <>
      <button onClick={o.hit} disabled={!o.isPlaying}>
        👊
      </button>
      <label>{o.isPlaying ? `${o.hitCount} clicks` : `You won!`}</label>
      <progress max="10" value={o.hitCount} />
    </>
  ))
```

And that's it, your first Oblong application! 🥳 If low boilerplate Redux, natural language fluent api, full React and Redux compatibility, built-in state-based routing, and dependency injection weren't enough, this is your friendly reminder that Oblong is a Typescript framework. The application we just built in this quick start is 100% fully typed through inference, without a single type definition!
