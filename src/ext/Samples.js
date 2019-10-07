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
   * @param {*[]} head
   * @param {*[][]} rows
   * @param {*[]} [fields]
   * @return {Object[]}
   */
  static fromTable ({ head, rows }, fields) {
    if (!head || !Array.isArray(head)) throw new VehoError('The input \'head\' is not valid.')
    if (!rows || !Array.isArray(rows)) throw new VehoError('The input \'rows\' is not valid.')
    const [row] = rows
    if (!row || !Array.isArray(row)) return null

    let k_i = fields && Array.isArray(fields)
      ? fields.map(field => [field, head.indexOf(field)])
      : [...head.entries()].map(([k, v]) => [v, k])
    return rows.map(row => {
      let o = {}
      for (let [k, i] of k_i) o[k] = row[i]
      return o
    })
  }

  /**
   *
   * @param {Object[]} samples
   * @param {string[]} [fields]
   * @param {{head:string,rows:string}} [label]
   * @returns {null|{head:*[],rows:*[][]}|Object}
   */
  static toTable (samples, {
    fields = null,
    label = {
      head: 'head',
      rows: 'rows'
    }
  } = {}) {
    if (!samples || !Array.isArray(samples)) throw new VehoError('The input \'rows\' is not an Array')
    const [sample] = samples
    if (!sample || !(sample instanceof Object)) return null

    const { head, rows } = label
    const [banner, picker] = fields
      ? [fields, row => banner.map(x => row[x])]
      : [Object.keys(sample), Object.values]
    const rowSet = samples.map(picker)
    return Jso.of(
      [head, banner],
      [rows, rowSet]
    )
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
   * @param {Object[]} samples Table in json-array form: [{c1:*,c2:*,..},{c1:*,c2:*,..},..]
   * @returns {*[][]} Table content in 2d-array, excluding the input table head.
   */
  static toMatrix (samples) {
    return samples.map(Object.values)
  }

  static fromCrosTab ({ matrix, side, banner }) {
    const sampleList = matrix.map(row => Jso.ini(banner, row))
    const result = Jso.ini(side, sampleList)
    return result
  }
}