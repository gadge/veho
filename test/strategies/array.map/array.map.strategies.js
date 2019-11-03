import { Chrono } from 'elprimero'
import { Ar } from '../../../src/ext/Ar'
import { totx } from 'xbrief'

const { map: map1 } = Ar

export class ArrayMapStrategies {
  static test () {
    const { lapse, result } = Chrono.strategies({
      repeat: 2E+6,
      paramsList: {
        // simple: [[1, 2, 3, 4, 5]],
        misc: [Ar.ini(128, i => i)],
      },
      funcList: {
        stable: ar => ar.map(x => x),
        dev: ar => map1(ar, x => x, 128)
      }
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    result.brief() |> console.log
  }
}

describe('Array Map Strategies', function () {
  this.timeout(1000 * 60)
  it('Array Map Strategies: test ', () => {
    ArrayMapStrategies.test()
  })
})
