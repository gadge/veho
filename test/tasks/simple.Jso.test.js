import { boxoffice } from '../asset/map/boxoffice.180817'
import { deco, StrX, Typ, VecX, MapX } from 'xbrief'
import { Jso, JsonTable } from '../../src/ext/Jso'
import { GP } from 'elprimero'

const macrotable = [
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
    let original = boxoffice
    'original'.tag(original |> Typ.inferType) |> console.log
    original |> console.log

    let jso = Jso.fromMap(boxoffice)
    'map to object'.tag(jso|> Typ.inferType) |> console.log
    jso |> console.log

    let mpo = Jso.toMap(jso)
    'object to map'.tag(mpo|> Typ.inferType) |> console.log
    mpo |> console.log
  }

  static spreadObjectTest () {
    let b = [['a', 1], ['b', 2]]
    let a = { ...b }
    deco(a).wL()
  }

  static jsonTableTest () {
    const original = macrotable
    const rowAbstract = row => JSON.stringify(row)
    'original samples form' |> console.log
    VecX.vBrief(macrotable, { abstract: rowAbstract }) |> console.log

    'samples form to table form' |> console.log
    const table = JsonTable.samplesToTable(macrotable, 'head', 'rows')
    table |> console.log

    'table form to samples form' |> console.log
    const samples = JsonTable.tableToSamples(table.rows, table.head)
    // deco(samples |> console.log
    VecX.vBrief(samples, { abstract: rowAbstract }) |> console.log
  }
}

// test('SimpleJsoTest mapTransferTest', () => {
//   SimpleJsoTest.mapTransferTest()
// })

export {
  SimpleJsoTest
}