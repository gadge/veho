import './Vec'
import { VehoError } from '../misc/VehoError'
import { cloneObject } from '../misc/clone'

class Jso {
  static clone = cloneObject

  /**
   *
   * @param {Object<string,*>} jso
   * @return {[string, *][]}
   */
  static toEntries (jso) {
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
    for (let k of arr) {
      o[k] = val
    }
    return o
  }

  /**
   * Shallow.
   * @param {...[*,*]} entries - An array of key-value pair, [key, value]
   * @returns {Object|Object<string,*>}
   */
  static of (...entries) {
    let o = {}
    for (let [k, v] of entries) {
      o[k] = v
    }
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
    if (!!ject) {
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
    } else {
      for (let [k, v] of entries) o[k] = v
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
    for (let [k, v] of dict.entries()) {
      o[k] = v
    }
    return o
    // return Object.fromEntries(dict)
  }
}



export {
  Jso
}
