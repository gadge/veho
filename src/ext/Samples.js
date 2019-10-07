import { VehoError } from '../misc/VehoError'
import { Jso } from './Jso'

/**
 * Transform between Json table and Json of samples.
 * A Json table is formed like :
 *  {
 *    head:[a, b, ...],
 *    rows:*[][]
 *  }.
 * A Json of samples is formed like :
 *  [
 *    {a:*, b:*, ...},
 *    {a:*, b:*, ...},
 *    ...
 *  ]
 */
export class Samples {
  /**
   *
   * @param {*[][]} rows
   * @param {*[]}head
   * @return {Object[]}
   */
  static fromTable ({ head, rows }) {
    if (!!rows && Array.isArray(rows)) {
      const [row] = rows
      if (!!row && Array.isArray(row)) {
        let [i, len] = [0, Math.min(row.length, head.length)]
        return rows.map(row => {
          let o = {}
          for (i = 0; i < len; i++) o[head[i]] = row[i]
          return o
        })
      } else {
        return null
      }
    } else throw new VehoError('The input \'samples\' is not an Array')
  }

  /**
   *
   * @param {Object<string,*>[]}rows
   * @param {string} bannerLabel
   * @param {string} samplesLabel
   * @returns {Object<string,*>|null}
   */
  static toTable2 (rows, bannerLabel = 'head', samplesLabel = 'rows') {
    if (!!rows && Array.isArray(rows)) {
      const [row] = rows
      if (!!row && row instanceof Object) {
        const banner = Object.keys(row)
        const samples = rows.map(row => Object.values(row))
        return Jso.of([bannerLabel, banner], [samplesLabel, samples])
      } else {
        return null
      }
    } else throw new VehoError('The input \'rows\' is not an Array')
  }

  /**
   *
   * @param {*[][]} samples
   * @param {string[]} [fields]
   * @param {{head:string,rows:string}} [label]
   * @returns {null|Object|Object<string, *>}
   */
  static toTable (samples, {
    fields = null,
    label = {
      head: 'head',
      rows: 'rows'
    }
  } = {}) {
    if (!!samples && Array.isArray(samples)) {
      const [firstRow] = samples
      const { head, rows } = label
      if (!!firstRow && firstRow instanceof Object) {
        const [banner, picker] = fields
          ? [fields, row => banner.map(x => row[x])]
          : [Object.keys(firstRow), Object.values]
        const rowSet = samples.map(picker)
        return Jso.of(
          [head, banner],
          [rows, rowSet]
        )
      } else {
        return null
      }
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
   * @param {*[]} samples Table in json-array form: [{c1:*,c2:*,..},{c1:*,c2:*,..},..]
   * @returns {*[][]} Table content in 2d-array, excluding the input table head.
   */
  static toMatrix (samples) {
    return samples.map(Object.values)
  }

  static fromCrosTab ({ matrix, side, banner }) {
    const rows = matrix.map(row => banner.zip(row, (itm, obj) => [itm, obj]))
    const indexedRows = side.zip(rows, (itm, row) => [itm, row])
    let o = {}
    for (let [k, v] of indexedRows) o[k] = v
    return o
  }
}