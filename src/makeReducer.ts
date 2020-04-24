const nestingLocatorPattern = /^([a-z_]+\.)*([a-z_]+)$/i

export const makeReducer = () => {
  // const portableReducers = {}
  // TODO handle portableReducers

  return (
    previousState = { oblong: { unorganized: {} } },
    { type, payload, meta }
  ) => {
    if (meta?.isOblong && type.startsWith('SET ')) {
      const locator = type.substring(4)
      const isNestingLocator = nestingLocatorPattern.test(locator)

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

      const isNamespaced = locator.includes('.')

      if (!isNamespaced)
        return {
          ...previousState,
          oblong: {
            ...previousState.oblong,
            [locator]: payload,
          },
        }

      const pathPartsAndProp = locator.split('.')
      const pathParts = pathPartsAndProp.slice(0, -1)
      const prop = pathPartsAndProp.slice(-1)
      const newOblongState = { ...previousState.oblong }

      let workingLevel = newOblongState
      for (const part of pathParts) {
        workingLevel[part] = workingLevel[part] ? { ...workingLevel[part] } : {}
        workingLevel = workingLevel[part]
      }
      workingLevel[prop] = payload

      return {
        ...previousState,
        oblong: newOblongState,
      }
    }

    return previousState
  }
}
