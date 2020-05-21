# Technical

### React.memo usage

Every component creaed with `O.view` is wrapped in `React.memo`. The reason is due to the nature of applications developed with Oblong. Since Redux is used for state management, and React-Redux handles the connections, prop drilling is exceedingly rare, and view granularity and composition is very beneficial.

Updates triggered via state happen through `useSelector` hooks, which bypasses the overhead of memoization.

Updates triggered via parent re-rendering are unlikely to need child re-rendering because prop-drilling is rare.

Good conversation on this topic on [Mark's dev blog](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#memoize-everything).

Of particular note is this snippet:

> Should users wrap everything in memo() by default? Probably not, if only because you should think about your app's perf needs. Will it actually hurt if you do? No, and realistically I expect it does have a net benefit (despite Dan's points about wasted comparisons)

While React can't assume universal memoization would be a net benefit, Oblong can due to its design encouraging many functional component boundaries without any props, or with very few.

Currently the escape hatch is to not use `O.view`. Maybe in the future, a `.noMemo()` or similar could be added for a higher quality escape hatch.

Also, if a stress test benchmark is ever created to try with and without `React.memo`, this position can be changed from a principled one to a data driven one.
