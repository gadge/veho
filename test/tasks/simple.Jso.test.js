import { boxoffice } from '../asset/map/boxoffice.180817'
import { deco, StrX, Typ, VecX, MapX } from 'xbrief'
import { Jso, JTab } from '../../src/ext/Jso'
import { GP } from 'elprimero'
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

    let objByOf = Jso.of(...entries)
    'objByOf' |> console.log
    objByOf |> console.log

    let objByFromEntries = Jso.fromEntries(entries)
    'objByFromEntries' |> console.log
    objByFromEntries |> console.log

    let objByFromEntriesModified = Jso.fromEntries(entries, ([gross, , year]) => [gross * 1000, year])
    'objByFromEntriesModified' |> console.log
    objByFromEntriesModified |> console.log

    let objByFromEntriesModifiedByIndex = Jso.fromEntries(entries, ([gross], i) => [i + 1, gross * 1000])
    'objByFromEntriesModifiedByIndex' |> console.log
    objByFromEntriesModifiedByIndex |> console.log

  }

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

  static JTabTest () {
    const original = macrotable
    const rowAbstract = row => JSON.stringify(row)
    'original samples form' |> console.log
    VecX.vBrief(macrotable, { abstract: rowAbstract }) |> console.log

    'samples form to table form' |> console.log
    const table = JTab.fromSamples(macrotable, 'head', 'rows')
    table |> console.log

    'table form to samples form' |> console.log
    const samples = JTab.toSamples(table.rows, table.head)
    // deco(samples |> console.log
    VecX.vBrief(samples, { abstract: rowAbstract }) |> console.log
  }
}

//
// test('SimpleJsoTest createObjectTest', () => {
//   SimpleJsoTest.createObjectTest()
// })

test('clone', () => {
  const abc = {
    f: 1,
    b: 2,
    c: [1, 2]
  }
  'original abc' |> console.log
  abc |> console.log

  'clone abc as bcd' |> console.log
  const bcd = Jso.clone(abc)

  'abc changed c[1] to 4' |> console.log
  abc.c[1] = 4
  abc |> console.log

  'bcd' |> console.log
  bcd |> console.log

})

export {
  SimpleJsoTest
}