'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var typen = require('typen');

const PivotModes = {
  array: 0,
  sum: 1,
  count: 2
};

/**
 * Expand the side, 's' and the matrix, 'mx'.
 * @param {*} x
 * @param {*[]} s
 * @param {*[][]} mx
 * @param {function():(Array|number)} cr
 * @returns {number}
 * @private
 */

const vertAmp = (x, {
  s,
  mx,
  cr
}) => {
  mx.length ? mx.push(mx[0].map(cr)) : mx.push([]);
  return s.push(x);
};
/**
 * Expand the banner, 'b' and the matrix, 'mx'.
 * @param {*} y
 * @param {*[]} b
 * @param {*[][]} mx
 * @param {function():(Array|number)} cr
 * @returns {number}
 * @private
 */


const horiAmp = (y, {
  b,
  mx,
  cr
}) => {
  for (let i = mx.length - 1; i >= 0; i--) mx[i].push(cr());

  return b.push(y);
};

const _sel = (row, [x, y, v]) => [row[x], row[y], row[v]];

const _amp = function (x, y) {
  this.roiAmp(x);
  this.coiAmp(y);
};

class Pivot {
  constructor(rows, mode = PivotModes.array) {
    this.rows = rows;
    this.cr = !mode ? () => [] : () => 0;
    this.s = [];
    this.b = [];
    this.mx = [];
  }

  roi(x) {
    return this.s.indexOf(x);
  }

  coi(y) {
    return this.b.indexOf(y);
  }

  roiAmp(x) {
    let i = this.s.indexOf(x);
    if (i < 0) i += vertAmp(x, this);
    return i;
  }

  coiAmp(y) {
    let j = this.b.indexOf(y);
    if (j < 0) j += horiAmp(y, this);
    return j;
  }

  pileAmp([x, y, v]) {
    return this.mx[this.roiAmp(x)][this.coiAmp(y)].push(v);
  }

  addAmp([x, y, v]) {
    return this.mx[this.roiAmp(x)][this.coiAmp(y)] += v;
  }

  pileRep([x, y, v]) {
    this.mx[this.roi(x)][this.coi(y)].push(v);
  }

  addRep([x, y, v]) {
    this.mx[this.roi(x)][this.coi(y)] += v;
  }

  pivot(fields, {
    mode = PivotModes.array,
    ini = true,
    include
  } = {}) {
    if (ini) {
      this.reset(mode);
    } else {
      this.clearMatrix(mode);
    }

    const {
      rows,
      s,
      b,
      mx
    } = this,
          accum = this.accumLauncher(mode, ini, include);

    for (let i = 0, {
      length
    } = rows; i < length; i++) accum(rows[i], fields);

    return {
      side: s,
      banner: b,
      matrix: mx
    };
  }

  accumLauncher(mode = 0, ini = true, include) {
    let f;
    const accum = this[(!mode ? 'pile' : 'add') + (ini ? 'Amp' : 'Rep')].bind(this);

    if (typeof include === 'function') {
      const amp = _amp.bind(this);

      f = mode === PivotModes.count ? ([x, y, v]) => {
        include(v) ? accum([x, y, 1]) : amp(x, y);
      } : ([x, y, v]) => {
        include(v) ? accum([x, y, v]) : amp(x, y);
      };
    } else {
      f = mode === PivotModes.count ? ([x, y]) => {
        accum([x, y, 1]);
      } : accum;
    }

    return (row, fields) => f(_sel(row, fields));
  }

  reset(mode) {
    this.cr = !mode ? () => [] : () => 0;
    this.s = [];
    this.b = [];
    this.mx = [];
  }

  clearMatrix(mode) {
    this.cr = !mode ? () => [] : () => 0;
    const {
      s,
      b,
      cr
    } = this;
    let {
      length: sl
    } = s,
        {
      length: bl
    } = b,
        j;
    const mx = Array(sl--);

    for (let i = sl; i >= 0; i--) {
      mx[i] = Array(bl);

      for (j = bl - 1; j >= 0; j--) mx[i][j] = cr();
    }

    this.mx = mx;
  }

}

const oc = Object.prototype.toString;
/**
 *
 * @param {*} o
 * @return {*}
 */

function clone(o) {
  if (!o || typeof o !== 'object') return o;

  switch (oc.call(o).slice(8, 11)) {
    case 'Arr':
      return dpArr(o);

    case 'Obj':
      return dpObj(o);

    case 'Map':
      return dpMap(o);

    case 'Dat':
      return new Date(+o);

    case 'Set':
      return new Set(dpArr([...o]));
  }

  throw new Error('Unable to copy obj. Unsupported type.');
}
/**
 *
 * @param {Map<*, *>} o
 * @return {Map<*, *>}
 */


function dpMap(o) {
  return new Map([...o.entries()].map(([k, v]) => [k, clone(v)]));
}
/**
 *
 * @param {*[]} o
 * @return {*[]}
 */


function dpArr(o) {
  return o.map(clone);
}
/**
 * Known issue:
 * Unable to clone circular and nested object.
 * @param {{}} o
 * @return {{}}
 */


