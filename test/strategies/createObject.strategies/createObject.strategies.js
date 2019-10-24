import { Chrono } from 'elprimero'
import { Ob } from '../../../src/ext/Ob'
import { CrosX } from 'crostab'

class CreateObjectStrategies {
  static test () {
    const funcList = {
      bench: entries => new Map(entries),
      fromEntries: entries => Object.fromEntries(entries),
      dev: entries => Ob.fromEntries(entries),
      edge: entries => {
        const o = {}
        for (let [k, v] of entries) o[k] = v
        return o
      },
      future: entries => {
        const o = {}
        for (let i = 0, { length } = entries, k, v; i < length; i++) {
          [k, v] = entries[i]
          o[k] = v
        }
        return o
      }
    }

    const { lapse, result } = Chrono.strategies({
      repeat: 2E+6,
      paramsList: {
        simple: [[['foo', []], ['bar', []], ['baz', []]]],
        // misc: [['']],
      },
      funcList
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    result.brief() |> console.log

    for (let key of Object.keys(funcList)) {
      key |> console.log
      result.queryCell('simple', key) |> console.log
      '' |> console.log
    }
  }
}

// describe('Create Object Strategies', function () {
//   this.timeout(1000 * 60)
//   it('Create Object Strategies: test', () => {
//     CreateObjectStrategies.test()
//   })
// })