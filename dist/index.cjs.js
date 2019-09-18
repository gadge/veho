'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/**
 *
 * @param {*} node
 * @return {*}
 */
function clone(node) {
  if (!node || typeof node != 'object') return node;

  switch (true) {
    case Array.isArray(node):
      return cloneArray(node);

    case node instanceof Date:
      return new Date(+node);
    // new Date(node.valueOf()) //new Date(+node);

    case node instanceof Map:
      return cloneMap(node);

    case node instanceof Set:
      return new Set(cloneArray([...node]));

    case node instanceof Object:
      return cloneObject(node);
  }

  throw new Error('Unable to copy obj. Unsupported type.');
}
/**
 *
 * @param {Map<*, *>} node
 * @return {Map<*, *>}
 */


function cloneMap(node) {
  return new Map(node.entries().map(([k, v]) => [k, clone(v)]));
}
/**
 *
 * @param {*[]} node
 * @return {*[]}
 */


function cloneArray(node) {
  return node.map(clone);
}
/**
 * Known issue:
 * Unable to clone circular and nested object.
 * @param {{}} node
 * @return {{}}
 */


function cloneObject(node) {
  const x = {};

  for (let [k, v] of Object.entries(node)) x[k] = clone(v);

  return x;
}

class Vec {
  /**
   * Create an array.
   * @param {number} size Integer starts at zero.
   * @param {function} jectValue Defines the how index i decides value(i).
   * @returns {number[]} The
   */
  static ini(size, jectValue = i => 0) {
    return Array.from({
      length: size
    }, (v, i) => jectValue(i));
  }

  /**
   * Returns an array built from the elements of a given set of arrays.
   * Each element of the returned array is determined by elements from every one of the array-set with the same index.
   * The returned array has length of the first array in the array set.
   * @param {function} zipper The function {x(i)|x(i) ∈ array(i), i ∈ 0,1...n-1, n=arraySet.size} -> y(i), where y
   * is the returned array
   * @param {*[][]} arraySet The array-set to determine the returned array.
   * @returns {*[]|undefined} array
   */
  static multiZip(zipper, ...arraySet) {
    const firstArray = arraySet[0];

    if (!!firstArray) {
      const [len, cnt] = [firstArray.length, arraySet.length];
      const result = Array.from({
        length: len
      });

      for (let i = 0; i < len; i++) {
        const params = Array.from({
          length: cnt
        });

        for (let j = 0; j < cnt; j++) {
          params[j] = arraySet[j][i];
        }

        result[i] = zipper(params);
      }

      return result;
    } else {
      return undefined;
    }
  }
  /**
   *
   * @param {number} size
   * @param {*} initial
   * @param {function} progress
   * @returns {*[]}
   */


  static progression(size, initial, progress) {
    switch (size) {
      case 0:
        return [];

      case 1:
        return [initial];

      default:
        const arr = new Array(size);
        arr[0] = initial;

        for (let i = 1; i < size; i++) {
          arr[i] = progress(arr[i - 1]);
        }

        return arr;
    }
  }
  /**
   * Create an arithmetic progression
   * @param {number} size
   * @param {number|string} initial
   * @param {number} delta
   * @returns {*[]}
   */


  static arithmetic(size, initial, delta) {
    return Vec.progression(size, initial, previous => previous + delta);
  }
  /**
   * Create a geometric progression
   * @param {number} size
   * @param {number} initial
   * @param {number} ratio
   * @returns {*[]}}
   */


  static geometric(size, initial, ratio) {
    return Vec.progression(size, initial, previous => previous * ratio);
  }
  /**
   *
   * @param {*[]} ar1
   * @param {*[]} ar2
   * @param {function} product
   * @returns {*[]}
   */


  static decartes(ar1, ar2, product) {
    let arr = [];

    for (let x of ar1) {
      arr.push(...ar2.map(y => product(x, y)));
    }

    return arr;
  }

  static randSample(arr) {
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
    return arr[~~(Math.random() * arr.length)];
  }

  static take(arr, len) {
    return arr.slice(0, len);
  }

} // Array.prototype.zip = function (another, zipper) {
//   let ar = [];
//   for (let i = 0; i < this.length; i++) {
//     ar[i] = zipper(this[i], another[i])
//   }
//   return ar
// };


