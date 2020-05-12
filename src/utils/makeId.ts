// Adapted from nonsecure nanoid https://github.com/ai/nanoid/blob/master/non-secure/index.js
const urlAlphabet = 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW'

const used = {}

export const makeId = () => {
  let id = ''
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = 21
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  if (id in used) return makeId()
  used[id] = true
  return id
}
