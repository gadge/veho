/**
 * Static class containing methods create 1d-array.
 */
import { dpArr } from '../misc/clone'
import { Num, NumLoose } from 'typen'

const
  { numeric: num } = Num,
  { numeric: numLoose } = NumLoose

class Ar {
  /**
   * Create an array.
   * @param {number} size Integer starts at zero.
   * @param {function(number):*|*} [ject] Defines the how index i decides value(i).
   * @returns {number[]} The
   */
  static ini (size, ject) {
    if (size <= 128) {
      let arr = []
      if (typeof ject === 'function') {
        for (let i = 0; i < size; i++) arr[i] = ject(i)
      } else {
        for (let i = 0; i < size; i++) arr[i] = ject
      }
      return arr
    } else {
      return typeof ject === 'function'
        ? Array(size).fill(null).map((_, i) => ject(i))
        : Array(size).fill(ject)
    }
  }

  static isEmpty (arr) {
    return !arr || !arr.length
  }

  /**
   *
   * @param {Array} arr
   * @param {boolean} [loose]=false
   * @returns {*}
   */
  static numeric (arr, { loose = false }) {
    return arr.map(loose ? numLoose : num)
  }

  static clone (arr) {return dpArr(arr)}

  static indexes (arr) {
    return arr.map((_, i) => i)
  }

  static map (arr, fn, l) {
    l = l || arr.length
    const vc = Array(l)
    for (--l; l >= 0b0; l--) vc[l] = fn(arr[l], l)
    return vc
  }

  static mutateMap (arr, fn, l) {
    l = l || arr.length
    for (--l; l >= 0b0; l--) arr[l] = fn(arr[l], l)
    return arr
  }

  static select (arr, indexes, hi) {
    hi = hi || indexes.length
    const vc = Array(hi)
    for (--hi; hi >= 0b0; hi--) vc[hi] = arr[indexes[hi]]
    return vc
  }

  /**
   *
   * @param {*[]} arr
   * @param {number[]} indexes - number indexes of the positions to be spliced, should be in ascending order.
   * @param {number} [hi]
   * @returns {*[]}
   */
  static splices (arr, indexes, hi) {
    hi = hi || indexes.length
    for (--hi; hi >= 0b0; hi--) arr.splice(indexes[hi], 1)
    return arr
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
  static multiZip (zipper, ...arraySet) {
    const firstArray = arraySet[0]
    if (!!firstArray) {
      const [len, cnt] = [firstArray.length, arraySet.length]
      const result = Array(len)
      for (let i = 0; i < len; i++) {
        const params = Array(cnt)
        for (let j = 0; j < cnt; j++) {
          params[j] = arraySet[j][i]
        }
        result[i] = zipper(params)
      }
      return result
    } else {
      return undefined
    }
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
        const arr = new Array(size)
        arr[0] = initial
        for (let i = 1; i < size; i++) {
          arr[i] = progress(arr[i - 1])
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
    return Ar.progression(size, initial, previous => previous + delta)
  }

  /**
   * Create a geometric progression
   * @param {number} size
   * @param {number} initial
   * @param {number} ratio
   * @returns {*[]}}
   */
  static geometric (size, initial, ratio) {
    return Ar.progression(size, initial, previous => previous * ratio)
  }

  /**
   *
   * @param {*[]} ar1
   * @param {*[]} ar2
   * @param {function} product
   * @returns {*[]}
   */
  static decartes (ar1, ar2, product) {
    const l1 = ar1.length, l2 = ar2.length
    let arr = Array(l1 * l2)
    for (let i = 0, j, k = 0; i < l1; i++) {
      for (j = 0; j < l2; j++) {
        arr[k++] = product(ar1[i], ar2[j])
      }
    }
    return arr
    // for (let x of ar1) {
    //   arr.push(...ar2.map(y => product(x, y)))
    // }
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

  static zip (arL, arR, zipper, l) {
    l = l || arL.length
    const vc = Array(l)
    for (--l; l >= 0; l--) vc[l] = zipper(arL[l], arR[l], l)
    return vc
  }
}

// Array.prototype.zip = function (another, zipper) {
//   let ar = [];
//   for (let i = 0; i < this.length; i++) {
//     ar[i] = zipper(this[i], another[i])
//   }
//   return ar
// };

export { Ar }
