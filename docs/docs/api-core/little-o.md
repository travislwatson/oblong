---
sidebar_position: 7
---

# Little o

Big O felt lonely, so he decided he wanted a Little o to keep him company. Unlike his big brother, Little o isn't just a pretty face, he's actually pretty darn important!

## The Idea

Oblong's dependency injection is unusual in that it is _live_. Within a given injection context of a command or view, the values update like you'd expect.

This may be hard to visualize so let's take an example:

```tsx
const age = O.state('age').as(17)

const isLegal = O.query()
  .with({ age })
  .as((o) => o.age >= 18)

const test = O.command()
  .with({ age, isLegal })
  .as((o) => {
    console.log(o.age) // 17
    console.log(o.isLegal) // false

    o.age = 18

    console.log(o.age) // 18
    console.log(o.isLegal) // true
  })
```

You can see here that both the `o.age` state and `o.isLegal` query updated and were correct, mid command! Little o is how we make that happen. 💪

## How it Works

Dependency Injection in Oblong is done through [`defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). This means we have a `get` and a `set` function available for every dependency. The setter is used for state assignments, but the getter is where this DI implementation really shines!

If you're familiar with thunks, you have probably seen something like:

```tsx
const age = getAge(getState())
```

The selector is given the current state value in order to materialize the result. In Oblong, our property definition does this lookup in the getter instead, so it's always live with zero code overhead. Neat!

## Why Little o is Important

Oblong's way of keeping values live means it behaves as you intuitively expect. Unless you don't use Little o. Example time!

```tsx
const age = o.age
console.log(age) // 17
console.log(o.age) // 17

o.age = 18

console.log(age) // 17
console.log(o.age) // 18

age = 18 // Error
```

You can see that as soo as we materialize and store the state value, it won't update any more. And assignment doesn't work. This is almost definitely not what you want.

## The Only Downside

At this point you might be thinking "okay, wonderful. Little o notation is easier, shorter, and just works. What's the catch?"

The catch is you can't use destructuring. And that's a bummer, because destructuring is cool.

Whatever you do, **DO NOT DO THIS**:

```tsx
const test = O.command()
  .with({ age, isLegal })
  .as(({ age, isLegal }) => {
    /* 💣 💥 💀 */
  })
```

Sorry destructuring, we love you, but you should have respected property descriptors!
