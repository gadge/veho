import './Vec'

class Jso {

  static toArr (jso) {
    return Object.entries(jso)
  }

  static fromArr (arr, val) {
    let obj = {}
    for (let k of arr) {
      obj[k] = val
    }
    return obj
  }

  static toMap (jso) {
    return new Map(Object.entries(jso))
  }

  /**
   *
   * @param {Map|[key,value][]} dict
   * @returns {{key:*,value:*}}
   */
  static fromMap (dict) {
    // let obj = {}
    // for (let [k, v] of dict) {
    //   obj[k] = v
    // }
    // return obj
    return { ...[...dict.entries()] }
    // return Object.fromEntries(dict)
  }

  /**
   *
   * @param {[key,value][]} entries
   * @return {{key:*,value:*}}
   */
  static fromEntries (...entries) {
    return { ...entries }
  }

  /**
   * Extract content of table in json-array form( [{c1:*,c2:*,..},{c1:*,c2:*,..},..] )
   * to a 2d-array( [[*,*,..],[*,*,..],..] ).
   * @param {*[]} jsonArr Table in json-array form: [{c1:*,c2:*,..},{c1:*,c2:*,..},..]
   * @returns {*[][]} Table content in 2d-array, excluding the input table head.
   */
  static jsonArrayToMatrix (jsonArr) {
    return [...jsonArr.map(json => Object.values(json))]
  }

  static matrixToJsonArray (matrix, side, banner) {
    const rows = matrix.map(row => banner.zip(row, (itm, obj) => [itm, obj]))
    const indexedRows = side.zip(rows, (itm, row) => [itm, row])
    let obj = {}
    for (let [k, v] of indexedRows) {
      obj[k] = v
    }
    return obj
  }
}

/**
 * Insert JsonTable class to handle transformation between JSON table in
 * rows|[{h1_1:v1_1,h1_2:v1_2,...},{h2_1:v2_1,h2_2:v2_2,...},...] form
 * and JSON table in 'seperate'|{headers:*[],rowSet:*[][]} form.
 */
class JsonTable {
  static sepToRows (samples, banner) {
    const len = Math.min(samples[0].length, banner.length)
    return samples.map(row => {
      let o = {}
      for (let i = 0; i < len; i++) {
        o[banner[i]] = row[i]
      }
      return o
    })
  }

  /**
   *
   * @param {Object[]}rows
   * @param {string} bannerLabel
   * @param {string} samplesLabel
   * @returns {{bannerLabel:string[], samplesLabel:*}}
   */
  static rowsToSep (rows, bannerLabel = 'banner', samplesLabel = 'samples') {
    const banner = Object.keys(rows[0])
    const samples = rows.map(row => Object.values(row))
    return Jso.fromEntries(
      [bannerLabel, banner],
      [samplesLabel, samples]
    )
  }
}

export {
  Jso,
  JsonTable
}
