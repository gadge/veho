(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('typen')) :
  typeof define === 'function' && define.amd ? define(['exports', 'typen'], factory) :
  (global = global || self, factory(global.veho = {}, global.typen));
}(this, function (exports, typen) { 'use strict';

  var PivotModes = {
    array: 0,
    sum: 1,
    count: 2
  };

  var oc = Object.prototype.toString;
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
        return new Set(dpArr([].concat(o)));
    }

    throw new Error('Unable to copy obj. Unsupported type.');
  }
  /**
   *
   * @param {Map<*, *>} o
   * @return {Map<*, *>}
   */


  function dpMap(o) {
    return new Map([].concat(o.entries()).map(function (_ref) {
      var k = _ref[0],
          v = _ref[1];
      return [k, clone(v)];
    }));
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
    var x = {};

    for (var _i = 0, _Object$entries = Object.entries(o); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _Object$entries[_i],
          k = _Object$entries$_i[0],
          v = _Object$entries$_i[1];
      x[k] = clone(v);
    }

    return x;
  }

  /**
   * Static class containing methods create 1d-array.
   */
  var num = typen.Num.numeric,
      numLoose = typen.NumLoose.numeric;

  var Ar =
  /*#__PURE__*/
  function () {
    function Ar() {}

    /**
     * Create an array.
     * @param {number} size Integer starts at zero.
     * @param {function(number):*|*} [ject] Defines the how index i decides value(i).
     * @returns {number[]} The
     */
    Ar.ini = function ini(size, ject) {
      if (size <= 128) {
        var arr = [];

        if (typeof ject === 'function') {
          for (var _i = 0; _i < size; _i++) {
            arr[_i] = ject(_i);
          }
        } else {
          for (var _i2 = 0; _i2 < size; _i2++) {
            arr[_i2] = ject;
          }
        }

        return arr;
      } else {
        return typeof ject === 'function' ? Array(size).fill(null).map(function (_, i) {
          return ject(i);
        }) : Array(size).fill(ject);
      }
    };

    Ar.isEmpty = function isEmpty(arr) {
      return !arr || !arr.length;
    }
    /**
     *
     * @param {Array} arr
     * @param {boolean} [loose]=false
     * @returns {*}
     */
    ;

    Ar.numeric = function numeric(arr, _ref) {
      var _ref$loose = _ref.loose,
          loose = _ref$loose === void 0 ? false : _ref$loose;
      return arr.map(loose ? numLoose : num);
    };

    Ar.clone = function clone(arr) {
      return dpArr(arr);
    };

    Ar.indexes = function indexes(arr) {
      return arr.map(function (_, i) {
        return i;
      });
    };

    Ar.mutateMap = function mutateMap(arr, fn, l) {
      l = l || arr.length;

      for (--l; l >= 0; l--) {
        arr[l] = fn(arr[l], l);
      }

      return arr;
    };

    Ar.map = function map(arr, fn, l) {
      l = l || arr.length;
      var vc = Array(l);

      for (--l; l >= 0; l--) {
        vc[l] = fn(arr[l], l);
      }

      return vc;
    };

    Ar.select = function select(arr, indexes, hi) {
      hi = hi || indexes.length;
      var vc = Array(hi);

      for (--hi; hi >= 0; hi--) {
        vc[hi] = arr[indexes[hi]];
      }

      return vc;
    }
    /**
     *
     * @param {*[]} arr
     * @param {number[]} indexes - number indexes of the positions to be spliced, should be in ascending order.
     * @param {number} [hi]
     * @returns {*[]}
     */
    ;

    Ar.splices = function splices(arr, indexes, hi) {
      hi = hi || indexes.length;

      for (--hi; hi >= 0; hi--) {
        arr.splice(indexes[hi], 1);
      }

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
    ;

    Ar.multiZip = function multiZip(zipper) {
      for (var _len = arguments.length, arraySet = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        arraySet[_key - 1] = arguments[_key];
      }

      var firstArray = arraySet[0];

      if (!!firstArray) {
        var _ref2 = [firstArray.length, arraySet.length],
            len = _ref2[0],
            cnt = _ref2[1];
        var result = Array(len);

        for (var _i3 = 0; _i3 < len; _i3++) {
          var params = Array(cnt);

          for (var j = 0; j < cnt; j++) {
            params[j] = arraySet[j][_i3];
          }

          result[_i3] = zipper(params);
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
    ;

    Ar.progression = function progression(size, initial, progress) {
      switch (size) {
        case 0:
          return [];

        case 1:
          return [initial];

        default:
          var arr = new Array(size);
          arr[0] = initial;

          for (var _i4 = 1; _i4 < size; _i4++) {
            arr[_i4] = progress(arr[_i4 - 1]);
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
    ;

    Ar.arithmetic = function arithmetic(size, initial, delta) {
      return Ar.progression(size, initial, function (previous) {
        return previous + delta;
      });
    }
    /**
     * Create a geometric progression
     * @param {number} size
     * @param {number} initial
     * @param {number} ratio
     * @returns {*[]}}
     */
    ;

    Ar.geometric = function geometric(size, initial, ratio) {
      return Ar.progression(size, initial, function (previous) {
        return previous * ratio;
      });
    }
    /**
     *
     * @param {*[]} ar1
     * @param {*[]} ar2
     * @param {function} product
     * @returns {*[]}
     */
    ;

    Ar.decartes = function decartes(ar1, ar2, product) {
      var l1 = ar1.length,
          l2 = ar2.length;
      var arr = Array(l1 * l2);

      for (var _i5 = 0, j, k = 0; _i5 < l1; _i5++) {
        for (j = 0; j < l2; j++) {
          arr[k++] = product(ar1[_i5], ar2[j]);
        }
      }

      return arr; // for (let x of ar1) {
      //   arr.push(...ar2.map(y => product(x, y)))
      // }
    };

    Ar.randSample = function randSample(arr) {
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
    };

    Ar.take = function take(arr, len) {
      return arr.slice(0, len);
    };

    Ar.zip = function zip(arL, arR, zipper, l) {
      l = l || arL.length;
      var vc = Array(l);

      for (--l; l >= 0; l--) {
        vc[i] = zipper(arL[i], arR[i], i);
      }

      return vc;
    };

    return Ar;
  }(); // Array.prototype.zip = function (another, zipper) {

  var num$1 = typen.Num.numeric,
      numLoose$1 = typen.NumLoose.numeric,
      mapAr = Ar.map;
  /**
   * Static class containing methods to create 2d-array.
   */

  var Mx =
  /*#__PURE__*/
  function () {
    function Mx() {}

    /**
     *
     * @param {number} height
     * @param {number} width
     * @param {function} ject
     * @returns {number[][]}
     */
    Mx.ini = function ini(height, width, ject) {
      return Array(height).fill(null).map(function (_, x) {
        return Array(width).fill(null).map(function (_, y) {
          return ject(x, y);
        });
      });
    };

    Mx.size = function size(mx) {
      var _mx$;

      var l = mx === null || mx === void 0 ? void 0 : mx.length;
      return [l, l ? (_mx$ = mx[0]) === null || _mx$ === void 0 ? void 0 : _mx$.length : undefined];
    };

    Mx.isMat = function isMat(mx) {
      return Array.isArray(mx) && mx.length ? Array.isArray(mx[0]) : false;
    };

    Mx.is = function is(mx) {
      return mx && mx.length ? !!mx[0] : false;
    };

    Mx.copy = function copy(mx) {
      return mx.map(function (row) {
        return row.slice();
      });
    };

    Mx.clone = function clone(mx) {
      return mx.map(dpArr);
    }
    /**
     *
     * @param {*[][]} mx
     * @param {boolean=false} [loose]
     * @returns {*}
     */
    ;

    Mx.numeric = function numeric(mx, _ref) {
      var _ref$loose = _ref.loose,
          loose = _ref$loose === void 0 ? false : _ref$loose;
      var fn = loose ? numLoose$1 : num$1;
      return mx.map(function (r) {
        return r.map(fn);
      });
    }
    /**
     *
     * @param {*[][]} mx
     * @return {number[]}
     */
    ;

    Mx.columnIndexes = function columnIndexes(mx) {
      return !mx || !mx.length ? [] : !mx[0] ? [] : mx[0].map(function (_, i) {
        return i;
      });
    }
    /**
     *
     * @param {*[][]} mx
     * @return {number[]}
     */
    ;

    Mx.coins = function coins(mx) {
      return !mx || !mx.length ? [] : !mx[0] ? [] : mx[0].map(function (_, i) {
        return i;
      });
    }
    /**
     *
     * @param {*[][]} mx
     * @param {number[]} indexes
     * @returns {*}
     */
    ;

    Mx.select = function select(mx) {
      for (var _len = arguments.length, indexes = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        indexes[_key - 1] = arguments[_key];
      }

      var hi = indexes.length;

      switch (hi) {
        case 0:
          return mx;

        case 1:
          var i = indexes[0];
          return Mx.column(mx, i);

        default:
          var select = Ar.select;
          return mx.map(function (row) {
            return select(row, indexes, hi);
          });
      }
    }
    /**
     * Transpose a 2d-array.
     * @param {*[][]} mx
     * @returns {*[][]}
     */
    ;

    Mx.transpose = function transpose(mx) {
      return Mx.coins(mx).map(function (c) {
        return mx.map(function (r) {
          return r[c];
        });
      });
    };

    Mx.column = function column(mx, y) {
      return mx.map(function (r) {
        return r[y];
      });
    };

    Mx.mutateCol = function mutateCol(mx, y, fn) {
      for (var i = 0, r, l = mx.length; i < l; i++) {
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
    ;

    Mx.map = function map(mx, fn) {
      return mx.map(function (r, i) {
        return r.map(function (el, j) {
          return fn(el, i, j);
        });
      });
    }
    /**
     * Iterate through the columns of a 2d-array.
     * @param {*[][]} mx
     * @param {function(*[]):[]} fnOnColumn
     * @returns {*[]}
     */
    ;

    Mx.mapCol = function mapCol(mx, fnOnColumn) {
      var _Mx$transpose$map;

      return _Mx$transpose$map = Mx.transpose(mx).map(fnOnColumn), Mx.transpose(_Mx$transpose$map);
    };

    Mx.spliceCols = function spliceCols(mx, ys) {
      var hi = ys.length;

      switch (hi) {
        case 0:
          return mx;

        case 1:
          var y = ys[0];
          return mx.map(function (row) {
            row.splice(y, 1);
            return row;
          });

        default:
          var splices = Ar.splices;
          return mx.map(function (row) {
            return splices(row, ys, hi);
          });
      }
    }
    /**
     *
     * @param {*[][][]} matrices - a list of 2d-array
     * @param {function(*[]):*} [zipper]
     */
    ;

    Mx.zip = function zip(matrices, zipper) {
      var hi = matrices === null || matrices === void 0 ? void 0 : matrices.length,
          _Mx$size = Mx.size(matrices[0]),
          ht = _Mx$size[0],
          wd = _Mx$size[1];

      return typeof zipper !== 'function' ? Mx.ini(ht, wd, function (i, j) {
        return mapAr(matrices, function (mx) {
          return mx[i][j];
        }, hi);
      }) : Mx.ini(ht, wd, function (i, j) {
        return zipper(mapAr(matrices, function (mx) {
          return mx[i][j];
        }, hi));
      });
    };

    return Mx;
  }();

  var PivotUtils =
  /*#__PURE__*/
  function () {
    function PivotUtils() {}

    PivotUtils.nullifierLauncher = function nullifierLauncher(mode) {
      return !mode ? function () {
        return [];
      } : function () {
        return 0;
      };
    };

    PivotUtils.pivotMode = function pivotMode(stat) {
      switch (typeof stat) {
        case 'string':
          return PivotModes[stat] || PivotModes.count;

        case 'function':
          return PivotModes.array;
      }
    };

    return PivotUtils;
  }();

  var select = Ar.select,
      mapAr$1 = Ar.map;
  var s, b, mx;
  var nullifierLauncher = PivotUtils.nullifierLauncher,
      pivotMode = PivotUtils.pivotMode;
  var Pivot =
  /*#__PURE__*/
  function () {
    function Pivot(rows, mode) {
      if (mode === void 0) {
        mode = PivotModes.array;
      }

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

    var _proto = Pivot.prototype;

    _proto.reboot = function reboot() {
      this.s = [];
      this.b = [];
      this.mx = [];
    };

    _proto.clearMatrix = function clearMatrix(mode) {
      var _this$s, _this$b;

      this.mx = Mx.ini((_this$s = this.s) === null || _this$s === void 0 ? void 0 : _this$s.length, (_this$b = this.b) === null || _this$b === void 0 ? void 0 : _this$b.length, nullifierLauncher(mode));
    };

    _proto.x = function x(_x) {
      return this.s.indexOf(_x);
    };

    _proto.y = function y(_y) {
      return this.b.indexOf(_y);
    }
    /**
     * Expand the side, 's' and the matrix, 'mx'.
     * @param {*} x
     * @param {function():[]|function():number} nf
     * @returns {number}
     * @private
     */
    ;

    _proto.rAmp = function rAmp(x, nf) {
      s = this.s;
      mx = this.mx;
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
    ;

    _proto.cAmp = function cAmp(y, nf) {
      b = this.b;
      mx = this.mx;

      for (var i = mx.length - 1; i >= 0; i--) {
        mx[i].push(nf());
      }

      return b.push(y);
    };

    _proto.xAmp = function xAmp(x, nf) {
      var i = this.s.indexOf(x);
      if (i < 0) i += this.rAmp(x, nf);
      return i;
    };

    _proto.yAmp = function yAmp(y, nf) {
      var j = this.b.indexOf(y);
      if (j < 0) j += this.cAmp(y, nf);
      return j;
    };

    _proto.amp = function amp(x, y, nf) {
      this.xAmp(x, nf);
      this.yAmp(y, nf);
    };

    _proto.add = function add(x, y, v) {
      this.mx[this.x(x)][this.y(y)] += v;
    };

    _proto.pile = function pile(x, y, v) {
      this.mx[this.x(x)][this.y(y)].push(v);
    };

    _proto.addAmp = function addAmp(x, y, v, nf) {
      this.mx[this.xAmp(x, nf)][this.yAmp(y, nf)] += v;
    };

    _proto.pileAmp = function pileAmp(x, y, v, nf) {
      this.mx[this.xAmp(x, nf)][this.yAmp(y, nf)].push(v);
    };

    _proto.isomorph = function isomorph(_ref, vs, modes, hi) {
      var x = _ref[0],
          y = _ref[1];
      var vec = this.mx[this.x(x)][this.y(y)];

      for (--hi; hi >= 0; hi--) {
        !modes[hi] ? vec[hi].push(vs[hi]) : vec[hi] += modes[hi] - 1 ? 1 : vs[hi];
      }
    };

    _proto.isomorphAmp = function isomorphAmp(_ref2, vs, modes, hi, nf) {
      var x = _ref2[0],
          y = _ref2[1];
      var vec = this.mx[this.xAmp(x, nf)][this.yAmp(y, nf)];

      for (--hi; hi >= 0; hi--) {
        !modes[hi] ? vec[hi].push(vs[hi]) : vec[hi] += modes[hi] - 1 ? 1 : vs[hi];
      }
    };

    _proto.accumLauncher = function accumLauncher(mode, boot, include) {
      var _this = this;

      if (mode === void 0) {
        mode = PivotModes.array;
      }

      if (boot === void 0) {
        boot = true;
      }

      var fn;
      var accum = this[(!mode ? 'pile' : 'add') + (boot ? 'Amp' : '')].bind(this);
      var nf = boot ? nullifierLauncher(mode) : undefined;

      if (typeof include === 'function') {
        fn = mode === PivotModes.count ? function (_ref3) {
          var x = _ref3[0],
              y = _ref3[1],
              v = _ref3[2];
          include(v) ? accum(x, y, 1, nf) : _this.amp(x, y, nf);
        } : function (_ref4) {
          var x = _ref4[0],
              y = _ref4[1],
              v = _ref4[2];
          include(v) ? accum(x, y, v, nf) : _this.amp(x, y, nf);
        };
      } else {
        fn = mode === PivotModes.count ? function (_ref5) {
          var x = _ref5[0],
              y = _ref5[1];
          return accum(x, y, 1, nf);
        } : function (_ref6) {
          var x = _ref6[0],
              y = _ref6[1],
              v = _ref6[2];
          return accum(x, y, v, nf);
        };
      }

      return function (row, indexes) {
        return fn(select(row, indexes, 3));
      };
    };

    _proto.isomorphLauncher = function isomorphLauncher(modes, boot) {
      if (boot === void 0) {
        boot = true;
      }

      var nf;
      var hi = modes.length;

      if (boot) {
        var nfs = mapAr$1(modes, nullifierLauncher, hi);

        nf = function nf() {
          return mapAr$1(nfs, function (fn) {
            return fn();
          }, hi);
        };
      }

      var accums = this['isomorph' + (boot ? 'Amp' : '')].bind(this);
      return function (row, _ref7, vs) {
        var x = _ref7[0],
            y = _ref7[1];
        return accums(select(row, [x, y], 2), select(row, vs, hi), modes, hi, nf);
      };
    };

    _proto.pivot = function pivot(_ref8, _temp) {
      var x = _ref8[0],
          y = _ref8[1],
          v = _ref8[2];

      var _ref9 = _temp === void 0 ? {} : _temp,
          _ref9$mode = _ref9.mode,
          mode = _ref9$mode === void 0 ? PivotModes.array : _ref9$mode,
          _ref9$boot = _ref9.boot,
          boot = _ref9$boot === void 0 ? true : _ref9$boot,
          include = _ref9.include;

      if (boot) {
        this.reboot();
      } else {
        this.clearMatrix(mode);
      }

      var rows = this.rows,
          s = this.s,
          b = this.b,
          mx = this.mx,
          accum = this.accumLauncher(mode, boot, include);

      for (var i = 0, length = rows.length; i < length; i++) {
        accum(rows[i], [x, y, v]);
      }

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
    ;

    _proto.pivotMulti = function pivotMulti(_ref10, cells, _temp2) {
      var x = _ref10[0],
          y = _ref10[1];

      var _ref11 = _temp2 === void 0 ? {} : _temp2,
          _ref11$boot = _ref11.boot,
          boot = _ref11$boot === void 0 ? true : _ref11$boot,
          include = _ref11.include;

      if (boot) {
        this.reboot();
      } else {
        this.clearMatrix(mode);
      }

      var hi = cells.length,
          vs = Array(hi),
          modes = Array(hi),
          arStatQueue = [];

      for (var i = 0, stat, _mode; i < hi; i++) {
        var _cells$i = cells[i];
        vs[i] = _cells$i[0];
        stat = _cells$i[1];
        _mode = pivotMode(stat);
        if (_mode === PivotModes.array) arStatQueue.push([i, stat]);
        modes[i] = _mode;
      }

      var rows = this.rows,
          accumVec = this.isomorphLauncher(modes, boot),
          hiSQ = arStatQueue.length;

      for (var _i = 0, l = rows.length; _i < l; _i++) {
        accumVec(rows[_i], [x, y], vs);
      }

      if (hiSQ) {
        this.mx = Mx.map(this.mx, function (vec) {
          mapAr$1(arStatQueue, function (_ref12) {
            var i = _ref12[0],
                stat = _ref12[1];
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
    };

    return Pivot;
  }();

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

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  // Create an object type Er
  var Er =
  /*#__PURE__*/
  function (_Error) {
    _inheritsLoose(Er, _Error);

    function Er(name, message) {
      var _this;

      _this = _Error.call(this) || this;
      _this.name = name;
      _this.message = message;
      return _this;
    }

    Er.ini = function ini(_ref) {
      var name = _ref.name,
          message = _ref.message;
      return new Er(name || 'Error', message || '');
    } // Make the exception convert to a pretty string when used as
    // a string (e.g. by the error console)
    ;

    var _proto = Er.prototype;

    _proto.toString = function toString() {
      return this.name + ": \"" + this.message + "\"";
    };

    return Er;
  }(_wrapNativeSuper(Error));

  var Dc =
  /*#__PURE__*/
  function () {
    function Dc() {}

    /**
     * Create a map from separate key-array and value-array.
     * @param {*[]} keys Array of keys.
     * @param {*[]} values Array of values. The value-array and the key-array need to be equal in size.
     * @returns {Map<*, *>}
     */
    Dc.ini = function ini(keys, values) {
      // const lex = keys.map((k, i) => [k, values[i]])
      // return new Map(lex)
      if (!keys || !values || !Array.isArray(keys) || !Array.isArray(values)) throw Er('The input contains invalid array.');
      var length = keys.length,
          map = new Map();

      for (var i = 0; i < length; i++) {
        map.set(keys[i], values[i]);
      }

      return map;
    };

    Dc.clone = function clone(dc) {
      return dpMap(dc);
    };

    return Dc;
  }();

  var Ob =
  /*#__PURE__*/
  function () {
    function Ob() {}

    /**
     * Create a object from separate key-array and value-array.
     * @param {*[]} keys Array of keys.
     * @param {*[]} values Array of values. The value-array and the key-array need to be equal in size.
     * @returns {Object<*, *>}
     */
    Ob.ini = function ini(keys, values) {
      var o = {},
          length = keys.length;

      for (var i = 0; i < length; i++) {
        o[keys[i]] = values[i];
      } // let i, k; for ([i, k] of keys.entries()) o[k] = values[i]


      return o;
    }
    /**
     *
     * @param {Object<string,*>} jso
     * @return {[string, *][]}
     */
    ;

    Ob.entries = function entries(jso) {
      return Object.entries(jso);
    }
    /**
     * Shallow.
     * @param {string[]} arr
     * @param {*} val
     * @return {Object<string,*>}
     */
    ;

    Ob.fromArr = function fromArr(arr, val) {
      var o = {};

      for (var _iterator = arr, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var k = _ref;
        o[k] = val;
      }

      return o;
    }
    /**
     * Shallow.
     * @param {...[*,*]} entries - An array of key-value pair, [key, value]
     * @returns {Object|Object<string,*>}
     */
    ;

    Ob.of = function of() {
      var o = {};

      for (var _len = arguments.length, entries = new Array(_len), _key = 0; _key < _len; _key++) {
        entries[_key] = arguments[_key];
      }

      for (var _i2 = 0, _entries = entries; _i2 < _entries.length; _i2++) {
        var _entries$_i = _entries[_i2],
            k = _entries$_i[0],
            v = _entries$_i[1];
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
    ;

    Ob.fromEntries = function fromEntries(entries, ject) {
      var o = {};

      if (!ject) {
        for (var _iterator2 = entries, _isArray2 = Array.isArray(_iterator2), _i3 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray2) {
            if (_i3 >= _iterator2.length) break;
            _ref2 = _iterator2[_i3++];
          } else {
            _i3 = _iterator2.next();
            if (_i3.done) break;
            _ref2 = _i3.value;
          }

          var _ref3 = _ref2,
              k = _ref3[0],
              v = _ref3[1];
          o[k] = v;
        }
      } else {
        switch (ject.length) {
          case 1:
            for (var _iterator3 = entries, _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
              var _ref4;

              if (_isArray3) {
                if (_i4 >= _iterator3.length) break;
                _ref4 = _iterator3[_i4++];
              } else {
                _i4 = _iterator3.next();
                if (_i4.done) break;
                _ref4 = _i4.value;
              }

              var _ref5 = _ref4,
                  _k = _ref5[0],
                  _v = _ref5[1];
              o[_k] = ject(_v);
            }

            break;

          case 2:
            for (var _iterator4 = entries.entries(), _isArray4 = Array.isArray(_iterator4), _i5 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
              var _ref6;

              if (_isArray4) {
                if (_i5 >= _iterator4.length) break;
                _ref6 = _iterator4[_i5++];
              } else {
                _i5 = _iterator4.next();
                if (_i5.done) break;
                _ref6 = _i5.value;
              }

              var _ref7 = _ref6,
                  i = _ref7[0],
                  _ref7$ = _ref7[1],
                  _k2 = _ref7$[0],
                  _v2 = _ref7$[1];
              o[_k2] = ject(_v2, i);
            }

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
    ;

    Ob.toMap = function toMap(jso) {
      return new Map(Object.entries(jso));
    }
    /**
     *
     * @param {Map<string,*>} dict - A map
     * @returns {Object<string,*>} A json object
     */
    ;

    Ob.fromMap = function fromMap(dict) {
      var o = {};

      for (var _iterator5 = dict.entries(), _isArray5 = Array.isArray(_iterator5), _i6 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
        var _ref8;

        if (_isArray5) {
          if (_i6 >= _iterator5.length) break;
          _ref8 = _iterator5[_i6++];
        } else {
          _i6 = _iterator5.next();
          if (_i6.done) break;
          _ref8 = _i6.value;
        }

        var _ref9 = _ref8,
            k = _ref9[0],
            v = _ref9[1];
        o[k] = v;
      }

      return o; // return Object.fromEntries(dict)
    };

    Ob.clone = function clone(jso) {
      return dpObj(jso);
    }
    /**
     *
     * @param {Object} jso
     * @param {*[]} keys
     * @param {number} [lo]
     * @param {number} [hi]
     */
    ;

    Ob.select = function select(jso, keys, lo, hi) {
      if (lo === void 0) {
        lo = 0;
      }

      var ob = {};
      hi = hi || keys.length;

      for (var k; lo < hi; lo++) {
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
    ;

    Ob.selectReplKeys = function selectReplKeys(jso, keyToNKeys, lo, hi) {
      if (lo === void 0) {
        lo = 0;
      }

      var ob = {};
      hi = hi || keyToNKeys.length;

      for (var k, v; lo < hi; lo++) {
        var _keyToNKeys$lo = keyToNKeys[lo];
        k = _keyToNKeys$lo[0];
        v = _keyToNKeys$lo[1];
        ob[v] = jso[k];
      }

      return ob;
    };

    Ob.selectValues = function selectValues(jso, keys, lo, hi) {
      if (lo === void 0) {
        lo = 0;
      }

      hi = hi || keys.length;
      var arr = Array(hi - lo);

      for (; lo < hi; lo++) {
        arr[lo] = jso[keys[lo]];
      }

      return arr;
    };

    Ob.map = function map(jso, fn, len) {
      var ob = {},
          ents = Object.entries(jso);
      len = len || ents.length;

      for (var i = 0, k, v; i < len; i++) {
        var _fn = fn(ents[i]);

        k = _fn[0];
        v = _fn[1];
        ob[k] = v;
      }

      return ob;
    };

    Ob.mapValues = function mapValues(jso, fn, len) {
      var ob = {},
          ents = Object.entries(jso);
      len = len || ents.length;

      for (var i = 0, k, v; i < len; i++) {
        var _ents$i = ents[i];
        k = _ents$i[0];
        v = _ents$i[1];
        ob[k] = fn(v);
      }

      return ob;
    };

    Ob.mapKeys = function mapKeys(jso, fn, len) {
      var ob = {},
          ents = Object.entries(jso);
      len = len || ents.length;

      for (var i = 0, k, v; i < len; i++) {
        var _ents$i2 = ents[i];
        k = _ents$i2[0];
        v = _ents$i2[1];
        ob[fn(k)] = v;
      }

      return ob;
    };

    return Ob;
  }();

  var isAr = Array.isArray;
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


  var Samples =
  /*#__PURE__*/
  function () {
    function Samples() {
      _defineProperty(this, "z", void 0);
    }

    /**
     *
     * @param {*[]} head
     * @param {*[][]} rows
     * @param {*[]|[*,*][]} [fields]
     * @return {Object[]}
     */
    Samples.fromTable = function fromTable(_ref3, fields) {
      var head = _ref3.head,
          rows = _ref3.rows;
      if (!isAr(head)) throw new Er('The input \'head\' is not valid.');
      if (!isAr(rows)) throw new Er('The input \'rows\' is not valid.');
      var row = rows[0];
      if (!isAr(row)) return [];

      if (!isAr(fields)) {
        return rows.map(function (row) {
          return Ob.ini(head, row);
        });
      } else {
        var field_ind = fields.map(function (x) {
          return isAr(x) ? [x[1], head.indexOf(x[0])] : [x, head.indexOf(x)];
        });
        return rows.map(function (row) {
          return Ob.fromEntries(field_ind, function (i) {
            return row[i];
          });
        });
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
    ;

    Samples.toTable = function toTable(samples, _temp) {
      var _ref4 = _temp === void 0 ? {} : _temp,
          fields = _ref4.fields,
          _ref4$label = _ref4.label;

      _ref4$label = _ref4$label === void 0 ? {} : _ref4$label;
      var _ref4$label$head = _ref4$label.head,
          h = _ref4$label$head === void 0 ? 'head' : _ref4$label$head,
          _ref4$label$rows = _ref4$label.rows,
          r = _ref4$label$rows === void 0 ? 'rows' : _ref4$label$rows;
      if (!isAr(samples)) throw new Er('The input \'rows\' is not an Array');
      var sample = samples[0];
      if (typeof sample !== 'object') return Ob.of([h, []], [r, [[]]]);

      if (!fields) {
        return Ob.of([h, Object.keys(sample)], [r, samples.map(Object.values)]);
      } else {
        var length = fields.length,
            _ref5 = [Array(length), Array(length)],
            _b = _ref5[0],
            b = _ref5[1];

        for (var i = 0, x; i < length; i++) {
          x = fields[i];

          var _ref6 = isAr(x) ? [x[0], x[1]] : [x, x];

          _b[i] = _ref6[0];
          b[i] = _ref6[1];
        }

        return Ob.of([h, b], [r, samples.map(function (sample) {
          return Ob.selectValues(sample, _b, 0, length);
        })]);
      }
    }
    /**
     *
     * @param {Object[]} samples
     * @param {*[]|[*,*][]} fields
     * @returns {Object[]}
     */
    ;

    Samples.select = function select(samples, fields) {
      if (!isAr(samples)) throw new Er('The input \'rows\' is not an Array');
      if (!fields || !fields.length) return samples;
      var length = fields.length,
          keyToNKeys = fields.map(function (x) {
        return isAr(x) ? [x[0], x[1]] : [x, x];
      });
      return samples.map(function (sample) {
        return Ob.selectReplKeys(sample, keyToNKeys, 0, length);
      });
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
    ;

    Samples.toMatrix = function toMatrix(samples) {
      return samples.map(Object.values);
    };

    /**
     *
     * @param {*[][]} matrix
     * @param {*[]} side
     * @param {*[]} banner
     * @param {string} [sideLabel]
     * @returns {Object[]}
     */
    Samples.fromCrosTab = function fromCrosTab(_ref7, _temp2) {
      var matrix = _ref7.matrix,
          side = _ref7.side,
          banner = _ref7.banner;

      var _ref8 = _temp2 === void 0 ? {} : _temp2,
          _ref8$sideLabel = _ref8.sideLabel,
          sideLabel = _ref8$sideLabel === void 0 ? '_' : _ref8$sideLabel;

      var sides = side.map(function (x) {
        return Ob.of([sideLabel, x]);
      }),
          rows = matrix.map(function (row) {
        return Ob.ini(banner, row);
      }),
          length = sides.length;

      for (var i = 0; i < length; i++) {
        Object.assign(sides[i], rows[i]);
      }

      return sides;
    };

    Samples.toCrosTab = function toCrosTab(samples, _ref9, _temp3) {
      var side = _ref9.side,
          banner = _ref9.banner,
          field = _ref9.field;

      var _ref10 = _temp3 === void 0 ? {} : _temp3,
          _ref10$mode = _ref10.mode,
          mode = _ref10$mode === void 0 ? PivotModes.array : _ref10$mode,
          include = _ref10.include;

      return new Pivot(samples).pivot([side, banner, field], {
        mode: mode,
        include: include
      });
    };

    Samples.replaceKeys = function replaceKeys(samples, dict) {};

    Samples.unshiftCol = function unshiftCol(samples, ob) {};

    Samples.pushCol = function pushCol(samples, ob) {};

    return Samples;
  }();

  var Fn =
  /*#__PURE__*/
  function () {
    function Fn() {}

    Fn.getMethodNames = function getMethodNames(cls) {
      return !!cls && !!cls.prototype ? Object.getOwnPropertyNames(cls.prototype) : [];
    }
    /**
     *
     * @param {class} cls
     * @return {string[]}
     */
    ;

    Fn.getStaticMethodNames = function getStaticMethodNames(cls) {
      return Object.getOwnPropertyNames(cls).filter(function (prop) {
        return typeof cls[prop] === 'function';
      });
    }
    /**
     *
     * @param {class} cls
     * @return {string[]}
     */
    ;

    Fn.getStaticPropertyNames = function getStaticPropertyNames(cls) {
      return Object.keys(cls);
    }
    /**
     *
     * @param {function(*): *} pointwiseFunc
     * @return {function(*[]): *[]}
     */
    ;

    Fn.rowwise = function rowwise(pointwiseFunc) {
      return function (row) {
        return row.map(function (x) {
          return pointwiseFunc(x);
        });
      };
    }
    /**
     *
     * @param {function(*): *} seinFunc function
     * @param {function(*): *} funcs function whose sole parameter and return value are typed identically
     * @return {function(*): *}
     */
    ;

    Fn.chain = function chain(seinFunc) {
      for (var _len = arguments.length, funcs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        funcs[_key - 1] = arguments[_key];
      }

      return funcs.reduce(function (prevFunc, currFunc) {
        return function (x) {
          return currFunc(prevFunc(x));
        };
      }, seinFunc);
    };

    return Fn;
  }();

  /**
   * Take the first "n" elements from an array.
   * @param len. The number denote the first "n" elements in an array.
   * @returns {*[]}. A new array length at "len".
   */
  Array.prototype.take = function (len) {
    return this.slice(0, len);
  };

  Array.prototype.zip = function (another, zipper) {
    var length = this.length,
        arr = Array(length);

    for (var i = 0; i < length; i++) {
      arr[i] = zipper(this[i], another[i], i);
    }

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

  Object.defineProperty(exports, '__esModule', { value: true });

}));