function dpObj(o) {
  const x = {};

  for (let [k, v] of Object.entries(o)) x[k] = clone(v);

  return x;
}

/**
 * Static class containing methods create 1d-array.
 */
const {
  numeric: num
} = typen.Num,
      {
  numeric: numLoose
} = typen.NumLoose;

class Ar {
  /**
   * Create an array.
   * @param {number} size Integer starts at zero.
   * @param {function(number):*|*} [ject] Defines the how index i decides value(i).
   * @returns {number[]} The
   */
  static ini(size, ject) {
    if (size <= 128) {
      let arr = [];

      if (typeof ject === 'function') {
        for (let i = 0; i < size; i++) arr[i] = ject(i);
      } else {
        for (let i = 0; i < size; i++) arr[i] = ject;
      }

      return arr;
    } else {
      return typeof ject === 'function' ? Array(size).fill(null).map((_, i) => ject(i)) : Array(size).fill(ject);
    }
  }

  static isEmpty(arr) {
    return !arr || !arr.length;
  }
  /**
   *
   * @param {Array} arr
   * @param {boolean} [loose]=false
   * @returns {*}
   */


  static numeric(arr, {
    loose = false
  }) {
    return arr.map(loose ? numLoose : num);
  }

  static clone(arr) {
    return dpArr(arr);
  }

