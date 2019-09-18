import { cloneMap } from '../misc/clone'

class Dic {
  /**
   * Create a map from separate key-array and value-array.
   * @param {*[]} keys Array of keys.
   * @param {*[]} values Array of values. The value-array and the key-array need to be equal in size.
   * @returns {Map<*, *>}
   */
  static ini (keys, values) {
    const lex = keys.map((k, i) => [k, values[i]])
    return new Map(lex)
  }

  static clone = cloneMap
}

export {
  Dic
}