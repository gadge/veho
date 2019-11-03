import { toraja } from 'funfact'
import { Samples } from '../../src/ext/Samples'
import { Pivot } from '../../src/utils/Pivot'
import { Chrono } from 'elprimero'
import { ArrX, CrosTabX } from 'xbrief'
import { PivotModes } from '../../src/utils/PivotModes'
import { Ar } from '../../src/ext/Ar'
import { Zu } from 'borel'

const { gross } = toraja.MacroWorld
const gdpList = Samples.fromTable({ head: gross.banner, rows: gross.matrix })
const nyTimes = Samples.fromTable(toraja.NYTimes)
const duties = Samples.fromTable({
  head: ['day', 'name', 'served', 'sold', 'adt'],
  rows: [
    [1, 'Joyce', 70, 7, ''],
    [1, 'Joyce', 66, 15, ''],
    [2, 'Joyce', 86, 10, ''],
    [2, 'Joyce', NaN, NaN, ''],
    [3, 'Joyce', 96, 2, ''],
    [1, 'Lance', 98, 15, ''],
    [1, 'Lance', 66, 15, ''],
    [2, 'Lance', 85, 12, ''],
    [2, 'Lance', 63, 12, ''],
    [3, 'Lance', NaN, NaN, ''],
    [1, 'Naomi', 90, 14, ''],
    [1, 'Naomi', 66, 9, ''],
    [2, 'Naomi', NaN, NaN, ''],
    [2, 'Naomi', 93, 16, ''],
    [3, 'Naomi', 78, 8, ''],
  ]
})

// nyTimes |> console.log

export class PivotTest {
  static test () {
    const paramsList = {
      gdp: [gdpList, ['countryiso3code', 'date', 'value'], { mode: PivotModes.count }],
      // nyt: [nyTimes, ['section', 'subsection'], { mode: PivotModes.count }],
      duties: [duties, ['day', 'name', 'served'], { mode: PivotModes.sum, include: x => !isNaN(x) }]
    }
    const { lapse, result } = Chrono.strategies({
      repeat: 1E+4,
      paramsList,
      funcList: {
        stable: (rows, fields, modes) => new Pivot(rows).pivot(fields, modes)
      }
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    result.brief() |> console.log

    'stable' |> console.log
    for (let key of Object.keys(paramsList)) {
      key |> console.log
      result.queryCell(key, 'stable') |> CrosTabX.brief |> console.log
      '' |> console.log
    }

  }
}

// describe('Pivot Test', function () {
//   this.timeout(1000 * 60)
//   it('Pivot Test: test ', () => {
//     PivotTest.test()
//   })
// })
