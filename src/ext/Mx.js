/**
 * Static class containing methods to create 2d-array.
 */

import { dpArr } from '../misc/clone'
import { Num, NumLoose } from 'typen'
import { Ar } from './Ar'

const
  { numeric: num } = Num,
  { numeric: numLoose } = NumLoose

class Mx {
  /**
   *
   * @param {number} height
   * @param {number} width
   * @param {function} ject
   * @returns {number[][]}
   */
  static ini (height, width, ject) {
    return Array(height).fill(null).map((_, x) =>
      Array(width).fill(null).map((_, y) =>
        ject(x, y)
      )
    )
  }

  static size (mx) {
    const l = mx?.length
    return [l, l ? mx[0]?.length : undefined]
  }

  static isMat (mx) {
    return Array.isArray(mx) && mx.length
      ? Array.isArray(mx[0])
      : false
  }

  static is (mx) {
    return !!mx && mx.length
      ? !!mx[0]
      : false
  }

  static copy (mx) {
    return mx.map(row => row.slice())
  }

  static clone (mx) {
    return mx.map(dpArr)
  }

  /**
   *
   * @param {*[][]} mx
   * @param {boolean=false} [loose]
   * @returns {*}
   */
  static numeric (mx, { loose = false }) {
    const fn = loose ? numLoose : num
    return mx.map(r => r.map(fn))
  }

  /**
   *
   * @param {*[][]} mx
   * @return {number[]}
   */
  static columnIndexes (mx) {
    return !!mx && mx.length
      ? !!mx[0]
        ? mx[0].map((_, i) => i)
        : []
      : []
  }

  /**
   *
   * @param {*[][]} mx
   * @return {number[]}
   */
  static coins (mx) {
    return !!mx && mx.length
      ? !!mx[0]
        ? mx[0].map((_, i) => i)
        : []
      : []
  }

  /**
   *
   * @param {*[][]} mx
   * @param {number[]} indexes
   * @returns {*}
   */
  static select (mx, ...indexes) {
    const hi = indexes.length
    switch (hi) {
      case 0:
        return mx
      case 1:
        const [i] = indexes
        return Mx.column(mx, i)
      default:
        const { select } = Ar
        return mx.map(row => select(row, indexes, hi))
    }
  }

  /**
   * Transpose a 2d-array.
   * @param {*[][]} mx
   * @returns {*[][]}
   */
  static transpose (mx) {
    return Mx.coins(mx).map(c => mx.map(r => r[c]))
  }

  static column (mx, y) {
    return mx.map(r => r[y])
  }

  /**
   * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
   * @param {*[][]} mx
   * @param {function} fn
   * @returns {*[]}
   */
  static map (mx, fn) {
    return mx.map((r, i) => r.map((el, j) => fn(el, i, j)))
  }

  /**
   * Iterate through the columns of a 2d-array.
   * @param {*[][]} mx
   * @param {function(*[]):[]} fnOnColumn
   * @returns {*[]}
   */
  static mapCol (mx, fnOnColumn) {
    return Mx.transpose(mx).map(fnOnColumn)
  }

  static spliceCols (mx, ys) {
    const hi = ys.length
    switch (hi) {
      case 0:
        return mx
      case 1:
        const [y] = ys
        return mx.map(row => row.splice(y, 1))
      default:
        ys.sort((a, b) => b - a)
        const { splices } = Ar
        return mx.map(row => splices(row, ys, hi))
    }
  }
}

export {
  Mx
}

// Array.prototype.transpose = function () {
//   let mtx = [];
//   for (let j = 0; j < this[0].length; j++) {
//     mtx[j] = [];
//     for (let i = 0; i < this.length; i++) {
//       mtx[j][i] = this[i][j]
//     }
//   }
//   array[0].map((col, i) => array.map(row => row[i]));
//   return mtx
// };
