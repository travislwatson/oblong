# What is Oblong?

Oblong is a Typescript UI framework for helping you develop client applications efficiently with just the right amount of boilerplate.

It intends to be a meta framework: as long as the user experience is uniform and complete, existing popular libraries are used instead of reinventing the wheel. The benefit of this approach is that you get a clean and cohesive development experience while having the stability, performance, and feature-set (through escape hatches) of the underlying battle-tested libraries.

# Architecture

Oblong embraces one way data flow using the core four pieces:

1. **State** is for any value you want to store and change
2. **Views** are how you render your app and handle user inputs
3. **Commands** perform any work such as making API calls
4. **Queries** keep state clean by computing derived state efficiently

# Installation

Available through npm: `npm i oblong`

`createApp` is where you configure Oblong. All configuration is optional except at least one route:

```tsx
import { createApp } from 'oblong'
import { Home } from './home'

export const App = createApp({
  routes: {
    '/': Home,
  },
})
```

You can use Oblong anywhere you can use React. Use the generated App component as you normally would. Here's a web example:

```tsx
import { render } from 'react-dom'
import { App } from './app'

render(<App />, document.getElementById('root'))
```

# Quick Start

Let's build a counter game where we have to click the counter up fast enough to hit the max. You can see a complete and interactive version [on StackBlitz](https://stackblitz.com/edit/oblong-counter-game?file=index.tsx). First we need some **state** to store the click count:

```tsx
import { state } from 'oblong'

const clickCount = state('myGame.clickCount').as(0)
```

For simplicity, we'll stop at a hard coded 10 clicks. Keen eyes notice this is derived state, which is exactly what **query** is for:

```tsx
import { query } from 'oblong'

const isPlaying = query()
  .with({ clickCount }) // ⬅ Dependency Injection! 🎉
  .as((o) => o.clickCount < 10)
```

Each click will bump the count up, but be quick, because it will come back down in 2 seconds!

```tsx
import { command } from 'oblong'

const fallDown = command()
  .with({ clickCount, isPlaying })
  .as((o) => {
    if (o.isPlaying) {
      o.clickCount = o.clickCount - 1 // ⬅ That's actually immutable Redux! 💪
    }
  })

const hitUp = command()
  .with({ clickCount, isPlaying, fallDown }) // ⬅ State, Queries, & Commands! 🤭
  .as((o) => {
    if (o.isPlaying) {
      o.clickCount = o.clickCount + 1

      setTimeout(o.fallDown, 2000)
    }
  })
```

Now that your state, calculations, and interactivity are broken out (as they should be 😉), views can focus on what they do best:

```tsx
import { view } from 'oblong'

const Game = view()
  .with({ clickCount, hitUp, isPlaying })
  .as((o) => (
    <>
      <button onClick={o.hitUp} disabled={!o.isPlaying}>
        ☝️
      </button>
      <label>{o.isPlaying ? `${o.clickCount} clicks` : `You won!`}</label>
      <progress max="10" value={o.clickCount} />
    </>
  ))
```

And that's it, your first Oblong application! 🥳 If low boilerplate Redux, natural language fluent api, full React hook compatibility, built-in routing, and dependency injection weren't enough, this is your friendly reminder that Oblong is a Typescript framework. The application we just built in this quick start is 100% fully typed through inference, without a single type definition!

# Disclaimer

The ideas and design of this project, the code contained within this repository that implements those ideas, and the views, opinions, or general communications expressed in relation to this project are my sole authorship and responsibility and do not represent my employer in any way.
