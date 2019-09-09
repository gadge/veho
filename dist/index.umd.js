(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.veho = {}));
}(this, function (exports) { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  /**
   * Static class containing methods create 1d-array.
   */
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

  var Jso =
  /*#__PURE__*/
  function () {
    function Jso() {}

    Jso.toArr = function toArr(jso) {
      return Object.entries(jso);
    };

    Jso.fromArr = function fromArr(arr, val) {
      var obj = {};

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
        obj[k] = val;
      }

      return obj;
    };

    Jso.toMap = function toMap(jso) {
      return new Map(Object.entries(jso));
    }
    /**
     *
     * @param {Map|[key,value][]} dict
     * @returns {{key:*,value:*}}
     */
    ;

    Jso.fromMap = function fromMap(dict) {
      // let obj = {}
      // for (let [k, v] of dict) {
      //   obj[k] = v
      // }
      // return obj
      return _extends({}, [].concat(dict.entries())); // return Object.fromEntries(dict)
    }
    /**
     *
     * @param {[key,value][]} entries
     * @return {{key:*,value:*}}
     */
    ;

    Jso.fromEntries = function fromEntries() {
      for (var _len = arguments.length, entries = new Array(_len), _key = 0; _key < _len; _key++) {
        entries[_key] = arguments[_key];
      }

      return _extends({}, entries);
    }
    /**
     * Extract content of table in json-array form( [{c1:*,c2:*,..},{c1:*,c2:*,..},..] )
     * to a 2d-array( [[*,*,..],[*,*,..],..] ).
     * @param {*[]} jsonArr Table in json-array form: [{c1:*,c2:*,..},{c1:*,c2:*,..},..]
     * @returns {*[][]} Table content in 2d-array, excluding the input table head.
     */
    ;

    Jso.jsonArrayToMatrix = function jsonArrayToMatrix(jsonArr) {
      return [].concat(jsonArr.map(function (json) {
        return Object.values(json);
      }));
    };

    Jso.matrixToJsonArray = function matrixToJsonArray(matrix, side, banner) {
      var rows = matrix.map(function (row) {
        return banner.zip(row, function (itm, obj) {
          return [itm, obj];
        });
      });
      var indexedRows = side.zip(rows, function (itm, row) {
        return [itm, row];
      });
      var obj = {};

      for (var _iterator2 = indexedRows, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var _ref3 = _ref2,
            k = _ref3[0],
            v = _ref3[1];
        obj[k] = v;
      }

      return obj;
    };

    return Jso;
  }();
  /**
   * Insert JsonTable class to handle transformation between JSON table in
   * rows|[{h1_1:v1_1,h1_2:v1_2,...},{h2_1:v2_1,h2_2:v2_2,...},...] form
   * and JSON table in 'seperate'|{headers:*[],rowSet:*[][]} form.
   */


  var JsonTable =
  /*#__PURE__*/
  function () {
    function JsonTable() {}

    JsonTable.sepToRows = function sepToRows(samples, banner) {
      var len = Math.min(samples[0].length, banner.length);
      return samples.map(function (row) {
        var o = {};

        for (var i = 0; i < len; i++) {
          o[banner[i]] = row[i];
        }

        return o;
      });
    }
    /**
     *
     * @param {Object[]}rows
     * @param {string} bannerLabel
     * @param {string} samplesLabel
     * @returns {{bannerLabel:string[], samplesLabel:*}}
     */
    ;

    JsonTable.rowsToSep = function rowsToSep(rows, bannerLabel, samplesLabel) {
      if (bannerLabel === void 0) {
        bannerLabel = 'banner';
      }

      if (samplesLabel === void 0) {
        samplesLabel = 'samples';
      }

      var banner = Object.keys(rows[0]);
      var samples = rows.map(function (row) {
        return Object.values(row);
      });
      return Jso.fromEntries([bannerLabel, banner], [samplesLabel, samples]);
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
     * @param {number} rowSize
     * @param {number} columnSize
     * @param {function} valueJect
     * @returns {number[][]}
     */
    Mat.ini = function ini(rowSize, columnSize, valueJect) {
      return Array.from({
        length: rowSize
      }, function (_, x) {
        return Array.from({
          length: columnSize
        }, function (_, y) {
          return valueJect(x, y);
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
      return Object.keys(mx[0]).map(function (c) {
        return mx.map(function (r) {
          return r[c];
        });
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

  var Fun =
  /*#__PURE__*/
  function () {
    function Fun() {}

    /**
     *
     * @param {class} cls
     * @return {string[]}
     */
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

  /**
   * Get the last item in an array.
   * @returns {*}. The last item in the array.
   */

  Array.prototype.last = function () {
    return this[this.length - 1];
  };
  /**
   * Take the first "n" elements from an array.
   * @param len. The number denote the first "n" elements in an array.
   * @returns {*[]}. A new array length at "len".
   */


  Array.prototype.take = function (len) {
    return this.slice(0, len);
  };

  Array.prototype.zip = function (another, zipper) {
    var arr = new Array(this.length);

    for (var i = 0; i < this.length; i++) {
      arr[i] = zipper(this[i], another[i], i);
    }

    return arr; // return Array.from({ length: size }, (v, i) => zipper(this[i], another[i], i))
    // return this.map((x, i) => zipper(x, another[i]))
  }; // Matrix extension

  /**
   * Get the upper bound of rows of a 2d-array.
   * @returns {number}
   */


  Array.prototype.xB = function () {
    return this.length - 1;
  };
  /**
   * Get the upper bound of columns of a 2d-array.
   * @returns {number}
   */


  Array.prototype.yB = function () {
    var first = this[0];
    return !!first ? first.length - 1 : 0;
  };
  /**
   * Get the row of a 2d-array at index "x".
   * @param x
   * @returns {*[]}
   */


  Array.prototype.row = function (x) {
    return this[x];
  };
  /**
   * Get the column of a 2d-array at index "y".
   * @param y
   * @returns {*[]}
   */


  Array.prototype.col = function (y) {
    return this.map(function (row) {
      return row[y];
    });
  };
  /**
   * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
   * @param elementJect
   * @returns {*[]}
   */


  Array.prototype.veho = function (elementJect) {
    return Mat.veho(this, elementJect);
  };

  exports.Dic = Dic;
  exports.Fun = Fun;
  exports.Jso = Jso;
  exports.JsonTable = JsonTable;
  exports.Mat = Mat;
  exports.Vec = Vec;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
