import { dpMap } from '../misc/clone'
import { Er } from '../misc/Er'

class Dc {
  /**
   * Create a map from separate key-array and value-array.
   * @param {*[]} keys Array of keys.
   * @param {*[]} values Array of values. The value-array and the key-array need to be equal in size.
   * @returns {Map<*, *>}
   */
  static ini (keys, values) {
    // const lex = keys.map((k, i) => [k, values[i]])
    // return new Map(lex)
    if (!keys || !values || !Array.isArray(keys) || !Array.isArray(values))
      throw Er('The input contains invalid array.')
    const
      { length } = keys,
      map = new Map()
    for (let i = 0; i < length; i++) map.set(keys[i], values[i])
    return map
  }

  static clone (dc) {
    return dpMap(dc)
  }
}

export {
  Dc
}