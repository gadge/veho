import { Num, NumLoose } from 'typen';

const PivotModes = {
  array: 0,
  sum: 1,
  count: 2
};

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
} = Num,
      {
  numeric: numLoose
} = NumLoose;

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

  static mutateMap(arr, fn, l) {
    l = l || arr.length;

    for (--l; l >= 0b0; l--) arr[l] = fn(arr[l], l);

    return arr;
  }

  static map(arr, fn, l) {
    l = l || arr.length;
    const vc = Array(l);

    for (--l; l >= 0b0; l--) vc[l] = fn(arr[l], l);

    return vc;
  }

  static select(arr, indexes, hi) {
    hi = hi || indexes.length;
    const vc = Array(hi);

    for (--hi; hi >= 0b0; hi--) vc[hi] = arr[indexes[hi]];

    return vc;
  }
  /**
   *
   * @param {*[]} arr
   * @param {number[]} indexes - number indexes of the positions to be spliced, should be in ascending order.
   * @param {number} [hi]
   * @returns {*[]}
   */


  static splices(arr, indexes, hi) {
    hi = hi || indexes.length;

    for (--hi; hi >= 0b0; hi--) arr.splice(indexes[hi], 1);

    return arr;
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
    const l1 = ar1.length,
          l2 = ar2.length;
    let arr = Array(l1 * l2);

    for (let i = 0, j, k = 0; i < l1; i++) {
      for (j = 0; j < l2; j++) {
        arr[k++] = product(ar1[i], ar2[j]);
      }
    }

    return arr; // for (let x of ar1) {
    //   arr.push(...ar2.map(y => product(x, y)))
    // }
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

  static zip(arL, arR, zipper, l) {
    l = l || arL.length;
    const vc = Array(l);

    for (--l; l >= 0; l--) vc[l] = zipper(arL[l], arR[l], l);

    return vc;
  }

} // Array.prototype.zip = function (another, zipper) {

const {
  numeric: num$1
} = Num,
      {
  numeric: numLoose$1
} = NumLoose,
      {
  map: mapAr
} = Ar;
/**
 * Static class containing methods to create 2d-array.
 */

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
    return mx && mx.length ? !!mx[0] : false;
  }

  static copy(mx) {
    return mx.map(row => row.slice());
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
    return !mx || !mx.length ? [] : !mx[0] ? [] : mx[0].map((_, i) => i);
  }
  /**
   *
   * @param {*[][]} mx
   * @return {number[]}
   */


  static coins(mx) {
    return !mx || !mx.length ? [] : !mx[0] ? [] : mx[0].map((_, i) => i);
  }
  /**
   *
   * @param {*[][]} mx
   * @param {number[]} indexes
   * @returns {*}
   */


  static select(mx, ...indexes) {
    const hi = indexes.length;

    switch (hi) {
      case 0:
        return mx;

      case 1:
        const [i] = indexes;
        return Mx.column(mx, i);

      default:
        const {
          select
        } = Ar;
        return mx.map(row => select(row, indexes, hi));
    }
  }
  /**
   * Transpose a 2d-array.
   * @param {*[][]} mx
   * @returns {*[][]}
   */


  static transpose(mx) {
    return Mx.coins(mx).map(c => mx.map(r => r[c]));
  }

  static column(mx, y) {
    return mx.map(r => r[y]);
  }

  static mutateCol(mx, y, fn) {
    for (let i = 0, r, l = mx.length; i < l; i++) {
      r = mx[i];
      r[y] = fn(r[y]);
    }

    return mx;
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
    var _Mx$transpose$map;

    return _Mx$transpose$map = Mx.transpose(mx).map(fnOnColumn), Mx.transpose(_Mx$transpose$map);
  }

  static spliceCols(mx, ys) {
    const hi = ys.length;

    switch (hi) {
      case 0:
        return mx;

      case 1:
        const [y] = ys;
        return mx.map(row => {
          row.splice(y, 1);
          return row;
        });

      default:
        const {
          splices
        } = Ar;
        return mx.map(row => splices(row, ys, hi));
    }
  }
  /**
   *
   * @param {*[][][]} matrices - a list of 2d-array
   * @param {function(*[]):*} [zipper]
   */


  static zip(matrices, zipper) {
    const hi = matrices === null || matrices === void 0 ? void 0 : matrices.length,
          [ht, wd] = Mx.size(matrices[0]);
    return typeof zipper !== 'function' ? Mx.ini(ht, wd, (i, j) => mapAr(matrices, mx => mx[i][j], hi)) : Mx.ini(ht, wd, (i, j) => zipper(mapAr(matrices, mx => mx[i][j], hi)));
  }

}

