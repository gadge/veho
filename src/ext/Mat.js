/**
 * Static class containing methods to create 2d-array.
 */

import { cloneArray } from '../misc/clone'
import { VehoError } from '../misc/VehoError'

class Mat {
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

  static clone (mx) {
    return mx.map(cloneArray)
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
   * Transpose a 2d-array.
   * @param {*[][]} mx
   * @returns {*[][]}
   */
  static transpose (mx) {
    return Mat.columnIndexes(mx).map(c => mx.map(r => r[c]))
  }

  static column (mx, index) {
    return mx.map(r => r[index])
  }

  /**
   * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
   * @param {*[][]} mx
   * @param elementJect
   * @returns {*[]}
   */
  static veho (mx, elementJect) {
    return mx.map(row => row.map(elementJect))
  }

  /**
   * Iterate through the columns of a 2d-array.
   * @param {*[][]} mx
   * @param {function(*[]):[]} columnJect
   * @returns {*[]}
   */
  static vehoCol (mx, columnJect) {
    return Mat.transpose(mx).map(columnJect)
  }
}

export {
  Mat
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