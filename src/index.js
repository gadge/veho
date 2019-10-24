/**
 * Take the first "n" elements from an array.
 * @param len. The number denote the first "n" elements in an array.
 * @returns {*[]}. A new array length at "len".
 */

Array.prototype.take = function (len) {
  return this.slice(0, len)
}

Array.prototype.zip = function (another, zipper) {
  const { length } = this, arr = Array(length)
  for (let i = 0; i < length; i++) arr[i] = zipper(this[i], another[i], i)
  return arr
  // return Array.from({ length: size }, (v, i) => zipper(this[i], another[i], i))
  // return this.map((x, i) => zipper(x, another[i]))
}

export { Pivot } from './utils/Pivot'
export { PivotModes } from './utils/PivotModes'
export { Ar } from './ext/Ar'
export { Mx } from './ext/Mx'
export { Dc } from './ext/Dc'
export { Ob } from './ext/Ob'
export { Samples } from './ext/Samples'
export { Fn } from './ext/Fn'
export { clone } from './misc/clone'