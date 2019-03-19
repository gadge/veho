'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Static class containing methods create 1d-array.
 */
class Vec {
  /**
   * Create an array.
   * @param {number} size Integer starts at zero.
   * @param {function} jectValue Defines the how index i decides value(i).
   * @returns {number[]} The
   */
  static ini (size, jectValue = (i) => 0) {
    return Array.from({ length: size }, (v, i) => jectValue(i))
  }

  /**
   * Returns an array built from the elements of a given set of arrays.
   * Each element of the returned array is determined by elements from every one of the array-set with the same index.
   * The returned array has length of the first array in the array set.
   * @param {function} zipper The function {x(i)|x(i) ∈ array(i), i ∈ 0,1...n-1, n=arraySet.size} -> y(i), where y
   * is the returned array
   * @param {*[][]} arraySet The array-set to determine the returned array.
   * @returns {*[]} array
   */
  static multiZip (zipper, ...arraySet) {
    const [len, cnt] = [arraySet[0].length, arraySet.length];
    const result = new Array(len);
    for (let i = 0; i < len; i++) {
      const params = new Array(cnt);
      for (let j = 0; j < cnt; j++) {
        params[j] = arraySet[j][i];
      }
      result[i] = zipper(params);
    }
    return result
  }

  /**
   *
   * @param {number} size
   * @param {*} initial
   * @param {function} progress
   * @returns {*[]}
   */
  static progression (size, initial, progress) {
    switch (size) {
      case 0:
        return []
      case 1:
        return [initial]
      default:
        const arr = new Array(size);
        arr[0] = initial;
        for (let i = 1; i < size; i++) {
          arr[i] = progress(arr[i - 1]);
        }
        return arr
    }
  }

  /**
   * Create an arithmetic progression
   * @param {number} size
   * @param {number|string} initial
   * @param {number} delta
   * @returns {*[]}
   */
  static arithmetic (size, initial, delta) {
    return Vec.progression(size, initial, previous => previous + delta)
  }

  /**
   * Create a geometric progression
   * @param {number} size
   * @param {number} initial
   * @param {number} ratio
   * @returns {*[]}}
   */
  static geometric (size, initial, ratio) {
    return Vec.progression(size, initial, previous => previous * ratio)
  }

  /**
   *
   * @param {*[]} ar1
   * @param {*[]} ar2
   * @param {function} product
   * @returns {*[]}
   */
  static decartes (ar1, ar2, product) {
    let arr = [];
    for (let x of ar1) {
      arr.push(...ar2.map(y => product(x, y)));
    }
    return arr
  }

  static randSample (arr) {
    // const len = arr.length
    // switch (len) {
    //   case 0:
    //     return undefined
    //   case 1:
    //     return arr[0]
    //   default:
    //     const idx = Zu.rand(0, len)
    //     return arr[idx]
    // }
    return arr[~~(Math.random() * arr.length)]
  }

  static take (arr, len) {
    return arr.slice(0, len)
  }
}

/**
 * Get the last item in an array.
 * @returns {*}. The last item in the array.
 */
Array.prototype.last = function () {
  return this[this.length - 1]
};

/**
 * Take the first "n" elements from an array.
 * @param len. The number denote the first "n" elements in an array.
 * @returns {*[]}. A new array length at "len".
 */
Array.prototype.take = function (len) {
  return this.slice(0, len)
};

// Array.prototype.zip = function (another, zipper) {
//   let ar = [];
//   for (let i = 0; i < this.length; i++) {
//     ar[i] = zipper(this[i], another[i])
//   }
//   return ar
// };

Array.prototype.zip = function (another, zipper) {
  const arr = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    arr[i] = zipper(this[i], another[i], i);
  }
  return arr
  // return Array.from({ length: size }, (v, i) => zipper(this[i], another[i], i))
  // return this.map((x, i) => zipper(x, another[i]))
};

