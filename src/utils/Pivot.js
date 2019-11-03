import { PivotModes } from './PivotModes'
import { Ar } from '../ext/Ar'
import { Mx } from '../ext/Mx'

const { select } = Ar
let s, b, mx, nf

export class Pivot {

  constructor (rows, mode = PivotModes.array) {
    /**
     * @field {*[][]} rows
     * @field {*[]} s
     * @field {*[]} b
     * @field {*[][]} mx
     * @field {function():(Array|number)} nf
     */
    this.rows = rows
    this.reboot(mode)
  }

  reboot (mode) {
    this.nf = !mode ? () => [] : () => 0
    this.s = []
    this.b = []
    this.mx = []
  }

  clearMatrix (mode) {
    this.nf = !mode ? () => [] : () => 0
    this.mx = Mx.ini(this.s?.length, this.b?.length, this.nf)
  }

  x (x) {
    return this.s.indexOf(x)
  }

  y (y) {
    return this.b.indexOf(y)
  }

  /**
   * Expand the side, 's' and the matrix, 'mx'.
   * @param {*} x
   * @returns {number}
   * @private
   */
  rAmp (x) {
    ({ s, mx, nf } = this)
    mx.length ? mx.push(mx[0].map(nf)) : mx.push([])
    return s.push(x)
  }

  /**
   * Expand the banner, 'b' and the matrix, 'mx'.
   * @param {*} y
   * @returns {number}
   * @private
   */
  cAmp (y) {
    ({ b, mx, nf } = this)
    for (let i = mx.length - 1; i >= 0; i--) mx[i].push(nf())
    return b.push(y)
  }

  xAmp (x) {
    let i = this.s.indexOf(x)
    if (i < 0) i += this.rAmp(x)
    return i
  }

  yAmp (y) {
    let j = this.b.indexOf(y)
    if (j < 0) j += this.cAmp(y)
    return j
  }

  amp (x, y) {
    this.xAmp(x)
    this.yAmp(y)
  }

  pile (x, y, v) {
    this.mx[this.x(x)][this.y(y)].push(v)
  }

  pileAmp (x, y, v) {
    return this.mx[this.xAmp(x)][this.yAmp(y)].push(v)
  }

  add (x, y, v) {
    this.mx[this.x(x)][this.y(y)] += v
  }

  addAmp (x, y, v) {
    return this.mx[this.xAmp(x)][this.yAmp(y)] += v
  }

  pivot ([x, y, v], { mode = PivotModes.array, boot = true, include } = {}) {
    if (boot) { this.reboot(mode) } else {this.clearMatrix(mode)}
    const
      { rows, s, b, mx } = this,
      accum = this.accumLauncher(mode, boot, include)
    for (let i = 0, { length } = rows; i < length; i++) accum(rows[i], [x, y, v])
    return { side: s, banner: b, matrix: mx }
  }

  pivotMulti ([x, y, vs], { mode = PivotModes.array, boot = true, include } = {}) {

  }

  accumLauncher (mode = PivotModes.array, boot = true, include) {
    let fn
    const accum = this[(!mode ? 'pile' : 'add') + (boot ? 'Amp' : '')].bind(this)
    if (typeof include === 'function') {
      fn = (mode === PivotModes.count)
        ? ([x, y, v]) => {include(v) ? accum(x, y, 1) : this.amp(x, y)}
        : ([x, y, v]) => {include(v) ? accum(x, y, v) : this.amp(x, y)}
    } else {
      fn = (mode === PivotModes.count)
        ? ([x, y,]) => accum(x, y, 1)
        : ([x, y, v]) => accum(x, y, v)
    }
    return (row, [x, y, v]) => fn(select(row, [x, y, v], 3))
  }
}
