import './Vec'
import { VehoError } from '../misc/VehoError'

class Jso {

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
  static fromEntries (...entries) {
    let o = {}
    for (let [k, v] of entries) {
      o[k] = v
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
    if (!!samples && samples.constructor === Array) {
      const firstRow = samples[0]
      if (!!firstRow && firstRow.constructor === Array) {
        let [i, len] = [0, Math.min(firstRow.length, banner.length)]
        return samples.map(row => {
          let o = {}
          for (i = 0; i < len; i++) {
            o[banner[i]] = row[i]
          }
          return o
        })
      } else return null
    } else throw new VehoError('The input \'samples\' is not an Array')
  }

  /**
   *
   * @param {Object<string,*>[]}rows
   * @param {string} bannerLabel
   * @param {string} samplesLabel
   * @returns {Object<string,*>}
   */
  static samplesToTable (rows, bannerLabel = 'head', samplesLabel = 'rows') {
    if (!!rows && rows.constructor === Array) {
      const firstRow = rows[0]
      if (!!firstRow && typeof firstRow === 'object') {
        const banner = Object.keys(firstRow)
        const samples = rows.map(row => Object.values(row))
        return Jso.fromEntries(
          [bannerLabel, banner],
          [samplesLabel, samples]
        )
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
