import { boxoffice } from '../asset/map/boxoffice.180817'
import { deco, ArrX } from 'xbrief'
import { Typ } from 'typen'
import { Ob, Samples } from '../../src'
import { highestGrossingFilmsInChina } from '../asset/highestGrossingFilmsInChina'

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

  static createObjectTest () {
    const entries = Object.entries(highestGrossingFilmsInChina)
    'entries'.tag(entries |> Typ.inferType) |> console.log
    entries |> console.log

    let objByOf = Ob.of(...entries)
    'objByOf' |> console.log
    objByOf |> console.log

    let objByFromEntries = Ob.fromEntries(entries)
    'objByFromEntries' |> console.log
    objByFromEntries |> console.log

    let objByFromEntriesModified = Ob.fromEntries(entries, ([gross, , year]) => [gross * 1000, year])
    'objByFromEntriesModified' |> console.log
    objByFromEntriesModified |> console.log

    let objByFromEntriesModifiedByIndex = Ob.fromEntries(entries, ([gross], i) => [i + 1, gross * 1000])
    'objByFromEntriesModifiedByIndex' |> console.log
    objByFromEntriesModifiedByIndex |> console.log

  }

  static mapTransferTest () {
    let original = boxoffice
    'original'.tag(original |> Typ.infer) |> console.log
    original |> console.log

    let jso = Ob.fromMap(boxoffice)
    'map to object'.tag(jso|> Typ.infer) |> console.log
    jso |> console.log

    let mpo = Ob.toMap(jso)
    'object to map'.tag(mpo|> Typ.infer) |> console.log
    mpo |> console.log
  }

  static spreadObjectTest () {
    let b = [['a', 1], ['b', 2]]
    let a = { ...b }
    deco(a).wL()
  }

  static SamplesTest () {
    const original = macrotable
    const rowAbstract = row => JSON.stringify(row)
    'original samples' |> console.log
    ArrX.vBrief(macrotable, { abstract: rowAbstract }) |> console.log

    'samples to table' |> console.log
    const table = Samples.toTable(macrotable)
    table |> console.log

    'table to crostab' |> console.log
    const crostab = {
      side: Object.keys(table.rows),
      banner: table.head,
      matrix: table.rows
    }
    crostab |> console.log

    'table to samples' |> console.log
    const samples = Samples.fromCrosTab(crostab, { sideLabel: 'srno' })
    // deco(samples |> console.log
    ArrX.vBrief(samples, { abstract: rowAbstract }) |> console.log
  }
}

describe('Simple Ob Test', function () {
  this.timeout(1000 * 60)
  it('Simple Ob Test: Samples Test ', () => {
    SimpleJsoTest.SamplesTest()
  })
})

export {
  SimpleJsoTest
}