class PivotUtils {
  static nullifierLauncher(mode) {
    return !mode ? () => [] : () => 0;
  }

  static pivotMode(stat) {
    switch (typeof stat) {
      case 'string':
        return PivotModes[stat] || PivotModes.count;

      case 'function':
        return PivotModes.array;
    }
  }

}

const {
  select,
  map: mapAr$1
} = Ar;
let s, b, mx;
const {
  nullifierLauncher,
  pivotMode
} = PivotUtils;
class Pivot {
  constructor(rows, mode = PivotModes.array) {
    /**
     * @field {*[][]} rows
     * @field {*[]} s
     * @field {*[]} b
     * @field {*[][]} mx
     * @field {function():(Array|number)} nf
     */
    this.rows = rows;
    this.reboot(mode);
  }

  reboot() {
    this.s = [];
    this.b = [];
    this.mx = [];
  }

  clearMatrix(mode) {
    var _this$s, _this$b;

    this.mx = Mx.ini((_this$s = this.s) === null || _this$s === void 0 ? void 0 : _this$s.length, (_this$b = this.b) === null || _this$b === void 0 ? void 0 : _this$b.length, nullifierLauncher(mode));
  }

  x(x) {
    return this.s.indexOf(x);
  }

  y(y) {
    return this.b.indexOf(y);
  }
  /**
   * Expand the side, 's' and the matrix, 'mx'.
   * @param {*} x
   * @param {function():[]|function():number} nf
   * @returns {number}
   * @private
   */


  rAmp(x, nf) {
    ({
      s,
      mx
    } = this);
    mx.length ? mx.push(mx[0].map(nf)) : mx.push([]);
    return s.push(x);
  }
  /**
   * Expand the banner, 'b' and the matrix, 'mx'.
   * @param {*} y
   * @param {function():[]|function():number} nf
   * @returns {number}
   * @private
   */


  cAmp(y, nf) {
    ({
      b,
      mx
    } = this);

    for (let i = mx.length - 1; i >= 0; i--) mx[i].push(nf());

    return b.push(y);
  }

  xAmp(x, nf) {
    let i = this.s.indexOf(x);
    if (i < 0) i += this.rAmp(x, nf);
    return i;
  }

  yAmp(y, nf) {
    let j = this.b.indexOf(y);
    if (j < 0) j += this.cAmp(y, nf);
    return j;
  }

  amp(x, y, nf) {
    this.xAmp(x, nf);
    this.yAmp(y, nf);
  }

  add(x, y, v) {
    this.mx[this.x(x)][this.y(y)] += v;
  }

  pile(x, y, v) {
    this.mx[this.x(x)][this.y(y)].push(v);
  }

  addAmp(x, y, v, nf) {
    this.mx[this.xAmp(x, nf)][this.yAmp(y, nf)] += v;
  }

  pileAmp(x, y, v, nf) {
    this.mx[this.xAmp(x, nf)][this.yAmp(y, nf)].push(v);
  }

  isomorph([x, y], vs, modes, hi) {
    const vec = this.mx[this.x(x)][this.y(y)];

    for (--hi; hi >= 0b0; hi--) !modes[hi] ? vec[hi].push(vs[hi]) : vec[hi] += modes[hi] - 1 ? 1 : vs[hi];
  }

  isomorphAmp([x, y], vs, modes, hi, nf) {
    const vec = this.mx[this.xAmp(x, nf)][this.yAmp(y, nf)];

    for (--hi; hi >= 0b0; hi--) !modes[hi] ? vec[hi].push(vs[hi]) : vec[hi] += modes[hi] - 1 ? 1 : vs[hi];
  }

