# What is Oblong?

Oblong is a Typescript UI framework for helping you develop client applications efficiently with just the right amount of boilerplate.

It intends to be a meta framework: as long as the developer experience is uniform and complete, existing popular libraries are used instead of reinventing the wheel. The benefit of this approach is that you get a clean and cohesive development experience while having the stability, performance, and feature-set (through escape hatches) of the underlying battle-tested libraries.

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

# Disclaimer

The ideas and design of this project, the code contained within this repository that implements those ideas, and the views, opinions, or general communications expressed in relation to this project are my sole authorship and responsibility and do not represent my employer in any way.
