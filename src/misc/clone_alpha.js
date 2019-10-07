/**
 *
 * @param {*} o
 * @return {*}
 */
function clone (o) {
  if (!o || typeof o != 'object') return o
  switch (true) {
    case Array.isArray(o) :
      return cloneArray(o)
    case o instanceof Date :
      return new Date(+o) // new Date(o.valueOf()) //new Date(+o);
    case o instanceof Map:
      return cloneMap(o)
    case o instanceof Set:
      return new Set(cloneArray([...o]))
    case o instanceof Object :
      return cloneObject(o)
  }
  throw new Error('Unable to copy obj. Unsupported type.')
}

/**
 *
 * @param {Map<*, *>} o
 * @return {Map<*, *>}
 */
function cloneMap (o) {
  return new Map([...o.entries()].map(([k, v]) => [k, clone(v)]))
}

/**
 *
 * @param {*[]} o
 * @return {*[]}
 */
function cloneArray (o) {
  return o.map(clone)
}

/**
 * Known issue:
 * Unable to clone circular and nested object.
 * @param {{}} o
 * @return {{}}
 */
function cloneObject (o) {
  const x = {}
  for (let [k, v] of Object.entries(o)) x[k] = clone(v)
  return x
}

export {
  clone,
  cloneArray,
  cloneObject,
  cloneMap
}