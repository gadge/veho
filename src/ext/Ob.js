import { dpObj } from '../misc/clone'

class Ob {
  /**
   * Create a object from separate key-array and value-array.
   * @param {*[]} keys Array of keys.
   * @param {*[]} values Array of values. The value-array and the key-array need to be equal in size.
   * @returns {Object<*, *>}
   */
  static ini (keys, values) {
    const o = {}, { length } = keys
    for (let i = 0; i < length; i++) o[keys[i]] = values[i]
    // let i, k; for ([i, k] of keys.entries()) o[k] = values[i]
    return o
  }

  /**
   *
   * @param {Object<string,*>} jso
   * @return {[string, *][]}
   */
  static entries (jso) {
    return Object.entries(jso)
  }

  /**
   * Shallow.
   * @param {string[]} arr
   * @param {*} val
   * @return {Object<string,*>}
   */
  static fromArr (arr, val) {
    let o = {}
    for (let k of arr) o[k] = val
    return o
  }

  /**
   * Shallow.
   * @param {...[*,*]} entries - An array of key-value pair, [key, value]
   * @returns {Object|Object<string,*>}
   */
  static of (...entries) {
    let o = {}
    for (let [k, v] of entries) o[k] = v
    return o
  }

  /**
   * Shallow.
   * @param {[*,*]} entries - An array of key-value pair, [key, value]
   * @param {function(*):*|function(*,number):*} [ject] - A function
   * @returns {Object|Object<string,*>}
   */
  static fromEntries (entries, ject) {
    let o = {}
    if (!ject) {
      for (let [k, v] of entries) o[k] = v
    } else {
      switch (ject.length) {
        case 1:
          for (let [k, v] of entries) o[k] = ject(v)
          break
        case 2:
          for (let [i, [k, v]] of entries.entries()) o[k] = ject(v, i)
          break
        default:
          break
      }
    }
    return o
  }

  /**
   *
   * @param {Object<string,*>} jso
   * @return {Map<string, *>}
   */
  static toMap (jso) {
    return new Map(Object.entries(jso))
  }

  /**
   *
   * @param {Map<string,*>} dict - A map
   * @returns {Object<string,*>} A json object
   */
  static fromMap (dict) {
    let o = {}
    for (let [k, v] of dict.entries()) o[k] = v
    return o
    // return Object.fromEntries(dict)
  }

  static clone (jso) {
    return dpObj(jso)
  }

  /**
   *
   * @param {Object} jso
   * @param {*[]} keys
   * @param {number} [lo]
   * @param {number} [hi]
   */
  static select (jso, keys, lo = 0, hi) {
    const ob = {}
    hi = hi || keys.length
    for (let k; lo < hi; lo++) {
      k = keys[lo]
      ob[k] = jso[k]
    }
    return ob
  }

  /**
   *
   * @param {Object} jso
   * @param {[*,*][]} keyToNKeys
   * @param {number} [lo]
   * @param {number} [hi]
   */
  static selectReplKeys (jso, keyToNKeys, lo = 0, hi) {
    const ob = {}
    hi = hi || keyToNKeys.length
    for (let k, v; lo < hi; lo++) {
      [k, v] = keyToNKeys[lo]
      ob[v] = jso[k]
    }
    return ob
  }

  static selectValues (jso, keys, lo = 0, hi) {
    hi = hi || keys.length
    const arr = Array(hi - lo)
    for (; lo < hi; lo++) arr[lo] = jso[keys[lo]]
    return arr
  }

  static map (jso, fn, len) {
    const ob = {}, ents = Object.entries(jso)
    len = len || ents.length
    for (let i = 0, k, v; i < len; i++) {
      [k, v] = fn(ents[i])
      ob[k] = v
    }
    return ob
  }

  static mapValues (jso, fn, len) {
    const ob = {}, ents = Object.entries(jso)
    len = len || ents.length
    for (let i = 0, k, v; i < len; i++) {
      [k, v] = ents[i]
      ob[k] = fn(v)
    }
    return ob
  }

  static mapKeys (jso, fn, len) {
    const ob = {}, ents = Object.entries(jso)
    len = len || ents.length
    for (let i = 0, k, v; i < len; i++) {
      [k, v] = ents[i]
      ob[fn(k)] = v
    }
    return ob
  }
}

export {
  Ob
}
