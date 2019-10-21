import { Num } from 'typen'

const { inferData } = Num

class ArrTyp {
  /**
   *
   * @param {*[]} arr
   * @return {string|unknown}
   */
  static inferList (arr) {
    if (arr.length) {
      const types = arr.map(inferData)
      const dist = new Set(types)
      switch (dist.size) {
        case 1:
          return types[0]
        case 2:
          return dist.has('number') && dist.has('numstr')
            ? 'numstr'
            : 'misc'
        default:
          return 'misc'
      }
    } else {
      return 'null'
    }
  }

  /**
   *
   * Specify the type of a column. No return
   * @param {*[]} arr accept both column name in string or column index in integer
   * @param {string} typeName string | (number, float) | integer | boolean
   */
  changeType (arr, typeName) {
    switch (typeName) {
      case 'string':
        return arr.map(it => `${it}`)
      case 'number':
      case 'float':
        return arr.map(parseFloat)
      case 'integer':
        return arr.map(parseInt)
      case 'boolean':
        return arr.map(Boolean)
      default:
        return arr
    }
  }
}

export { ArrTyp }