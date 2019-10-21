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
      return dpArr(o)
    case 'Obj' :
      return dpObj(o)
    case 'Map':
      return dpMap(o)
    case 'Dat' :
      return new Date(+o)
    case 'Set':
      return new Set(dpArr([...o]))
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