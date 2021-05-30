---
sidebar_position: 6
---

# Big O

What would a library called Oblong be without something that was oblong shaped? Enter "Big O."

## The Idea

Oblong thrives on the primary 4 pieces of CQSV so much that it can help to have an easier way to import and use them. Compare this:

```tsx
import { command, query, state, view, React } from 'oblong'
```

To the Big O equivalent:

```tsx
import { O, React } from 'oblong'
```

Many times you don't know which of the 4 pieces you'll need when you start a file. Big O notation keeps you from having to revisit and change your import declarations.

Big O notation is recommended and is thus used throughout the documentation. However it is completely optional! Some may like it, some may not. Use it or don't. Or use both. 🤷‍♂️ Let the bike-shedding commence!
