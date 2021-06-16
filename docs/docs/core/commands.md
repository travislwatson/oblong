---
sidebar_position: 2
---

# Commands

Commands are your "do-ers." They are always triggered from some action, such as a user event or api response or even a simple timeout. All your interactions with the outside world should be here. They are composable, so err on making them too small.

## Syntax

```tsx
const myCommand = O.command('myCommand')
  .with({ your, dependencies, here })
  .as((o) => {
    // Your work goes here
  })
```

### Command Name Duplication

In the above example, you see `myCommand` twice, so you might want to eliminate the duplication. The string version supplied to the `O.command(...)` function is indeed optional; this is perfectly valid: `O.command()`.

But you still probably want to use it.

Here's why: unlike some other Redux libraries like thunks, commands automatically emit actions for you to inspect call orders of your commands. This string name is used for these actions. That means your debugging experience will be significantly worse without them.

### Dependencies

The `.with({ ... })` call allows you to specify any dependencies your command has. These dependencies will be available as properties on the first argument supplied to your command body.

### Command Body

Your command body is just a function with a special first argument: "little o." This special first argument will contain resolved versions of whatever dependencies you specify. Your command body can do about anything except directly trigger a re-render (the end result of your commands would need to trigger a state change which would trigger a reactive re-render). Commands are your Oblong workhorse!

#### Extra Arguments

TODO

#### Return Value

TODO

## Subscriptions

TODO

## Unit Testing

TODO