_defineProperty(Vec, "clone", cloneArray);

// Create an object type VehoError
class VehoError extends Error {
  constructor(message) {
    super();
    this.name = 'VehoError';
    this.message = message;
  } // Make the exception convert to a pretty string when used as
  // a string (e.g. by the error console)


  toString() {
    return this.name + ': "' + this.message + '"';
  }

}

class Jso {
  /**
   *
   * @param {Object<string,*>} jso
   * @return {[string, *][]}
   */
  static toEntries(jso) {
    return Object.entries(jso);
  }
  /**
   * Shallow.
   * @param {string[]} arr
   * @param {*} val
   * @return {Object<string,*>}
   */


  static fromArr(arr, val) {
    let o = {};

    for (let k of arr) {
      o[k] = val;
    }

    return o;
  }
  /**
   * Shallow.
   * @param {...[*,*]} entries - An array of key-value pair, [key, value]
   * @returns {Object|Object<string,*>}
   */


  static of(...entries) {
    let o = {};

    for (let [k, v] of entries) {
      o[k] = v;
    }

    return o;
  }
  /**
   * Shallow.
   * @param {[*,*]} entries - An array of key-value pair, [key, value]
   * @param {function(*):*|function(*,number):*} [ject] - A function
   * @returns {Object|Object<string,*>}
   */


  static fromEntries(entries, ject) {
    let o = {};

    if (!!ject) {
      switch (ject.length) {
        case 1:
          for (let [k, v] of entries) o[k] = ject(v);

          break;

        case 2:
          for (let [i, [k, v]] of entries.entries()) o[k] = ject(v, i);

          break;

        default:
          break;
      }
    } else {
      for (let [k, v] of entries) {
        o[k] = v;
      }
    }

    return o;
  }
  /**
   *
   * @param {Object<string,*>} jso
   * @return {Map<string, *>}
   */


  static toMap(jso) {
    return new Map(Object.entries(jso));
  }
  /**
   *
   * @param {Map<string,*>} dict - A map
   * @returns {Object<string,*>} A json object
   */


  static fromMap(dict) {
    let o = {};

    for (let [k, v] of dict.entries()) {
      o[k] = v;
    }

    return o; // return Object.fromEntries(dict)
  }

}
/**
 * Transform between Json table and Json of samples.
 * A Json table is formed like :
 *  {
 *    headers:[a, b, ...],
 *    rowSet:*[][]
 *  }.
 * A Json of samples is formed like :
 *  [
 *    {a:*, b:*, ...},
 *    {a:*, b:*, ...},
 *    ...
 *  ]
 */


_defineProperty(Jso, "clone", cloneObject);

class JsonTable {
  /**
   *
   * @param {*[][]} samples
   * @param {*[]}banner
   * @return {Object[]}
   */
  static tableToSamples(samples, banner) {
    if (!!samples && samples.constructor === Array) {
      const firstRow = samples[0];

      if (!!firstRow && firstRow.constructor === Array) {
        let [i, len] = [0, Math.min(firstRow.length, banner.length)];
        return samples.map(row => {
          let o = {};

          for (i = 0; i < len; i++) {
            o[banner[i]] = row[i];
          }

          return o;
        });
      } else return null;
    } else throw new VehoError('The input \'samples\' is not an Array');
  }
  /**
   *
   * @param {Object<string,*>[]}rows
   * @param {string} bannerLabel
   * @param {string} samplesLabel
   * @returns {Object<string,*>}
   */


