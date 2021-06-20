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

If your command can inject its dependencies, it should. But some things will require an argument or two. Commands support this out of the box, just take extra arguments after Little o:

```tsx
const doSomething = O.command('doSomething')
  .with({ count })
  .as((o, howManyToAdd: number) => {
    o.count = o.count + howManyToAdd
  })

// Call like: o.incrementCount(1)
```

There's no opportunity for type inference here unfortunately: you'll need to explicitly type your command arguments.

#### Return Value

Normally your commands will cause some side effect or a state change. Sometimes, however, it can be useful for them to return information instead of (or in addition to) side effects. Your intuition should be correct here: you can return as you would from any normal function:

```tsx
const doSomething = O.command('doSomething')
  .with({ count })
  .as((o): string => {
    o.count = o.count + 1
    return `${o.count} is new count.`
  })
```

While type inference would have worked in this case, it won't always work. Explicit return types are recommended whenever the command's return value is significant.

## Subscriptions

TODO

## Unit Testing

TODO
