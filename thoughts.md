# Thoughts

Random ideas or thoughts that may or may not result in anything or even be correct or even relevant.

- React.memo'd components can create bugs with mutated objects, since the shallowEqual will not re-render. Is there any way we can help identify this in development and inform the user like Object.freeze? Freeze probably isn't wise for props since you can pass anything, even functions.
