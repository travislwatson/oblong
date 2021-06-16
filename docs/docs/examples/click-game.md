---
sidebar_position: 1
---

# Click Game

Let's build a counter game where we have to click the counter up fast enough to hit the max. You can see a complete and interactive version [on StackBlitz](https://stackblitz.com/edit/oblong-counter-game?file=index.tsx). While this is a very simple example, the goal is to create an app and use all four CQSV pieces of Oblong... so let's get to it!

## Setup

You'll need an Oblong app ready to go. You can use [Quick Start](../quick-start.md) to set up a local Oblong app, or you can use [this Stackblitz](https://stackblitz.com/edit/oblong-counter-game-starter?file=home.tsx) as a starting point.

## The Game

The above code got us an Oblong app ready to go, but now it's time to actually code the game!

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
