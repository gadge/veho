import { PivotModes } from './PivotModes'

/**
 * Expand the side, 's' and the matrix, 'mx'.
 * @param {*} x
 * @param {*[]} s
 * @param {*[][]} mx
 * @param {function():(Array|number)} cr
 * @returns {number}
 * @private
 */
const vertAmp = (x, { s, mx, cr }) => {
  mx.length ? mx.push(mx[0].map(cr)) : mx.push([])
  return s.push(x)
}

/**
 * Expand the banner, 'b' and the matrix, 'mx'.
 * @param {*} y
 * @param {*[]} b
 * @param {*[][]} mx
 * @param {function():(Array|number)} cr
 * @returns {number}
 * @private
 */
const horiAmp = (y, { b, mx, cr }) => {
  for (let i = mx.length - 1; i >= 0; i--) mx[i].push(cr())
  return b.push(y)
}

const _sel = (row, [x, y, v]) => [row[x], row[y], row[v]]

export class Pivot {
  constructor (rows, mode = PivotModes.array) {
    this.rows = rows
    this.reset(mode)
  }

  roin (x) {
    return this.s.indexOf(x)
  }

  coin (y) {
    return this.b.indexOf(y)
  }

  cooAmp ([x, y]) {
    let i = this.roin(x), j = this.coin(y)
    if (i < 0) i += vertAmp(x, this)
    if (j < 0) j += horiAmp(y, this)
    return [i, j]
  }

  pile ([x, y, v]) {
    let i = this.roin(x), j = this.coin(y)
    if (i < 0) i += vertAmp(x, this)
    if (j < 0) j += horiAmp(y, this)
    return this.mx[i][j].push(v)
  }

  rePile ([x, y, v]) {
    this.mx[this.roin(x)][this.coin(y)].push(v)
  }

  add ([x, y, v]) {
    let i = this.roin(x), j = this.coin(y)
    if (i < 0) i += vertAmp(x, this)
    if (j < 0) j += horiAmp(y, this)
    return this.mx[i][j] += v
  }

  reAdd ([x, y, v]) {
    this.mx[this.roin(x)][this.coin(y)] += v
  }

  pivot (fields, { mode = PivotModes.array, ini = true, include } = {}) {
    if (ini) { this.reset(mode) } else {this.clearMatrix(mode)}
    const
      { rows, s, b, mx } = this,
      accum = this.accumLauncher(mode, ini)
    if (typeof include === 'function') {
      for (let i = 0, { length } = rows, row; i < length; i++) {
        row = rows[i]
        if (!!include(row[fields[2]])) {
          accum(row, fields)
        } else {

        }
      }
    } else {
      for (let i = 0, { length } = rows; i < length; i++)
        accum(rows[i], fields)
    }
    return { side: s, banner: b, matrix: mx }
  }

  accumLauncher (mode = 0, ini = true) {
    switch (mode) {
      case PivotModes.array:
        return ini
          ? (row, fields) => this.pile(_sel(row, fields))
          : (row, fields) => this.rePile(_sel(row, fields))
      case PivotModes.sum:
        return ini
          ? (row, fields) => this.add(_sel(row, fields))
          : (row, fields) => this.reAdd(_sel(row, fields))
      case PivotModes.count:
        return ini
          ? (row, fields) => this.add([row[fields[0]], row[fields[1]], 1])
          : (row, fields) => this.reAdd([row[fields[0]], row[fields[1]], 1])
    }
  }

  reset (mode) {
    this.cr = !mode ? () => [] : () => 0
    this.s = []
    this.b = []
    this.mx = []
  }

  clearMatrix (mode) {
    this.cr = !mode ? () => [] : () => 0
    const { s, b, mx, cr } = this
    let { length: sl } = s, { length: bl } = b, j = --bl
    for (let i = sl - 1; i >= 0; i--)
      for (j = bl; j >= 0; j--)
        mx[i][j] = cr()
  }
}