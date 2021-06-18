// Adapted from nonsecure nanoid https://github.com/ai/nanoid/blob/master/non-secure/index.js
const urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW'

const used = new Set()

export const makeId = (): string => {
  let id = ''
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = 21
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  if (used.has(id)) return makeId()
  used.add(id)
  return id
}
