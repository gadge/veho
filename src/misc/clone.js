const oc = Object.prototype.toString

/**
 *
 * @param {*} o
 * @return {*}
 */
function clone (o) {
  if (!o || typeof o !== 'object') return o
  switch (oc.call(o).slice(8, 11)) {
    case 'Arr' :
      return cloneArray(o)
    case 'Obj' :
      return cloneObject(o)
    case 'Map':
      return cloneMap(o)
    case 'Dat' :
      return new Date(+o)
    case 'Set':
      return new Set(cloneArray([...o]))
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