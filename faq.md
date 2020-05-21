# FAQ

## General

#### What is Oblong?

O.

#### Why Oblong?

- Focus on developer experience
- Low boilerplate, especially initial application setup
- First class dependency injection
- Command-Query separation: Commands are naturally imperative, Queries are naturally declarative
- Full unit testing support
- Common sense defaults
- Highly interoperable, bring your patterns and libraries
- Strong autocomplete support via Typescript
- Each top level creation is atomic with clear dependencies
- Modules are used for organization rather than classes or components
- No troublesome `this.` keyword
- Built-in mutation prevention
- Code splitting support by default
- Intelligent Typescript support
- Common sense naming conventions, focusing on what it is, not how it's implemented
- State and Queries are live-bound inside commands, no stale values
- IE 11 is not ignored
- Does not reinvent the wheel, it is not a ground-up framework, stands on shoulders of giants

#### Isn't React already a framework?

React _can be used_ as an all-in-one framework... kindof, but even with (especially with?) hook syntax, it makes simple things such as sharing state across component boundaries unpleasant. If you want to unit test your components, it becomes even more difficult.

React is an amazing UI library. And JSX is literally the perfect template syntax. Oblong embraces the beauty of the React library, taking care of the binding and management, letting React do what it does best: render UI's.

#### How much of my state should I put in Oblong?

Redux typically recommends you store only what you need. Oblong disagrees. **Store all of your state in Oblong**. All of it.

If you eventually get to the point where you see performance issues, revisit your exact use case then. You can store very large amounts of data in a Redux store. And you can update it extremely often.

In Oblong, several layers of caching are on by default. Immutability is enforced by default. Simple, fast dirty checking is on by default in state setters, queries, views, and React itself. Oblong is fast by default.

Oblong tries to make it hard to do the wrong thing. This means that whatever state you store in Oblong is probably going to be faster, more reliable, and more useful than state you place elsewhere.

_Seriously, store all of your state in Oblong._

#### Okay, I get it. Store everything in Oblong. But what if I run into performance issues?

Performance is a problem that really must be solved with metrics. What is actually slow?

Is it the React rendering? Maybe try something like `react-virtualized`. You can also try batching your state changes. You can also consider UI treatments such as infinite scrolling or paging.

State change on every keystroke or scroll too frequent? Add a throttle/debounce.

Do you have large pages that hang around unnecessarily? You can reset individual pieces of state, or entire trees.

Is your state tree full of duplicates or unnecessary data? Try to normalize what's stored in your state and derive as much as possible using Queries.

Are your React components rendering too frequently? Pay attention to how you're creating new objects, arrays, and functions, and try to preserve references where you can. Memoization can help. `useCallback` and similar hook techniques can help.

If you've exhausted all your options, then sure go ahead and see if storing state in React helps.

Oblong should be your first choice, React is your last resort.

#### Why are your dependencies so loosely specified?

The dependencies used by Oblong, as well as some that are related, tend to be quite picky about their sub-dependencies. It would be better in some ways to have a more strict and confident set of dependencies, but the flip side is that it would be more difficult for end users to fix dependency conflicts on their own. By pinning only on a major version bump, Oblong provides the most flexibility it can while protecting against API changes across major version bumps.

#### Why IE 11 support?

The only somewhat interesting feature that would require Oblong to drop IE 11 support would be Proxies. And indeed, major players such as MobX and React Easy State choose that path.

However, because Oblong chose to use the Dependency Injection pattern, it is able to use `defineProperty` for similar assignment functionality. Subscriptions are supported via hooks, such as `useEffect(onNameChange, [name])`.

IE 11 is not end of life. Many business and applications must, and should, support it. So until our core dependencies prevent us from maintaining IE 11 compatibility, Oblong will support it.

## Writing Oblong applications

#### How do I organize my Oblong application?

Years ago I read an answer to a similar question about React. The answer was unfortunately perfect: move it around until it feels right.

Oblong takes this to heart. Moving things around is meant to feel as painless as possible given the constraints of a JavaScript application. Don't like where that piece of state is? Move it and update your references. The decoupling provided by dependency injection means you can organize your modules however you see fit. One file per atomic piece? Sure. One file per feature? Yep. One file per page? If you want. Whatever feels right. And if it doesn't feel right, move stuff around until it does.

#### Can I use destructuring?

While there's nothing stopping you from destructuring your `o` dependencies, doing so will materialize all values. This breaks two things: you can no longer use an assignment for state such as `o.name =`.

The other thing is that state and query values are no longer live in views and commands.

Here's an example. Without destructuring, assignments and queries are live like you'd expect:

```js
const updateAge = O.command()
  .with({ age })
  .as((o) => {
    console.log(o.age) // 30
    o.age = 35
    console.log(o.age) // 35
  })
```

With destructuring, to update you'll need to use a setter function, and even then the values aren't a live view:

```js
const updateAge = O.command()
  .with({ age, setAge })
  .as(({ age, setAge }) => {
    console.log(age) // 30
    age = 35
    console.log(age) // 35 -- This is a lie, it's only changed locally, not in redux!
    setAge(40) // This will work, but...
    console.age(age) // 35 -- The local value will never be updated
  })
```

Because of this odd behavior, it is strongly recommended to avoid destructuring, and always use `o.` when accessing any dependnecy.

## Interoperability

#### What is required?

React, Redux, React-Redux, React-Router, Reselect, and the Redux Devtools Extension.

#### Is Typescript required?

No. Not even close.

#### Can I use Typescript?

If you insist. ;-)

#### Can I use Redux devtools?

Yes! Redux devtools are fully supported by Oblong. Please be aware that if you have some command or state assignment in a lifecycle method or `useEffect` hook (for instance `onEnter` functionality when loading a route), time travel debugging may be affected.

#### Can I use React devtools?

Yes! Oblong wraps your functional components, elminating component boundary noise, so you'll have a clean React tree. The hooks used should surface debug values in the inspector.

#### Can I use React hooks?

Yes! Hooks are fully supported.

#### Can I use React class components?

Comming soon. (views will be able to be implemented as classes, but a component boundary will be created for dependency resolution)

#### Can I use a redux-style reducer?

Coming soon. (will support portable reducers, similar to how it works in redux's documentation on code splitting)

#### Can I use createSelector?

Coming soon. (commands, queries, and views will be able to consume selectors created via createSelector)

#### Can I use Immer?

Yes! Not only is Immer fully supported, but the syntax works wonderfully well for state assignments inside of commands.

#### Can I use Immutable.js?

TBD... need to research this. I'm not sure it's actually compatible with redux.

#### Can I use redux-thunk?

Coming soon. (Commands are meant to replace thunks, but once generic injectables are allowed and additional middlewares are allowed, nothing is stopping someone from using it)

#### Can I use redux-saga?

TBD... no clue, but probably OK? Commands can't support it natively yet.

#### Can I use redux-toolkit?

TBD... I think this integration should work OK, but it's probably going to be low value add. This project eliminates almost all of the need
