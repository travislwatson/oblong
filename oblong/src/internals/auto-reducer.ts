import { OblongState } from './types'

const nestingLocatorPattern = /^([a-z0-9_-]+\.)*([a-z0-9_-]+)$/i
const isNestingLocator = (locator) => nestingLocatorPattern.test(locator)

export const autoReducer = (previousState = {}, action): OblongState => {
  const { payload, meta } = action

  if (meta?.isOblongHydrate) return payload

  let hasChanges = false
  const maybeNewState: any = {
    ...previousState,
  }

  if (meta?.oblong?.isSet && meta?.oblong?.locator) {
    const locator: string = meta?.oblong?.locator

    const parts = isNestingLocator(locator)
      ? locator.split('.')
      : ['?', locator]
    const pathParts = parts.slice(0, -1)
    const prop = parts.slice(-1)[0]

    let workingLevel = maybeNewState
    for (const pathPart of pathParts) {
      workingLevel[pathPart] = workingLevel[pathPart]
        ? { ...workingLevel[pathPart] }
        : {}
      workingLevel = workingLevel[pathPart]
    }
    workingLevel[prop] = payload
    hasChanges = true
  }

  return hasChanges ? maybeNewState : previousState
}

// This is used to support top level "legacy" reducers
export const makeComplexAutoReducer = (otherReducers: {
  [key: string]: any
}) => {
  const reducerEntries = Object.entries(otherReducers)

  return (state = {}, action): OblongState => {
    let hasUpdates = false
    const newOtherState = {}

    for (const [prop, reducer] of reducerEntries) {
      newOtherState[prop] = reducer(state[prop], action)
      hasUpdates = hasUpdates || newOtherState[prop] !== state[prop]

      console.log({
        prop,
        hasUpdates,
        newState: newOtherState[prop],
        oldState: state[prop],
      })
    }

    // autoReducer will just ignore other properties, so it can and must be passed the entire state
    const newOblongState = autoReducer(state, action)
    hasUpdates = hasUpdates || newOblongState !== state

    return hasUpdates ? { ...newOblongState, ...newOtherState } : state
  }
}