  static indexes(arr) {
    return arr.map((_, i) => i);
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
      const result = Array(len);

      for (let i = 0; i < len; i++) {
        const params = Array(cnt);

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
    return Ar.progression(size, initial, previous => previous + delta);
  }
  /**
   * Create a geometric progression
   * @param {number} size
   * @param {number} initial
   * @param {number} ratio
   * @returns {*[]}}
   */


  static geometric(size, initial, ratio) {
    return Ar.progression(size, initial, previous => previous * ratio);
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

/**
 * Static class containing methods to create 2d-array.
 */
const {
  numeric: num$1
} = typen.Num,
      {
  numeric: numLoose$1
} = typen.NumLoose;

class Mx {
  /**
   *
   * @param {number} height
   * @param {number} width
   * @param {function} ject
   * @returns {number[][]}
   */
  static ini(height, width, ject) {
    return Array(height).fill(null).map((_, x) => Array(width).fill(null).map((_, y) => ject(x, y)));
  }

  static size(mx) {
    var _mx$;

    const l = mx === null || mx === void 0 ? void 0 : mx.length;
    return [l, l ? (_mx$ = mx[0]) === null || _mx$ === void 0 ? void 0 : _mx$.length : undefined];
  }

  static isMat(mx) {
    return Array.isArray(mx) && mx.length ? Array.isArray(mx[0]) : false;
  }

  static is(mx) {
    return !!mx && mx.length ? !!mx[0] : false;
  }

  static clone(mx) {
    return mx.map(dpArr);
  }
  /**
   *
   * @param {*[][]} mx
   * @param {boolean=false} [loose]
   * @returns {*}
   */


  static numeric(mx, {
    loose = false
  }) {
    const fn = loose ? numLoose$1 : num$1;
    return mx.map(r => r.map(fn));
  }
  /**
   *
   * @param {*[][]} mx
   * @return {number[]}
   */


  static columnIndexes(mx) {
    return !!mx && mx.length ? !!mx[0] ? mx[0].map((_, i) => i) : [] : [];
  }
  /**
   *
   * @param {*[][]} mx
   * @return {number[]}
   */


  static coins(mx) {
    return !!mx && mx.length ? !!mx[0] ? mx[0].map((_, i) => i) : [] : [];
  }
  /**
   * Transpose a 2d-array.
   * @param {*[][]} mx
   * @returns {*[][]}
   */


  static transpose(mx) {
    return Mx.columnIndexes(mx).map(c => mx.map(r => r[c]));
  }

  static column(mx, index) {
    return mx.map(r => r[index]);
  }
  /**
   * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
   * @param {*[][]} mx
   * @param {function} fn
   * @returns {*[]}
   */


  static map(mx, fn) {
    return mx.map((r, i) => r.map((el, j) => fn(el, i, j)));
  }
  /**
   * Iterate through the columns of a 2d-array.
   * @param {*[][]} mx
   * @param {function(*[]):[]} fnOnColumn
   * @returns {*[]}
   */


  static mapCol(mx, fnOnColumn) {
    return Mx.transpose(mx).map(fnOnColumn);
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

// Create an object type Er
class Er extends Error {
  constructor(name, message) {
    super();
    this.name = name;
    this.message = message;
  }

  static ini({
    name,
    message
  }) {
    return new Er(name || 'Error', message || '');
  } // Make the exception convert to a pretty string when used as
  // a string (e.g. by the error console)


  toString() {
    return `${this.name}: "${this.message}"`;
  }

}

class Dc {
  /**
   * Create a map from separate key-array and value-array.
   * @param {*[]} keys Array of keys.
   * @param {*[]} values Array of values. The value-array and the key-array need to be equal in size.
   * @returns {Map<*, *>}
   */
  static ini(keys, values) {
    // const lex = keys.map((k, i) => [k, values[i]])
    // return new Map(lex)
    if (!keys || !values || !Array.isArray(keys) || !Array.isArray(values)) throw Er('The input contains invalid array.');
    const {
      length
    } = keys,
          map = new Map();

    for (let i = 0; i < length; i++) map.set(keys[i], values[i]);

    return map;
  }

  static clone(dc) {
    return dpMap(dc);
  }

}

// import './Ar'

class Ob {
  /**
   * Create a object from separate key-array and value-array.
   * @param {*[]} keys Array of keys.
   * @param {*[]} values Array of values. The value-array and the key-array need to be equal in size.
   * @returns {Object<*, *>}
   */
  static ini(keys, values) {
    const o = {},
          {
      length
    } = keys;

    for (let i = 0; i < length; i++) o[keys[i]] = values[i]; // let i, k; for ([i, k] of keys.entries()) o[k] = values[i]


    return o;
  }
  /**
   *
   * @param {Object<string,*>} jso
   * @return {[string, *][]}
   */


  static entries(jso) {
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

    for (let k of arr) o[k] = val;

    return o;
  }
  /**
   * Shallow.
   * @param {...[*,*]} entries - An array of key-value pair, [key, value]
   * @returns {Object|Object<string,*>}
   */


  static of(...entries) {
    let o = {};

    for (let [k, v] of entries) o[k] = v;

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
      }
    } else {
      for (let [k, v] of entries) o[k] = v;
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

    for (let [k, v] of dict.entries()) o[k] = v;

    return o; // return Object.fromEntries(dict)
  }

  static clone(jso) {
    return dpObj(jso);
  }

}

/**
 *
 * @param {*[]} arr
 * @param {[*,number][]} fis
 */

const picker = (arr, fis) => {
  let o = {};

  for (let [k, i] of fis) o[k] = arr[i];

  return o;
};
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


class Samples {
  /**
   *
   * @param {*[]} head
   * @param {*[][]} rows
   * @param {*[]} [fields]
   * @return {Object[]}
   */
  static fromTable({
    head,
    rows
  }, fields) {
    if (!Array.isArray(head)) throw new Er('The input \'head\' is not valid.');
    if (!Array.isArray(rows)) throw new Er('The input \'rows\' is not valid.');
    const [row] = rows;
    if (!Array.isArray(row)) return null;
    const fis = Array.isArray(fields) ? fields.map(fd => [fd, head.indexOf(fd)]) : head.map((fd, i) => [fd, i]);
    return rows.map(row => picker(row, fis));
  }
  /**
   *
   * @param {Object[]} samples
   * @param {string[]} [fields]
   * @param {{head:string,rows:string}} [label]
   * @returns {null|{head:*[],rows:*[][]}}
   */


  static toTable(samples, {
    fields = null,
    label = {
      head: 'head',
      rows: 'rows'
    }
  } = {}) {
    if (!Array.isArray(samples)) throw new Er('The input \'rows\' is not an Array');
    const [sample] = samples;
    if (!(sample instanceof Object)) return null;
    const {
      head,
      rows
    } = label,
          [banner, picker] = !!fields ? [fields, row => banner.map(x => row[x])] : [Object.keys(sample), Object.values],
          rowSet = samples.map(picker);
    return Ob.of([head, banner], [rows, rowSet]);
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


  static toMatrix(samples) {
    return samples.map(Object.values);
  }
  /**
   *
   * @param {*[][]} matrix
   * @param {*[]} side
   * @param {*[]} banner
   * @param {string} [sideLabel]
   * @returns {Object[]}
   */


  static fromCrosTab({
    matrix,
    side,
    banner
  }, {
    sideLabel = '_'
  } = {}) {
    const sides = side.map(x => Ob.of([sideLabel, x])),
          rows = matrix.map(row => Ob.ini(banner, row)),
          {
      length
    } = sides;

    for (let i = 0; i < length; i++) Object.assign(sides[i], rows[i]);

    return sides;
  }

  static toCrosTab(samples, {
    side,
    banner,
    field
  }, {
    mode = PivotModes.array,
    include
  } = {}) {
    return new Pivot(samples).pivot([side, banner, field], {
      mode,
      include
    });
  }

}

class Fn {
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

/**
 * Take the first "n" elements from an array.
 * @param len. The number denote the first "n" elements in an array.
 * @returns {*[]}. A new array length at "len".
 */
Array.prototype.take = function (len) {
  return this.slice(0, len);
};

Array.prototype.zip = function (another, zipper) {
  const {
    length
  } = this,
        arr = Array(length);

  for (let i = 0; i < length; i++) arr[i] = zipper(this[i], another[i], i);

  return arr; // return Array.from({ length: size }, (v, i) => zipper(this[i], another[i], i))
  // return this.map((x, i) => zipper(x, another[i]))
};

exports.Ar = Ar;
exports.Dc = Dc;
exports.Fn = Fn;
exports.Mx = Mx;
exports.Ob = Ob;
exports.Pivot = Pivot;
exports.PivotModes = PivotModes;
exports.Samples = Samples;
exports.clone = clone;
