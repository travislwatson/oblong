import { OblongState } from '../core/types'

const nestingLocatorPattern = /^([a-z0-9_-]+\.)*([a-z0-9_-]+)$/i

export const makeReducer = (portableReducers: any) => {
  const portableKeys = Object.keys(portableReducers)

  return (previousState = { app: {}, oblong: { unorganized: {} } }, action): OblongState => {
    const { type, payload, meta } = action

    if (meta?.isOblongHydrate) return payload

    let hasChanges = false
    const maybeNewState: any = {
      ...previousState,
    }

    if ((meta?.isOblong || meta?.isOblongInternal) && type.endsWith('=')) {
      const locator = type.slice(0, -1)
      const isNestingLocator = nestingLocatorPattern.test(locator)

      // Put all unorganized state into oblong area to keep noise away from app
      if (!isNestingLocator) {
        maybeNewState.oblong = {
          ...previousState.oblong,
          unorganized: {
            ...previousState.oblong.unorganized,
            [locator]: payload,
          },
        }
        hasChanges = true
      } else {
        const rootKey = meta?.isOblongInternal ? 'oblong' : 'app'
        const isNamespaced = locator.includes('.')

        if (!isNamespaced) {
          maybeNewState[rootKey] = {
            ...previousState[rootKey],
            [locator]: payload,
          }
          hasChanges = true
        } else {
          const pathPartsAndProp = locator.split('.')
          const pathParts = pathPartsAndProp.slice(0, -1)
          const prop = pathPartsAndProp.slice(-1)
          const newRoot = { ...previousState[rootKey] }

          let workingLevel = newRoot
          for (const part of pathParts) {
            workingLevel[part] = workingLevel[part] ? { ...workingLevel[part] } : {}
            workingLevel = workingLevel[part]
          }
          workingLevel[prop] = payload

          maybeNewState[rootKey] = newRoot
          hasChanges = true
        }
      }
    }

    for (const key of portableKeys) {
      maybeNewState[key] = portableReducers[key](previousState[key], action)
      if (!Object.is(maybeNewState[key], previousState[key])) hasChanges = true
    }

    return hasChanges ? maybeNewState : previousState
  }
}
