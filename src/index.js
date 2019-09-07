import { Jso, JsonTable } from './ext/Jso'
import { Mat } from './ext/Mat'
import { Vec } from './ext/Vec'
import { Dic } from './ext/Dic'
import { Fun } from './ext/Fun'

/**
 * Get the last item in an array.
 * @returns {*}. The last item in the array.
 */
Array.prototype.last = function () {
  return this[this.length - 1]
}

/**
 * Take the first "n" elements from an array.
 * @param len. The number denote the first "n" elements in an array.
 * @returns {*[]}. A new array length at "len".
 */
Array.prototype.take = function (len) {
  return this.slice(0, len)
}

Array.prototype.zip = function (another, zipper) {
  const arr = new Array(this.length)
  for (let i = 0; i < this.length; i++) {
    arr[i] = zipper(this[i], another[i], i)
  }
  return arr
  // return Array.from({ length: size }, (v, i) => zipper(this[i], another[i], i))
  // return this.map((x, i) => zipper(x, another[i]))
}

export {
  Jso, JsonTable,
  Mat,
  Vec,
  Dic,
  Fun
}