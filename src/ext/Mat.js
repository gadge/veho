/**
 * Static class containing methods to create 2d-array.
 */
class Mat {
  /**
   *
   * @param {number} rowSize
   * @param {number} columnSize
   * @param {function} valueJect
   * @returns {number[][]}
   */
  static ini (rowSize, columnSize, valueJect) {
    return Array.from({ length: rowSize }, (_, x) =>
      Array.from({ length: columnSize }, (_, y) =>
        valueJect(x, y)
      )
    )
  }

  /**
   *
   * @param {*[][]} mx
   * @return {number[]}
   */
  static columnIndexes (mx) {
    const arr = mx[0]
    return !!arr ? [...arr.keys()] : []
  }

  /**
   * Transpose a 2d-array.
   * @param {*[][]} mx
   * @returns {*[][]}
   */
  static transpose (mx) {
    return Object.keys(mx[0]).map(c => mx.map(r => r[c]))
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

/**
 * Get the upper bound of rows of a 2d-array.
 * @returns {number}
 */
Array.prototype.xB = function () {
  return this.length - 1
}

/**
 * Get the upper bound of columns of a 2d-array.
 * @returns {number}
 */
Array.prototype.yB = function () {
  const first = this[0]
  return !!first ? (first.length - 1) : 0
}

/**
 * Get the row of a 2d-array at index "x".
 * @param x
 * @returns {*[]}
 */
Array.prototype.row = function (x) {
  return this[x]
}

/**
 * Get the column of a 2d-array at index "y".
 * @param y
 * @returns {*[]}
 */
Array.prototype.col = function (y) {
  return this.map((row) => row[y])
}

/**
 * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
 * @param elementJect
 * @returns {*[]}
 */
Array.prototype.veho = function (elementJect) {
  return Mat.veho(this, elementJect)
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