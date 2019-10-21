import { toraja } from 'funfact'
import { Samples } from '../../src/ext/Samples'
import { Pivot } from '../../src/utils/Pivot'
import { Chrono } from 'elprimero'
import { CrosTabX } from 'xbrief'
import { PivotModes } from '../../src/utils/PivotModes'

const { gross } = toraja.MacroWorld
const gdpList = Samples.fromTable({ head: gross.banner, rows: gross.matrix })
const nyTimes = Samples.fromTable(toraja.NYTimes)

// nyTimes |> console.log

export class PivotTest {
  static test () {
    const { lapse, result } = Chrono.crossByParamsAndFuncs({
      repeat: 1E+3,
      paramsList: {
        gdp: [gdpList, ['countryiso3code', 'date', 'value'], { mode: PivotModes.count }],
        nyt: [nyTimes, ['section', 'subsection'], { mode: PivotModes.count }],
      },
      funcList: {
        stable: (rows, fields, modes) => new Pivot(rows).pivot(fields, modes)
      }
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    result.brief() |> console.log

    result.queryCell('nyt', 'stable') |> CrosTabX.brief |> console.log
  }
}

describe('Pivot Test', function () {
  this.timeout(1000 * 60)
  it('Pivot Test: test ', () => {
    PivotTest.test()
  })
})