  accumLauncher(mode = PivotModes.array, boot = true, include) {
    let fn;
    const accum = this[(!mode ? 'pile' : 'add') + (boot ? 'Amp' : '')].bind(this);
    const nf = boot ? nullifierLauncher(mode) : undefined;

    if (typeof include === 'function') {
      fn = mode === PivotModes.count ? ([x, y, v]) => {
        include(v) ? accum(x, y, 1, nf) : this.amp(x, y, nf);
      } : ([x, y, v]) => {
        include(v) ? accum(x, y, v, nf) : this.amp(x, y, nf);
      };
    } else {
      fn = mode === PivotModes.count ? ([x, y]) => accum(x, y, 1, nf) : ([x, y, v]) => accum(x, y, v, nf);
    }

    return (row, indexes) => fn(select(row, indexes, 3));
  }

  isomorphLauncher(modes, boot = true) {
    let nf;
    const hi = modes.length;

    if (boot) {
      const nfs = mapAr$1(modes, nullifierLauncher, hi);

      nf = () => mapAr$1(nfs, fn => fn(), hi);
    }

    const accums = this['isomorph' + (boot ? 'Amp' : '')].bind(this);
    return (row, [x, y], vs) => accums(select(row, [x, y], 2), select(row, vs, hi), modes, hi, nf);
  }

  pivot([x, y, v], {
    mode = PivotModes.array,
    boot = true,
    include
  } = {}) {
    if (boot) {
      this.reboot();
    } else {
      this.clearMatrix(mode);
    }

    const {
      rows,
      s,
      b,
      mx
    } = this,
          accum = this.accumLauncher(mode, boot, include);

    for (let i = 0, {
      length
    } = rows; i < length; i++) accum(rows[i], [x, y, v]);

    return {
      side: s,
      banner: b,
      matrix: mx
    };
  }
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {[string,string|function][]} cells - Array of [fieldIndex, stat]
   * @param {boolean} [boot]
   * @param {function} [include]
   * @returns {{side: *, banner: *, matrix: *}}
   */


  pivotMulti([x, y], cells, {
    boot = true,
    include
  } = {}) {
    if (boot) {
      this.reboot();
    } else {
      this.clearMatrix(mode);
    }

    const hi = cells.length,
          vs = Array(hi),
          modes = Array(hi),
          arStatQueue = [];

    for (let i = 0, stat, mode; i < hi; i++) {
      [vs[i], stat] = cells[i];
      mode = pivotMode(stat);
      if (mode === PivotModes.array) arStatQueue.push([i, stat]);
      modes[i] = mode;
    }

    const {
      rows
    } = this,
          accumVec = this.isomorphLauncher(modes, boot),
          hiSQ = arStatQueue.length;

    for (let i = 0, l = rows.length; i < l; i++) accumVec(rows[i], [x, y], vs);

    if (hiSQ) {
      this.mx = Mx.map(this.mx, vec => {
        mapAr$1(arStatQueue, ([i, stat]) => {
          vec[i] = stat(vec[i]);
        }, hiSQ);
        return vec;
      });
    }

    return {
      side: this.s,
      banner: this.b,
      matrix: this.mx
    };
  }

}

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

    if (!ject) {
      for (let [k, v] of entries) o[k] = v;
    } else {
      switch (ject.length) {
        case 1:
          for (let [k, v] of entries) o[k] = ject(v);

          break;

        case 2:
          for (let [i, [k, v]] of entries.entries()) o[k] = ject(v, i);

          break;
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

    for (let [k, v] of dict.entries()) o[k] = v;

    return o; // return Object.fromEntries(dict)
  }

  static clone(jso) {
    return dpObj(jso);
  }
  /**
   *
   * @param {Object} jso
   * @param {*[]} keys
   * @param {number} [lo]
   * @param {number} [hi]
   */


  static select(jso, keys, lo = 0, hi) {
    const ob = {};
    hi = hi || keys.length;

    for (let k; lo < hi; lo++) {
      k = keys[lo];
      ob[k] = jso[k];
    }

    return ob;
  }
  /**
   *
   * @param {Object} jso
   * @param {[*,*][]} keyToNKeys
   * @param {number} [lo]
   * @param {number} [hi]
   */


  static selectReplKeys(jso, keyToNKeys, lo = 0, hi) {
    const ob = {};
    hi = hi || keyToNKeys.length;

    for (let k, v; lo < hi; lo++) {
      [k, v] = keyToNKeys[lo];
      ob[v] = jso[k];
    }

    return ob;
  }

  static selectValues(jso, keys, lo = 0, hi) {
    hi = hi || keys.length;
    const arr = Array(hi - lo);

    for (; lo < hi; lo++) arr[lo] = jso[keys[lo]];

    return arr;
  }

  static map(jso, fn, len) {
    const ob = {},
          ents = Object.entries(jso);
    len = len || ents.length;

    for (let i = 0, k, v; i < len; i++) {
      [k, v] = fn(ents[i]);
      ob[k] = v;
    }

    return ob;
  }

  static mapValues(jso, fn, len) {
    const ob = {},
          ents = Object.entries(jso);
    len = len || ents.length;

    for (let i = 0, k, v; i < len; i++) {
      [k, v] = ents[i];
      ob[k] = fn(v);
    }

    return ob;
  }

  static mapKeys(jso, fn, len) {
    const ob = {},
          ents = Object.entries(jso);
    len = len || ents.length;

    for (let i = 0, k, v; i < len; i++) {
      [k, v] = ents[i];
      ob[fn(k)] = v;
    }

    return ob;
  }

}

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

