---
sidebar_position: 5
---

# Views

Views are effectively React Functional Components combined with Oblong's dependency injection. Unlike the other parts of Oblong, Views do not need to be resolved to be used.

Hooks can be used, but class components are not supported.

## Syntax

```tsx
const MyView = O.view('MyView')
  .with({ your, dependencies, here })
  .as((o) => <h1>Hello World</h1>)
```

### View Name Duplication

In the above example, you see `MyView` twice, so you might want to eliminate the duplication. The string version supplied to the `O.view(...)` function is indeed optional; this is perfectly valid: `O.view()`.

The string version is used for React DevTools and error messages.

### Dependencies

The `.with({ ... })` call allows you to specify any dependencies your view has. These dependencies will be available as properties on the first argument supplied to your view body.

### Props

Props can be used as the second argument:

```tsx
type MyViewProps = { name: string }

const MyView = O.view('MyView')
  .with({ your, dependencies, here })
  .as((o, props: MyViewProps) => <h1>Hello World</h1>)

// Usage like <MyView name="Travis" />
```

## Unit Testing

TODO
