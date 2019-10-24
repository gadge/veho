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

const _amp = function (x, y) {
  this.roiAmp(x)
  this.coiAmp(y)
}

export class Pivot {
  constructor (rows, mode = PivotModes.array) {
    this.rows = rows
    this.cr = !mode ? () => [] : () => 0
    this.s = []
    this.b = []
    this.mx = []
  }

  roi (x) {
    return this.s.indexOf(x)
  }

  coi (y) {
    return this.b.indexOf(y)
  }

  roiAmp (x) {
    let i = this.s.indexOf(x)
    if (i < 0) i += vertAmp(x, this)
    return i
  }

  coiAmp (y) {
    let j = this.b.indexOf(y)
    if (j < 0) j += horiAmp(y, this)
    return j
  }

  pileAmp ([x, y, v]) {
    return this.mx[this.roiAmp(x)][this.coiAmp(y)].push(v)
  }

  addAmp ([x, y, v]) {
    return this.mx[this.roiAmp(x)][this.coiAmp(y)] += v
  }

  pileRep ([x, y, v]) {
    this.mx[this.roi(x)][this.coi(y)].push(v)
  }

  addRep ([x, y, v]) {
    this.mx[this.roi(x)][this.coi(y)] += v
  }

  pivot (fields, { mode = PivotModes.array, ini = true, include } = {}) {
    if (ini) { this.reset(mode) } else {this.clearMatrix(mode)}
    const
      { rows, s, b, mx } = this,
      accum = this.accumLauncher(mode, ini, include)
    for (let i = 0, { length } = rows; i < length; i++) accum(rows[i], fields)
    return { side: s, banner: b, matrix: mx }
  }

  accumLauncher (mode = 0, ini = true, include) {
    let f
    const accum = this[(!mode ? 'pile' : 'add') + (ini ? 'Amp' : 'Rep')].bind(this)
    if (typeof include === 'function') {
      const amp = _amp.bind(this)
      f = (mode === PivotModes.count)
        ? ([x, y, v]) => {include(v) ? accum([x, y, 1]) : amp(x, y)}
        : ([x, y, v]) => {include(v) ? accum([x, y, v]) : amp(x, y)}
    } else {
      f = (mode === PivotModes.count)
        ? ([x, y]) => {accum([x, y, 1]) }
        : accum
    }
    return (row, fields) => f(_sel(row, fields))
  }

  reset (mode) {
    this.cr = !mode ? () => [] : () => 0
    this.s = []
    this.b = []
    this.mx = []
  }

  clearMatrix (mode) {
    this.cr = !mode ? () => [] : () => 0
    const { s, b, cr } = this
    let { length: sl } = s, { length: bl } = b, j
    const mx = Array(sl--)
    for (let i = sl; i >= 0; i--) {
      mx[i] = Array(bl)
      for (j = bl - 1; j >= 0; j--)
        mx[i][j] = cr()
    }
    this.mx = mx
  }
}