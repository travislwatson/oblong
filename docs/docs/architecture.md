---
sidebar_position: 2
sidebar_label: Architecture
---

# Architecture: the "Heart" of Oblong

A less catchy name for Oblong's architecture might be CQSV: Command + Query + State + View.

## Inspiration

Heart is a one way architecture, using Flux as a foundation. Heart separates input and output flows from a fundamental level, borrowing the C and Q from CQRS. Heart embraces declarative presentation, borrowing the V from MVC. And lastly Heart loves React's atomic `useState` tuple implementation and its throwback to functional lenses.

Heart attempts to combine these wonderful powerhouses to provide an intuitive framework for building developer friendly applications.

## Paths

While you as a developer will interact with the four building blocks in Heart, the more important concept is the dynamic between reactivity and interactivity:

- The **Reactive Path** starts with a State observation, is transformed through a hierarchy of Queries, and is manifested through a reactive View render.
- The **Interactive Path** starts with some View interaction, chains into any combination of Commands, and ultimately ends up mutating state.

### Reactive Path

```
State > Query > View
```

Every piece of State is an atomic observable unit. Queries can use these atoms as well as other Queries to create a hierarchy of derivations with chained reactivity. The View then only needs to declare the final pieces it uses, and the hierarchy of reactivity will ensure the View is re-rendered when it should, and never when it shouldn't.

State should be minimal and normalized: store only the essence.

Views should be lifeless and derivative, products of their arguments. Introduce View boundaries as frequently as you're comfortable since it increases performance by reducing your re-render blast radiuses.

Queries are your solution for reactive code organization. These create performance optimization boundaries for your framework to utilize, and code organization boundaries for developer sanity.

### Interactive Path

```
View > Command > State
```

While the Reactive Path seems to work by magic, the complimentary Interactive Path is equally as important as it is different. Instead of attempting to be declarative, pure, or reactive, the Interactive Path embraces the reality: it deals with asynchronicity, side effects, branching, and ultimately State mutations. It fits a procedural style of programming.

Views should eliminate all but the bare essentials of interactivity: minimal event handling and argument binding, leaving as much work as possible for the Commands. Views should never pass information to Commands that they can fetch themselves. Instead only pass execution context information.

State mutations should be atomic and immutable to minimize the computational overhead of change detection. To combine multiple logical State mutations within a single interaction, use a wrapping Command.

Commands are your solution for interactive code organization. Introduce Command boundaries wherever it will improve code organization, testability, or debugability.

When implementing dependency injection in Commands and Views, it's paramount to ensure State values and Query results are live and are never materialized. Breaking the reactivity link will make your code feel unpredictable.
