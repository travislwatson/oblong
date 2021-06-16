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
