// Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
export const deepFreeze = (object) => {
  if (!object || typeof object !== 'object') return object

  for (let value of Object.keys(object).map((i) => object[i]))
    if (value && typeof value === 'object') deepFreeze(value)

  return Object.freeze(object)
}

export const deepFreezeDev =
  process.env.NODE_ENV === 'production' ? (i) => i : deepFreeze