const {
  isArray: isAr
} = Array;
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
  constructor() {
    _defineProperty(this, "z", void 0);
  }

  /**
   *
   * @param {*[]} head
   * @param {*[][]} rows
   * @param {*[]|[*,*][]} [fields]
   * @return {Object[]}
   */
  static fromTable({
    head,
    rows
  }, fields) {
    if (!isAr(head)) throw new Er('The input \'head\' is not valid.');
    if (!isAr(rows)) throw new Er('The input \'rows\' is not valid.');
    const [row] = rows;
    if (!isAr(row)) return [];

    if (!isAr(fields)) {
      return rows.map(row => Ob.ini(head, row));
    } else {
      const field_ind = fields.map(x => isAr(x) ? [x[1], head.indexOf(x[0])] : [x, head.indexOf(x)]);
      return rows.map(row => Ob.fromEntries(field_ind, i => row[i]));
    }
  }
  /**
   *
   * @param {Object[]} samples
   * @param {string[]|[*,*][]} [fields]
   * @param {string} [h]
   * @param {string} [r]
   * @returns {null|{head:*[],rows:*[][]}}
   */


  static toTable(samples, {
    fields,
    label: {
      head: h = 'head',
      rows: r = 'rows'
    } = {}
  } = {}) {
    if (!isAr(samples)) throw new Er('The input \'rows\' is not an Array');
    const [sample] = samples;
    if (typeof sample !== 'object') return Ob.of([h, []], [r, [[]]]);

    if (!fields) {
      return Ob.of([h, Object.keys(sample)], [r, samples.map(Object.values)]);
    } else {
      const {
        length
      } = fields,
            [_b, b] = [Array(length), Array(length)];

      for (let i = 0, x; i < length; i++) {
        x = fields[i];
        [_b[i], b[i]] = isAr(x) ? [x[0], x[1]] : [x, x];
      }

      return Ob.of([h, b], [r, samples.map(sample => Ob.selectValues(sample, _b, 0, length))]);
    }
  }
  /**
   *
   * @param {Object[]} samples
   * @param {*[]|[*,*][]} fields
   * @returns {Object[]}
   */


  static select(samples, fields) {
    if (!isAr(samples)) throw new Er('The input \'rows\' is not an Array');
    if (!fields || !fields.length) return samples;
    const {
      length
    } = fields,
          keyToNKeys = fields.map(x => isAr(x) ? [x[0], x[1]] : [x, x]);
    return samples.map(sample => Ob.selectReplKeys(sample, keyToNKeys, 0, length));
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

  static replaceKeys(samples, dict) {}

  static unshiftCol(samples, ob) {}

  static pushCol(samples, ob) {}

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

export { Ar, Dc, Fn, Mx, Ob, Pivot, PivotModes, Samples, clone };
