/**
 *
 * @param {*} node
 * @return {*}
 */
function clone (node) {
  if (!node || typeof node != 'object') return node
  switch (true) {
    case Array.isArray(node) :
      return cloneArray(node)
    case node instanceof Date :
      return new Date(+node) // new Date(node.valueOf()) //new Date(+node);
    case node instanceof Map:
      return cloneMap(node)
    case node instanceof Set:
      return new Set(cloneArray([...node]))
    case node instanceof Object :
      return cloneObject(node)
  }
  throw new Error('Unable to copy obj. Unsupported type.')
}

/**
 *
 * @param {Map<*, *>} node
 * @return {Map<*, *>}
 */
function cloneMap (node) {
  return new Map(node.entries().map(([k, v]) => [k, clone(v)]))
}

/**
 *
 * @param {*[]} node
 * @return {*[]}
 */
function cloneArray (node) {
  return node.map(clone)
}

/**
 * Known issue:
 * Unable to clone circular and nested object.
 * @param {{}} node
 * @return {{}}
 */
function cloneObject (node) {
  const x = {}
  for (let [k, v] of Object.entries(node)) x[k] = clone(v)
  return x
}

export {
  clone,
  cloneArray,
  cloneObject,
  cloneMap
}