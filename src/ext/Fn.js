export class Fn {
  static getMethodNames (cls) {
    return !!cls && !!cls.prototype
      ? Object.getOwnPropertyNames(cls.prototype)
      : []
  }

  /**
   *
   * @param {class} cls
   * @return {string[]}
   */
  static getStaticMethodNames (cls) {
    return Object
      .getOwnPropertyNames(cls)
      .filter(prop => typeof cls[prop] === 'function')
  }

  /**
   *
   * @param {class} cls
   * @return {string[]}
   */
  static getStaticPropertyNames (cls) {
    return Object.keys(cls)
  }

  /**
   *
   * @param {function(*): *} pointwiseFunc
   * @return {function(*[]): *[]}
   */
  static rowwise (pointwiseFunc) {
    return (row) => row.map(x => pointwiseFunc(x))
  }

  /**
   *
   * @param {function(*): *} seinFunc function
   * @param {function(*): *} funcs function whose sole parameter and return value are typed identically
   * @return {function(*): *}
   */
  static chain (seinFunc, ...funcs) {
    return funcs.reduce((prevFunc, currFunc) => x => currFunc(prevFunc(x)), seinFunc)
  }
}