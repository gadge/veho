import { boxoffice } from '../asset/map/boxoffice.180817'
import { deco, StrX, VecX } from 'xbrief'
import { Jso, JsonTable } from '../../src/ext/Jso'
import { ETA } from 'elprimero'

const rawMacro = [
  { country: 'USA', year: '2017', gdp: 19390, pop: 325 },
  { country: 'USA', year: '2012', gdp: 16155, pop: 313 },
  { country: 'CHN', year: '2017', gdp: 12237, pop: 1386 },
  { country: 'CHN', year: '2012', gdp: 8560, pop: 1350 },
  { country: 'JPN', year: '2017', gdp: 4872, pop: 126 },
  { country: 'JPN', year: '2012', gdp: 6203, pop: 127 },
  { country: 'DEU', year: '2017', gdp: 3677, pop: 82 },
  { country: 'DEU', year: '2012', gdp: 3543, pop: 80 },
  { country: 'RUS', year: '2017', gdp: 1577, pop: 144 },
  { country: 'RUS', year: '2012', gdp: 2210, pop: 143 },
  { country: 'GBR', year: '2017', gdp: 2622, pop: 66 },
  { country: 'GBR', year: '2012', gdp: 2662, pop: 63 },
]

class SimpleJsoTest {
  static mapTransferTest () {
    let jso = Jso.fromMap(boxoffice)
    deco(jso).wL()
    let mpo = Jso.toMap(jso)
    deco(mpo).wL()

    let b = [['a', 1], ['b', 2]]
    let a = { ...b }
    deco(a).wL()
  }

  static jsonTableTest () {
    'rawMacro: original'.tag(VecX.vBrief(rawMacro, { abstract: row => JSON.stringify(row) })).wL()
    const jsoSep = JsonTable.rowsToSep(rawMacro, 'headers', 'rows')
    'rawMacro: rows -> sep'.tag(deco(jsoSep)).wL()

    const funcs = {
      jsoRows1: () => JsonTable.sepToRows(jsoSep.rows, jsoSep.headers),
    }
    // Chrono.reh([1000, 10000, 500000], funcs).brief().wL()

    const jsoRows = JsonTable.sepToRows(jsoSep.rows, jsoSep.headers)
    'rawMacro: rows ->1 sep'.tag(jsoRows.vBrief(row => JSON.stringify(row))).wL()

    // const jsoRows2 = JsonTable.sepToRows2(jsoSep.rows, jsoSep.headers)
    // 'rawMacro: rows ->2 sep'.tag(jsoRows2.vBrief(row => JSON.stringify(row))).wL()
  }
}

export {
  SimpleJsoTest
}