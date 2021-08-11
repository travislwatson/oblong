---
sidebar_position: 1
---

# Apps

All Oblong apps start with a `createOblongApp` call.

## Syntax

```tsx
import { createOblongApp } from 'oblong'

const OblongApp = createOblongApp({
  // Optional configuration
})

export const App = () => <OblongApp>Your code here</OblongApp>
```

The output is a component to wrap around the contents of your application. It will set up necessary dependencies such as Redux, React-Redux, and Redux Dev Tools.

## Configuration

### `createStore`

Oblong creates a Redux store automatically for you by default. If you need more control of your store creation, you can supply your own `createStore` function. This function must accept and use the reducer supplied to it. Oblong's reducer must be your root reducer! If you need additional reducers, you must use the [otherReducers](#otherreducers) functionality instead of `combineReducers`.

```tsx
import { createStore } from 'redux'

const OblongApp = createOblongApp({
  createStore: (reducer) => createStore(reducer),
})
```

### `otherReducers`

If you have existing Redux code, custom reducer requirements, a third party library, or any other Redux need you can supply an object of additional reducers. This option functions much like `combineReducers`, but it has no safety built in. This is of particular note with collisions.

```tsx
const actionCount = (previous = 0) => previous + 1

const OblongApp = createOblongApp({
  otherReducers: { actionCount },
})
```
