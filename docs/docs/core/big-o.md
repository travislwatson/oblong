---
sidebar_position: 7
---

# Big O

What would a library called Oblong be without something that was oblong shaped? Enter "Big O."

## The Idea

Oblong thrives on the primary CQSV pieces of Heart so much that it helps to have an easier way to import and use them. Compare how it would be:

```tsx
import { command, query, state, view } from 'oblong'
```

To how much simpler it looks with Big O:

```tsx
import { O } from 'oblong'
```

Also, since Oblong apps are so conducive to feature-based organization, many times you don't know which of the 4 pieces you'll need when you start a file. Big O notation keeps you from having to revisit and change your import declarations.
