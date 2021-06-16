---
sidebar_position: 6
---

# Routing

Oblong provides Redux based state-driven routing, with full time travel debugging compatibility. Dynamic import code splitting with loading fallbacks is built in without relying on React Suspense. Nested routing, multiple routing stacks, and routing events are all first class citizens.

## Syntax

TODO document `createRouter` or whatever name is decided.

## Background

Routing is core to any Single Page Application. Many attempts have been made to integrate routing with Redux (such as [Connected React Router](https://github.com/supasate/connected-react-router)). While these may be good options for some Redux applications, they are either too complicated or don't mesh well with Oblong philosophy.

### The Problem

React Router is by far the most competent routing solution available. It is a battle tested and phenomenal library... _if you want React controlling your routing_.

The problem is that we don't. React-based routing breaks time travel debugging, state hydration, and the general intuition developers benefit from with reactive state-driven application architecture. Mostly because it pushes you into lifecycle hooks or render method execution to trigger routing events like `onEnter` and `onLeave`. But it also discourages you from using routing information outside of your React components (have you ever tried to navigate from within a thunk? Or use a route parameter from within a selector?).

The problem arises because React Router sits in between `history.listen` and... React. Which means the only possible destination of route changes is... React! This makes React your event receiver rather than emitter. This is perfectly natural if React is your source of truth, but it's a painful impedance mismatch with state management outside of React.

So as much as Oblong would like to use React Router, it just doesn't fit.

### The Solution

Thankfully, we're in luck! The team building React Router had the amazing foresight to break apart the [history](https://www.npmjs.com/package/history) package from the rest of React Router. Huzzah! All of the important parts that we need are actually in this library, and can be integrated with Oblong cleanly.

So Oblong uses this library as the foundation for its routing, and builds a state-driven layer from commands, queries, and state on top of it. This approach let's us benefit from all the hard work done in the history library while still providing a developer experience that's a pleasure to use.