  static samplesToTable(rows, bannerLabel = 'head', samplesLabel = 'rows') {
    if (!!rows && rows.constructor === Array) {
      const firstRow = rows[0];

      if (!!firstRow && typeof firstRow === 'object') {
        const banner = Object.keys(firstRow);
        const samples = rows.map(row => Object.values(row));
        return Jso.of([bannerLabel, banner], [samplesLabel, samples]);
      } else return null;
    } else throw new VehoError('The input \'rows\' is not an Array');
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
   * @param {*[]} jsonArr Table in json-array form: [{c1:*,c2:*,..},{c1:*,c2:*,..},..]
   * @returns {*[][]} Table content in 2d-array, excluding the input table head.
   */


  static samplesToMatrix(jsonArr) {
    return [...jsonArr.map(json => Object.values(json))];
  }

  static matrixToSamples(matrix, side, banner) {
    const rows = matrix.map(row => banner.zip(row, (itm, obj) => [itm, obj]));
    const indexedRows = side.zip(rows, (itm, row) => [itm, row]);
    let obj = {};

    for (let [k, v] of indexedRows) {
      obj[k] = v;
    }

    return obj;
  }

}

/**
 * Static class containing methods to create 2d-array.
 */

class Mat {
  /**
   *
   * @param {number} height
   * @param {number} width
   * @param {function} ject
   * @returns {number[][]}
   */
  static ini(height, width, ject) {
    return Array.from({
      length: height
    }, (_, x) => Array.from({
      length: width
    }, (_, y) => ject(x, y)));
  }
  /**
   *
   * @param {*[][]} mx
   * @return {number[]}
   */


  static columnIndexes(mx) {
    const arr = mx[0];
    return !!arr ? [...arr.keys()] : [];
  }
  /**
   * Transpose a 2d-array.
   * @param {*[][]} mx
   * @returns {*[][]}
   */


  static transpose(mx) {
    return Mat.columnIndexes(mx).map(c => mx.map(r => r[c]));
  }

  static column(mx, index) {
    return mx.map(r => r[index]);
  }
  /**
   * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
   * @param {*[][]} mx
   * @param elementJect
   * @returns {*[]}
   */


  static veho(mx, elementJect) {
    return mx.map(row => row.map(elementJect));
  }
  /**
   * Iterate through the columns of a 2d-array.
   * @param {*[][]} mx
   * @param {function(*[]):[]} columnJect
   * @returns {*[]}
   */


  static vehoCol(mx, columnJect) {
    return Mat.transpose(mx).map(columnJect);
  }

}
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
   * @param {*[]} keys Array of keys.
   * @param {*[]} values Array of values. The value-array and the key-array need to be equal in size.
   * @returns {Map<*, *>}
   */
  static ini(keys, values) {
    const lex = keys.map((k, i) => [k, values[i]]);
    return new Map(lex);
  }

}

_defineProperty(Dic, "clone", cloneMap);

class Fun {
  static getMethodNames(cls) {
    return !!cls && !!cls.prototype ? Object.getOwnPropertyNames(cls.prototype) : [];
  }
  /**
   *
   * @param {class} cls
   * @return {string[]}
   */


  static getStaticMethodNames(cls) {
    return Object.getOwnPropertyNames(cls).filter(prop => typeof cls[prop] === 'function');
  }
  /**
   *
   * @param {class} cls
   * @return {string[]}
   */


  static getStaticPropertyNames(cls) {
    return Object.keys(cls);
  }
  /**
   *
   * @param {function(*): *} pointwiseFunc
   * @return {function(*[]): *[]}
   */


  static rowwise(pointwiseFunc) {
    return row => row.map(x => pointwiseFunc(x));
  }
  /**
   *
   * @param {function(*): *} seinFunc function
   * @param {function(*): *} funcs function whose sole parameter and return value are typed identically
   * @return {function(*): *}
   */


  static chain(seinFunc, ...funcs) {
    return funcs.reduce((prevFunc, currFunc) => x => currFunc(prevFunc(x)), seinFunc);
  }

}

// /**
//  * Get the last item in an array.
//  * @returns {*}. The last item in the array.
//  */
// Array.prototype.last = function () {
//   return this[this.length - 1]
// }

/**
 * Take the first "n" elements from an array.
 * @param len. The number denote the first "n" elements in an array.
 * @returns {*[]}. A new array length at "len".
 */

Array.prototype.take = function (len) {
  return this.slice(0, len);
};

Array.prototype.zip = function (another, zipper) {
  const length = this.length;
  const arr = Array.from({
    length
  });

  for (let i = 0; i < length; i++) {
    arr[i] = zipper(this[i], another[i], i);
  }

  return arr; // return Array.from({ length: size }, (v, i) => zipper(this[i], another[i], i))
  // return this.map((x, i) => zipper(x, another[i]))
}; // Matrix extension

exports.Dic = Dic;
exports.Fun = Fun;
exports.Jso = Jso;
exports.JsonTable = JsonTable;
exports.Mat = Mat;
exports.Vec = Vec;
