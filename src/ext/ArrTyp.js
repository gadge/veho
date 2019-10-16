import { Typ } from 'xbrief'

/**
 *
 * @param {*} o
 * @return {string}
 */
function inferEl (o) {
  return (typeof o === 'string')
    ? Typ.isNumeric(o) ? 'numstr' : 'string'
    : Typ.infer(o)
}

class ArrTyp {
  /**
   *
   * @param {*[]} column
   * @return {string|unknown}
   */
  static inferList (column) {
    if (column.length) {
      const types = column.map(inferEl)
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
   * @param {*[]} column accept both column name in string or column index in integer
   * @param {string} typeName string | (number, float) | integer | boolean
   */
  changeType (column, typeName) {
    switch (typeName) {
      case 'string':
        return column.map(it => `${it}`)
      case 'number':
      case 'float':
        return column.map(Number.parseFloat)
      case 'integer':
        return column.map(Number.parseInt)
      case 'boolean':
        return column.map(Boolean)
      default:
        return column
    }
  }

  /**
   * Re-generate this.types based on DPTyp.inferArr method.
   * Cautious: This method will change all elements of this.types.
   * @return {string[]}
   */
  inferTypes () {
    //|> Mat.transpose
    /**
     * @type {*[][]}
     */
    const { columns } = this, { infer } = ArrTyp
    this.types = columns.map(infer)
    for (let [i, typ] of this.types.entries()) {
      switch (typ) {
        case ('numstr') :
          this.changeType(i, 'number')
          break
        case ('misc'):
          this.changeType(i, 'string')
          break
        default:
        // `${idx}:${typ}`.tag('no need to change type').wL()
      }
    }
    return this.types
    // 'banner types'.tag(Dic.ini(this.banner, this.types).vBrief()).wL()
  }
}

export { ArrTyp }