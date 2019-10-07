/**
 * Static class containing methods create 1d-array.
 */
import { cloneArray } from '../misc/clone_beta'

class Vec {
  /**
   * Create an array.
   * @param {number} size Integer starts at zero.
   * @param {function|*} [ject] Defines the how index i decides value(i).
   * @returns {number[]} The
   */
  static ini (size, ject) {
    if (typeof ject === 'function') {
      if (size <= 128) {
        let arr = []
        for (let i = 0; i < size; i++) arr[i] = ject(i)
        return arr
      } else {
        return Array(size).fill(null).map((_, i) => ject(i))
      }
    } else {
      if (size <= 128) {
        let arr = []
        for (let i = 0; i < size; i++) arr[i] = ject
        return arr
      } else {
        return Array(size).fill(ject)
      }
    }

  }

  static isEmpty (arr) {
    return !arr || !arr.length
  }

  static clone (arr) {return cloneArray(arr)}

  static indexes (arr) {
    return arr.map((_, i) => i)
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
    let arr = []
    for (let x of ar1) {
      arr.push(...ar2.map(y => product(x, y)))
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

// Array.prototype.zip = function (another, zipper) {
//   let ar = [];
//   for (let i = 0; i < this.length; i++) {
//     ar[i] = zipper(this[i], another[i])
//   }
//   return ar
// };

export { Vec }
