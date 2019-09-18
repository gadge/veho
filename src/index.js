import { Jso, JsonTable } from './ext/Jso'
import { Mat } from './ext/Mat'
import { Vec } from './ext/Vec'
import { Dic } from './ext/Dic'
import { Fun } from './ext/Fun'

// Array extension

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
  return this.slice(0, len)
}

Array.prototype.zip = function (another, zipper) {
  const length = this.length
  const arr = Array.from({ length })
  for (let i = 0; i < length; i++) {
    arr[i] = zipper(this[i], another[i], i)
  }
  return arr
  // return Array.from({ length: size }, (v, i) => zipper(this[i], another[i], i))
  // return this.map((x, i) => zipper(x, another[i]))
}

// Matrix extension

// /**
//  * Get the upper bound of rows of a 2d-array.
//  * @returns {number}
//  */
// Array.prototype.xB = function () {
//   return this.length - 1
// }
//
// /**
//  * Get the upper bound of columns of a 2d-array.
//  * @returns {number}
//  */
// Array.prototype.yB = function () {
//   const first = this[0]
//   return !!first ? (first.length - 1) : 0
// }
//
// /**
//  * Get the row of a 2d-array at index "x".
//  * @param x
//  * @returns {*[]}
//  */
// Array.prototype.row = function (x) {
//   return this[x]
// }
//
// /**
//  * Get the column of a 2d-array at index "y".
//  * @param y
//  * @returns {*[]}
//  */
// Array.prototype.col = function (y) {
//   return this.map((row) => row[y])
// }

// /**
//  * Iterate through elements on each (x of rows,y of columns) coordinate of a 2d-array.
//  * @param elementJect
//  * @returns {*[]}
//  */
// Array.prototype.veho = function (elementJect) {
//   return Mat.veho(this, elementJect)
// }

export {
  Jso, JsonTable,
  Mat,
  Vec,
  Dic,
  Fun
}