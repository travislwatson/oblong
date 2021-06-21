[Click here for Oblong documentation](https://travislwatson.github.io/oblong/)

# What is Oblong?

Oblong is a UI framework for helping you develop client applications efficiently with just the right amount of boilerplate.

It intends to be a meta framework: as long as the developer experience is uniform and complete, existing popular libraries are used instead of reinventing the wheel. The benefit of this approach is that you get a clean and cohesive development experience while having the stability, performance, and feature-set (through escape hatches) of the underlying battle-tested libraries.

# Installation

Available through npm: `npm i oblong`

Import `createApp` to create an `<OblongApp>` component. This function call is for you to configure Oblong. All configuration is optional, so a basic setup could be as simple as:

```tsx
import { createApp } from 'oblong'
import { YourCode } from './home'

const OblongApp = createApp()

export const App = () => (
  <OblongApp>
    <YourCode />
  </OblongApp>
)
```

The rest of your setup is up to you: you can use Oblong anywhere you can use React. A web example could be as simple as:

```tsx
import { render } from 'react-dom'
import { App } from './app'

render(<App />, document.getElementById('root'))
```

# Next Steps

Use the "Big O" export from Oblong. Your Intellisense should guide you through usage, but for more information, see the documentation.

```tsx
import { O } from 'oblong'

const name = O.state('name').as('John Doe')
```

# Disclaimer

The ideas and design of this project, the code contained within this repository that implements those ideas, and the views, opinions, or general communications expressed in relation to this project are my sole authorship and responsibility and do not represent my employer in any way.
