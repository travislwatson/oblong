import { OblongState } from '../foundation/types'

const nestingLocatorPattern = /^([a-z0-9_-]+\.)*([a-z0-9_-]+)$/i
const isNestingLocator = (locator) => nestingLocatorPattern.test(locator)

export const makeReducer = (portableReducers: any) => {
  const portableKeys = Object.keys(portableReducers)

  return (previousState = {}, action): OblongState => {
    const { payload, meta } = action

    if (meta?.isOblongHydrate) return payload

    let hasChanges = false
    const maybeNewState: any = {
      ...previousState,
    }

    if (meta?.oblong?.isSet && meta?.oblong?.locator) {
      const locator: string = meta?.oblong?.locator

      const parts = isNestingLocator(locator) ? locator.split('.') : ['?', locator]
      const pathParts = parts.slice(0, -1)
      const prop = parts.slice(-1)[0]

      let workingLevel = maybeNewState
      for (const pathPart of pathParts) {
        workingLevel[pathPart] = workingLevel[pathPart] ? { ...workingLevel[pathPart] } : {}
        workingLevel = workingLevel[pathPart]
      }
      workingLevel[prop] = payload
      hasChanges = true
    }

    for (const key of portableKeys) {
      maybeNewState[key] = portableReducers[key](previousState[key], action)
      if (!Object.is(maybeNewState[key], previousState[key])) hasChanges = true
    }

    return hasChanges ? maybeNewState : previousState
  }
}
