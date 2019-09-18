(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.veho = {}));
}(this, function (exports) { 'use strict';

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
        return new Set(cloneArray([].concat(node)));

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
    return new Map(node.entries().map(function (_ref) {
      var k = _ref[0],
          v = _ref[1];
      return [k, clone(v)];
    }));
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
    var x = {};

    for (var _i = 0, _Object$entries = Object.entries(node); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _Object$entries[_i],
          k = _Object$entries$_i[0],
          v = _Object$entries$_i[1];
      x[k] = clone(v);
    }

    return x;
  }

  var Vec =
  /*#__PURE__*/
  function () {
    function Vec() {}

    /**
     * Create an array.
     * @param {number} size Integer starts at zero.
     * @param {function} jectValue Defines the how index i decides value(i).
     * @returns {number[]} The
     */
    Vec.ini = function ini(size, jectValue) {
      if (jectValue === void 0) {
        jectValue = function jectValue(i) {
          return 0;
        };
      }

      return Array.from({
        length: size
      }, function (v, i) {
        return jectValue(i);
      });
    };

    /**
     * Returns an array built from the elements of a given set of arrays.
     * Each element of the returned array is determined by elements from every one of the array-set with the same index.
     * The returned array has length of the first array in the array set.
     * @param {function} zipper The function {x(i)|x(i) ∈ array(i), i ∈ 0,1...n-1, n=arraySet.size} -> y(i), where y
     * is the returned array
     * @param {*[][]} arraySet The array-set to determine the returned array.
     * @returns {*[]|undefined} array
     */
    Vec.multiZip = function multiZip(zipper) {
      for (var _len = arguments.length, arraySet = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        arraySet[_key - 1] = arguments[_key];
      }

      var firstArray = arraySet[0];

      if (!!firstArray) {
        var _ref = [firstArray.length, arraySet.length],
            len = _ref[0],
            cnt = _ref[1];
        var result = Array.from({
          length: len
        });

        for (var i = 0; i < len; i++) {
          var params = Array.from({
            length: cnt
          });

          for (var j = 0; j < cnt; j++) {
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
    ;

    Vec.progression = function progression(size, initial, progress) {
      switch (size) {
        case 0:
          return [];

        case 1:
          return [initial];

        default:
          var arr = new Array(size);
          arr[0] = initial;

          for (var i = 1; i < size; i++) {
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
    ;

    Vec.arithmetic = function arithmetic(size, initial, delta) {
      return Vec.progression(size, initial, function (previous) {
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

    Vec.geometric = function geometric(size, initial, ratio) {
      return Vec.progression(size, initial, function (previous) {
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

    Vec.decartes = function decartes(ar1, ar2, product) {
      var arr = [];

      var _loop = function _loop() {
        if (_isArray) {
          if (_i >= _iterator.length) return "break";
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) return "break";
          _ref2 = _i.value;
        }

        var x = _ref2;
        arr.push.apply(arr, ar2.map(function (y) {
          return product(x, y);
        }));
      };

      for (var _iterator = ar1, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref2;

        var _ret = _loop();

        if (_ret === "break") break;
      }

      return arr;
    };

    Vec.randSample = function randSample(arr) {
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

    Vec.take = function take(arr, len) {
      return arr.slice(0, len);
    };

    return Vec;
  }(); // Array.prototype.zip = function (another, zipper) {
  //   let ar = [];
  //   for (let i = 0; i < this.length; i++) {
  //     ar[i] = zipper(this[i], another[i])
  //   }
  //   return ar
  // };


  _defineProperty(Vec, "clone", cloneArray);

  // Create an object type VehoError
  var VehoError =
  /*#__PURE__*/
  function (_Error) {
    _inheritsLoose(VehoError, _Error);

    function VehoError(message) {
      var _this;

      _this = _Error.call(this) || this;
      _this.name = 'VehoError';
      _this.message = message;
      return _this;
    } // Make the exception convert to a pretty string when used as
    // a string (e.g. by the error console)


    var _proto = VehoError.prototype;

    _proto.toString = function toString() {
      return this.name + ': "' + this.message + '"';
    };

    return VehoError;
  }(_wrapNativeSuper(Error));

  var Jso =
  /*#__PURE__*/
  function () {
    function Jso() {}

    /**
     *
     * @param {Object<string,*>} jso
     * @return {[string, *][]}
     */
    Jso.toEntries = function toEntries(jso) {
      return Object.entries(jso);
    }
    /**
     * Shallow.
     * @param {string[]} arr
     * @param {*} val
     * @return {Object<string,*>}
     */
    ;

    Jso.fromArr = function fromArr(arr, val) {
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

    Jso.of = function of() {
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

    Jso.fromEntries = function fromEntries(entries, ject) {
      var o = {};

      if (!!ject) {
        switch (ject.length) {
          case 1:
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
              o[k] = ject(v);
            }

            break;

          case 2:
            for (var _iterator3 = entries.entries(), _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
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
                  i = _ref5[0],
                  _ref5$ = _ref5[1],
                  k = _ref5$[0],
                  v = _ref5$[1];
              o[k] = ject(v, i);
            }

            break;

          default:
            break;
        }
      } else {
        for (var _iterator4 = entries, _isArray4 = Array.isArray(_iterator4), _i5 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
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
              k = _ref7[0],
              v = _ref7[1];
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
    ;

    Jso.toMap = function toMap(jso) {
      return new Map(Object.entries(jso));
    }
    /**
     *
     * @param {Map<string,*>} dict - A map
     * @returns {Object<string,*>} A json object
     */
    ;

    Jso.fromMap = function fromMap(dict) {
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

    return Jso;
  }();
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

  var JsonTable =
  /*#__PURE__*/
  function () {
    function JsonTable() {}

    /**
     *
     * @param {*[][]} samples
     * @param {*[]}banner
     * @return {Object[]}
     */
    JsonTable.tableToSamples = function tableToSamples(samples, banner) {
      if (!!samples && samples.constructor === Array) {
        var firstRow = samples[0];

        if (!!firstRow && firstRow.constructor === Array) {
          var _ref10 = [0, Math.min(firstRow.length, banner.length)],
              i = _ref10[0],
              len = _ref10[1];
          return samples.map(function (row) {
            var o = {};

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
    ;

    JsonTable.samplesToTable = function samplesToTable(rows, bannerLabel, samplesLabel) {
      if (bannerLabel === void 0) {
        bannerLabel = 'head';
      }

      if (samplesLabel === void 0) {
        samplesLabel = 'rows';
      }

      if (!!rows && rows.constructor === Array) {
        var firstRow = rows[0];

        if (!!firstRow && typeof firstRow === 'object') {
          var banner = Object.keys(firstRow);
          var samples = rows.map(function (row) {
            return Object.values(row);
          });
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
    ;

    JsonTable.samplesToMatrix = function samplesToMatrix(jsonArr) {
      return [].concat(jsonArr.map(function (json) {
        return Object.values(json);
      }));
    };

    JsonTable.matrixToSamples = function matrixToSamples(matrix, side, banner) {
      var rows = matrix.map(function (row) {
        return banner.zip(row, function (itm, obj) {
          return [itm, obj];
        });
      });
      var indexedRows = side.zip(rows, function (itm, row) {
        return [itm, row];
      });
      var obj = {};

      for (var _iterator6 = indexedRows, _isArray6 = Array.isArray(_iterator6), _i7 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
        var _ref11;

        if (_isArray6) {
          if (_i7 >= _iterator6.length) break;
          _ref11 = _iterator6[_i7++];
        } else {
          _i7 = _iterator6.next();
          if (_i7.done) break;
          _ref11 = _i7.value;
        }

        var _ref12 = _ref11,
            k = _ref12[0],
            v = _ref12[1];
        obj[k] = v;
      }

      return obj;
    };

    return JsonTable;
  }();

  /**
   * Static class containing methods to create 2d-array.
   */

  var Mat =
  /*#__PURE__*/
  function () {
    function Mat() {}

    /**
     *
     * @param {number} height
     * @param {number} width
     * @param {function} ject
     * @returns {number[][]}
     */
    Mat.ini = function ini(height, width, ject) {
      return Array.from({
        length: height
      }, function (_, x) {
        return Array.from({
          length: width
        }, function (_, y) {
          return ject(x, y);
        });
      });
    }
    /**
     *
     * @param {*[][]} mx
     * @return {number[]}
     */
    ;

    Mat.columnIndexes = function columnIndexes(mx) {
      var arr = mx[0];
      return !!arr ? [].concat(arr.keys()) : [];
    }
    /**
     * Transpose a 2d-array.
     * @param {*[][]} mx
     * @returns {*[][]}
     */
    ;

    Mat.transpose = function transpose(mx) {
      return Mat.columnIndexes(mx).map(function (c) {
        return mx.map(function (r) {
          return r[c];
        });
      });
    };

    Mat.column = function column(mx, index) {
      return mx.map(function (r) {
        return r[index];
      });
    }
    /**
     * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
     * @param {*[][]} mx
     * @param elementJect
     * @returns {*[]}
     */
    ;

    Mat.veho = function veho(mx, elementJect) {
      return mx.map(function (row) {
        return row.map(elementJect);
      });
    }
    /**
     * Iterate through the columns of a 2d-array.
     * @param {*[][]} mx
     * @param {function(*[]):[]} columnJect
     * @returns {*[]}
     */
    ;

    Mat.vehoCol = function vehoCol(mx, columnJect) {
      return Mat.transpose(mx).map(columnJect);
    };

    return Mat;
  }();
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

  var Dic =
  /*#__PURE__*/
  function () {
    function Dic() {}

    /**
     * Create a map from separate key-array and value-array.
     * @param {*[]} keys Array of keys.
     * @param {*[]} values Array of values. The value-array and the key-array need to be equal in size.
     * @returns {Map<*, *>}
     */
    Dic.ini = function ini(keys, values) {
      var lex = keys.map(function (k, i) {
        return [k, values[i]];
      });
      return new Map(lex);
    };

    return Dic;
  }();

  _defineProperty(Dic, "clone", cloneMap);

  var Fun =
  /*#__PURE__*/
  function () {
    function Fun() {}

    Fun.getMethodNames = function getMethodNames(cls) {
      return !!cls && !!cls.prototype ? Object.getOwnPropertyNames(cls.prototype) : [];
    }
    /**
     *
     * @param {class} cls
     * @return {string[]}
     */
    ;

    Fun.getStaticMethodNames = function getStaticMethodNames(cls) {
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

    Fun.getStaticPropertyNames = function getStaticPropertyNames(cls) {
      return Object.keys(cls);
    }
    /**
     *
     * @param {function(*): *} pointwiseFunc
     * @return {function(*[]): *[]}
     */
    ;

    Fun.rowwise = function rowwise(pointwiseFunc) {
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

    Fun.chain = function chain(seinFunc) {
      for (var _len = arguments.length, funcs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        funcs[_key - 1] = arguments[_key];
      }

      return funcs.reduce(function (prevFunc, currFunc) {
        return function (x) {
          return currFunc(prevFunc(x));
        };
      }, seinFunc);
    };

    return Fun;
  }();

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
    var length = this.length;
    var arr = Array.from({
      length: length
    });

    for (var i = 0; i < length; i++) {
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

  Object.defineProperty(exports, '__esModule', { value: true });

}));