Array.prototype.multiZip = function (zipper) {
  const [len, cnt] = [this[0].length, this.length];
  const result = new Array(len);
  for (let i = 0; i < len; i++) {
    const params = new Array(cnt);
    for (let j = 0; j < cnt; j++) {
      params[j] = this[j][i];
    }
    result[i] = zipper(...params);
  }
  return result
  // return this.map((x, i) => zipper(x, another[i]))
};

class Jso {

  static toArr (jso) {
    return Object.entries(jso)
  }

  static fromArr (arr, val) {
    let obj = {};
    for (let k of arr) {
      obj[k] = val;
    }
    return obj
  }

  static toMap (jso) {
    return new Map(Object.entries(jso))
  }

  /**
   *
   * @param {Map|[key,value][]} dict
   * @returns {Object}
   */
  static fromMap (dict) {
    let obj = {};
    for (let [k, v] of dict) {
      obj[k] = v;
    }
    return obj
    // return { ...[...dict.entries()] }
    // return Object.fromEntries(map)
  }

  /**
   * Extract content of table in json-array form( [{c1:*,c2:*,..},{c1:*,c2:*,..},..] )
   * to a 2d-array( [[*,*,..],[*,*,..],..] ).
   * @param {*[]} jsonArr Table in json-array form: [{c1:*,c2:*,..},{c1:*,c2:*,..},..]
   * @returns {*[][]} Table content in 2d-array, excluding the input table head.
   */
  static jsonArrayToMatrix (jsonArr) {
    return [...jsonArr.map(json => Object.values(json))]
  }

  static matrixToJsonArray (matrix, side, banner) {
    const rows = matrix.map(row => banner.zip(row, (itm, obj) => [itm, obj]));
    const indexedRows = side.zip(rows, (itm, row) => [itm, row]);
    let obj = {};
    for (let [k, v] of indexedRows) {
      obj[k] = v;
    }
    return obj
  }
}

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
    return Array.from({ length: rowSize }, (x, xIndex) =>
      Array.from({ length: columnSize }, (y, yIndex) =>
        valueJect(xIndex, yIndex)
      )
    )
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
   * @param columnJect
   * @returns {*[]}
   */
  static vehoCol (mx, columnJect) {
    let cols = Mat.transpose(mx);
    return cols.map(columnJect)
  }
}

/**
 * Get the upper bound of rows of a 2d-array.
 * @returns {number}
 */
Array.prototype.xB = function () {
  return this.length - 1
};

/**
 * Get the upper bound of columns of a 2d-array.
 * @returns {number}
 */
Array.prototype.yB = function () {
  return this[0].length - 1
};

/**
 * Get the row of a 2d-array at index "x".
 * @param x
 * @returns {*[]}
 */
Array.prototype.row = function (x) {
  return this[x]
};

/**
 * Get the column of a 2d-array at index "y".
 * @param y
 * @returns {*[]}
 */
Array.prototype.col = function (y) {
  return this.map((row) => row[y])
};

/**
 * Transpose a 2d-array.
 * @returns {*[][]}
 */
Array.prototype.transpose = function () {
  return Mat.transpose(this)
};

/**
 * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
 * @param elementJect
 * @returns {*[]}
 */
Array.prototype.veho = function (elementJect) {
  return Mat.veho(this, elementJect)
};

/**
 * Iterate through the columns of a 2d-array.
 * @param columnJect
 * @returns {any[]}
 */
Array.prototype.vehoCol = function (columnJect) {
  return Mat.vehoCol(this, columnJect)
};

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

class Dic {
  /**
   * Create a map from separate key-array and value-array.
   * @param keys Array of keys.
   * @param values Array of values. The value-array and the key-array need to be equal in size.
   * @returns {Map<*, *>}
   */
  static ini (keys, values) {
    return new Map([keys, values].transpose())
  }
}

exports.Jso = Jso;
exports.Mat = Mat;
exports.Vec = Vec;
exports.Dic = Dic;
