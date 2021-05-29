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
- Does not reinvent the wheel, it is not a ground-up framework, stands on shoulders of giants

#### Isn't React already a framework?

React _can be used_ as an all-in-one framework... kindof, but even with (especially with?) hook syntax, it makes simple things such as sharing state across component boundaries unpleasant. It considers core features like routing and dependency injection second-class citizens.

React is an amazing UI library. And JSX is literally the perfect template syntax. Oblong embraces the beauty of the React library, taking care of the routing, binding, and management, letting React do what it does best: render UI's.

#### How much of my state should I put in Oblong?

Redux typically recommends you store only what you need. Oblong disagrees. **Store all of your state in Oblong**. All of it.

If you eventually get to the point where you see performance issues, revisit your exact use case then. You can store very large amounts of data in a Redux store. And you can update it extremely often.

In Oblong, several layers of caching are on by default. Immutability is enforced by default. Simple, fast dirty checking is on by default in state setters, queries, views, and React itself. _Oblong is fast by default_.

Oblong tries to make it hard to do the wrong thing. This means that whatever state you store in Oblong is probably going to be faster, more predictable, and more useful than state you place elsewhere.

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

## Writing Oblong applications

#### How do I organize my Oblong application?

Years ago I read an answer to a similar question about React. The answer was unfortunately perfect: move it around until it feels right.

Oblong takes this to heart. Moving things around is meant to feel as painless as possible given the constraints of a JavaScript application. Don't like where that piece of state is? Move it and update your references. The decoupling provided by dependency injection means you can organize your modules however you see fit. One file per atomic piece? Sure. One file per feature? Yep. One file per page? If you want. Whatever feels right. And if it doesn't feel right, move stuff around until it does.

#### I normally use destructuring for `props`, why can't I do that with Oblong?

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

Because of this odd behavior, it is strongly recommended to avoid destructuring, and always use `o.` when accessing any dependency.

## Interoperability

#### Can I use Redux devtools?

Yes! Redux devtools are fully supported by Oblong.

#### Can I use React devtools?

Yes! Oblong wraps your functional components, eliminating component boundary noise, so you'll have a clean React tree.

#### Can I use React hooks?

Yes! Hooks are fully supported, and Oblong uses hooks internally to configure your dependencies.

#### State is great, but can I just write a reducer?

Yes! And not only can you do so, Oblong's `portableReducer` embraces the path model from states which lets you avoid the `combineReducers` headache and benefit from code splitting natively.

#### Can I use my own selector, such as createSelector from Reselect?

Yes! Queries actually use Reselect under the hood, and for any selector you have simply use `fromSelector` to get an injectable version.

#### Can I use Immer?

Yes! Not only is Immer fully supported, but the syntax works wonderfully well for complex immutable state assignments. For smaller projects, try simply using immutable modification patterns. You'll be surprised how far you get, and Oblong's freezing will make sure you don't accidentally mutate your state or query outputs.

#### Can I use Immutable.js?

Maybe, but it's probably not a good idea. Redux thrives on having simple serializable state, and Oblong is no exception.

#### Can I use redux-thunk (or other middleware)?

Commands are meant as a drop-in replacement for redux-thunk library, so it is not included by default. But all Redux compatible middleware is supported in Oblong, and redux-thunk is no exception.

#### Can I use redux-toolkit?

Oblong is not a good fit for RTK, and it's not advised to use both within the same application.
