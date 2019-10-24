import { Er } from '../misc/Er'
import { Ob } from './Ob'
import { Pivot } from '../utils/Pivot'
import { PivotModes } from '../utils/PivotModes'

/**
 *
 * @param {*[]} arr
 * @param {[*,number][]} fis
 */
const picker = (arr, fis) => {
  let o = {}
  for (let [k, i] of fis) o[k] = arr[i]
  return o
}

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
    if (!Array.isArray(head)) throw new Er('The input \'head\' is not valid.')
    if (!Array.isArray(rows)) throw new Er('The input \'rows\' is not valid.')
    const [row] = rows
    if (!Array.isArray(row)) return null
    const fis = Array.isArray(fields)
      ? fields.map(fd => [fd, head.indexOf(fd)])
      : head.map((fd, i) => [fd, i])
    return rows.map(row => picker(row, fis))
  }

  /**
   *
   * @param {Object[]} samples
   * @param {string[]} [fields]
   * @param {{head:string,rows:string}} [label]
   * @returns {null|{head:*[],rows:*[][]}}
   */
  static toTable (samples, {
    fields = null,
    label = {
      head: 'head',
      rows: 'rows'
    }
  } = {}) {
    if (!Array.isArray(samples)) throw new Er('The input \'rows\' is not an Array')
    const [sample] = samples
    if (!(sample instanceof Object)) return null
    const
      { head, rows } = label,
      [banner, picker] = !!fields
        ? [fields, row => banner.map(x => row[x])]
        : [Object.keys(sample), Object.values],
      rowSet = samples.map(picker)
    return Ob.of(
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

  /**
   *
   * @param {*[][]} matrix
   * @param {*[]} side
   * @param {*[]} banner
   * @param {string} [sideLabel]
   * @returns {Object[]}
   */
  static fromCrosTab ({ matrix, side, banner }, { sideLabel = '_' } = {}) {
    const
      sides = side.map(x => Ob.of([sideLabel, x])),
      rows = matrix.map(row => Ob.ini(banner, row)),
      { length } = sides
    for (let i = 0; i < length; i++) Object.assign(sides[i], rows[i])
    return sides
  }

  static toCrosTab (samples, { side, banner, field }, { mode = PivotModes.array, include } = {}) {
    return new Pivot(samples).pivot([side, banner, field], { mode, include })
  }
}