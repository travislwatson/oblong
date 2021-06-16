---
sidebar_position: 1
---

# Quick Start

Oblong is a React based framework. If you have an existing project, you can skip to [Installation](#Installation). Otherwise the first step of creating an Oblong app is to create a React app.

## Create a React App

Oblong doesn't maintain any project templates or starter packages. Instead, it relies on the wealth of existing options for React.

Whichever path you choose, it is _highly encouraged_ (seriously, probably consider it mandatory) to use TypeScript!

- [Create React App](https://create-react-app.dev/docs/getting-started#quick-start) is a popular and featureful option, use the `--template typescript` option
- [Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) is making waves for being very fast, use the `react-ts` template
- [Snowpack](https://github.com/snowpackjs/snowpack/tree/main/create-snowpack-app/app-template-react-typescript) is similar to Vite
- [From scratch](https://reactjs.org/docs/create-a-new-react-app.html#creating-a-toolchain-from-scratch) if you need ultimate control

## Installation

After you have a working React application, you can install Oblong which brings along all other necessary dependencies.

```bash
# If you're using NPM
npm i oblong

# Or yarn
yarn add oblong
```

## Setup

`createOblongApp` will create a component to wrap your application:

```tsx
import { createOblongApp } from 'oblong'

const OblongApp = createOblongApp()

export const App = () => <OblongApp>Your application here</OblongApp>

// The following line might be required if your setup expects a default export
export default App
```
