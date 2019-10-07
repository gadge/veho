import { VehoError } from '../misc/VehoError'
import { cloneObject } from '../misc/clone_beta'
import { Mat } from './Mat'

class Jso {

  /**
   * Create an Object from separate key-array and value-array.
   * @param {*[]} keys Array of keys.
   * @param {*[]} values Array of values. The value-array and the key-array need to be equal in size.
   * @returns {Map<*, *>}
   */
  static ini (keys, values) {
    const o = {}
    for (let [i, k] of keys.entries()) {
      o[k] = values[i]
    }
    return o
  }

  static clone (o) {return cloneObject(o)}

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
      for (let [k, v] of entries) {
        o[k] = v
      }
    }
    return o
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
   * @param {Object<string,*>} jso
   * @return {[string, *][]}
   */
  static toEntries (jso) {
    return Object.entries(jso)
  }
}

/**
 * Transform between Json table and Json of samples.
 * A Json table is formed like :
 *  {
 *    headers:[a, b, ...],
 *    rowSet:*[][]
 *  }.
 * A Json of samples is formed like :
 *  [
 *    {a:*, b:*, ...},
 *    {a:*, b:*, ...},
 *    ...
 *  ]
 */
class JsonTable {
  /**
   *
   * @param {*[][]} samples
   * @param {*[]}banner
   * @return {Object[]}
   */
  static tableToSamples (samples, banner) {
    if (Mat.isMat(samples)) {
      const firstRow = samples[0]
      let len = Math.min(firstRow.length, banner.length)
      return samples.map(row => {
        let o = {}
        for (let i = 0; i < len; i++) {
          o[banner[i]] = row[i]
        }
        return o
      })
    } else throw new VehoError('The input \'samples\' is not a 2d-array')
  }

  /**
   *
   * @param {Object<string,*>[]}rows
   * @param {string} bannerLabel
   * @param {string} samplesLabel
   * @returns {Object<string,*>}
   */
  static samplesToTable (rows, bannerLabel = 'head', samplesLabel = 'rows') {
    if (!!rows && Array.isArray(rows)) {
      const firstRow = rows[0]
      if (!!firstRow && typeof firstRow === 'object') {
        const banner = Object.keys(firstRow)
        const samples = rows.map(row => Object.values(row))
        return Jso.of([bannerLabel, banner], [samplesLabel, samples])
      } else return null
    } else throw new VehoError('The input \'rows\' is not an Array')
  }

  /**
   * Transform json of samples to matrix(2d-array).
   * A Json of samples is formed like :
   *  [
   *    {a:*, b:*, ...},
   *    {a:*, b:*, ...},
   *    ...
   *  ]
   * A matrix(2d-array) is formed like :
   *  [
   *    [*, *, ...],
   *    [*, *, ...],
   *    ...
   *  ]
   * @param {*[]} jsonArr Table in json-array form: [{c1:*,c2:*,..},{c1:*,c2:*,..},..]
   * @returns {*[][]} Table content in 2d-array, excluding the input table head.
   */
  static samplesToMatrix (jsonArr) {
    return [...jsonArr.map(json => Object.values(json))]
  }

  static matrixToSamples (matrix, side, banner) {
    const rows = matrix.map(row => banner.zip(row, (itm, obj) => [itm, obj]))
    const indexedRows = side.zip(rows, (itm, row) => [itm, row])
    let obj = {}
    for (let [k, v] of indexedRows) {
      obj[k] = v
    }
    return obj
  }
}

export {
  Jso,
  JsonTable
}
