import { Chrono } from 'elprimero'
import { toraja } from 'funfact'
import { Samples } from '../../../src/ext/Samples'
import { Table } from 'crostab'
import { ArrX, TableX } from 'xbrief'

const { NYTimes } = toraja
const { gross } = toraja.MacroWorld
const gdpList = Table.from(gross)
const nyTimes = Table.from({ banner: NYTimes.head, matrix: NYTimes.rows })

export class IncludesStrategies {
  static test () {
    const { lapse, result } = Chrono.strategies({
      repeat: 3E+6,
      paramsList: {
        simple: [gdpList.column('country'), 'United States'],
        misc: [nyTimes.column('section'), 'Health'],
      },
      funcList: {
        _includes: (ar, x) => ar.includes(x),
        _indexOf: (ar, x) => ar.indexOf(x),
      }
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    result.brief() |> console.log

  }
}

describe('Includes Strategies', function () {
  this.timeout(1000 * 60)
  it('Includes Strategies: test ', () => {
    IncludesStrategies.test()
    // gdpList.column('country')
    // nyTimes.column('section') |> (_ => ArrX.vBrief(_, { head: 4, tail: 20 }))  |> console.log
  })
})