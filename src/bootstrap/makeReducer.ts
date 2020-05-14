import { OblongState } from '../core/types'

const nestingLocatorPattern = /^([a-z0-9_-]+\.)*([a-z0-9_-]+)$/i

export const makeReducer = () => {
  // const portableReducers = {}
  // TODO handle portableReducers

  return (
    previousState = { app: {}, oblong: { unorganized: {} } },
    { type, payload, meta }
  ): OblongState => {
    if ((meta?.isOblong || meta?.isOblongInternal) && type.startsWith('SET ')) {
      const locator = type.substring(4)
      const isNestingLocator = nestingLocatorPattern.test(locator)

      // Put all unorganized state into oblong area to keep noise away from app
      if (!isNestingLocator)
        return {
          ...previousState,
          oblong: {
            ...previousState.oblong,
            unorganized: {
              ...previousState.oblong.unorganized,
              [locator]: payload,
            },
          },
        }

      const rootKey = meta?.isOblongInternal ? 'oblong' : 'app'
      const isNamespaced = locator.includes('.')

      if (!isNamespaced)
        return {
          ...previousState,
          [rootKey]: {
            ...previousState[rootKey],
            [locator]: payload,
          },
        }

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

      return {
        ...previousState,
        [rootKey]: newRoot,
      }
    }

    return previousState
  }
}
