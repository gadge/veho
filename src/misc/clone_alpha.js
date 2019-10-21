/**
 *
 * @param {*} o
 * @return {*}
 */
function clone (o) {
  if (!o || typeof o != 'object') return o
  switch (true) {
    case Array.isArray(o) :
      return dpArr(o)
    case o instanceof Date :
      return new Date(+o) // new Date(o.valueOf()) //new Date(+o);
    case o instanceof Map:
      return dpMap(o)
    case o instanceof Set:
      return new Set(dpArr([...o]))
    case o instanceof Object :
      return dpObj(o)
  }
  throw new Error('Unable to copy obj. Unsupported type.')
}

/**
 *
 * @param {Map<*, *>} o
 * @return {Map<*, *>}
 */
function dpMap (o) {
  return new Map([...o.entries()].map(([k, v]) => [k, clone(v)]))
}

/**
 *
 * @param {*[]} o
 * @return {*[]}
 */
function dpArr (o) {
  return o.map(clone)
}

/**
 * Known issue:
 * Unable to clone circular and nested object.
 * @param {{}} o
 * @return {{}}
 */
function dpObj (o) {
  const x = {}
  for (let [k, v] of Object.entries(o)) x[k] = clone(v)
  return x
}

export {
  clone,
  dpArr,
  dpObj,
  dpMap
}