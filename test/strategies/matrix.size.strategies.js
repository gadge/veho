import { Chrono } from 'elprimero'

export class MatrixSizeStrategies {
  static test () {
    const { lapse, result } = Chrono.strategies({
      repeat: 1E+7,
      paramsList: {
        null: [null],
        empty1d: [[]],
        empty2d: [[[]]],
        uno1d: [['some']],
        uno2d: [[['some']]],
        simple: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]]
      },
      funcList: {
        stable: (mx) => {
          if (!mx) return [undefined, undefined]
          let h = mx.length
          if (!h) return [0, undefined]
          let [r] = mx
          if (!r) return [h, undefined]
          let w = r.length
          if (!w) return [h, 0]
          return [h, w]
        },
        dev: (mx) => {
          const l = mx ? mx.length : undefined
          return [l, l ? mx[0]?.length : undefined]
        },
        fut: (mx) => {
          const l = mx?.length
          return [l, l ? mx[0]?.length : undefined]
        }
      }
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    result.brief() |> console.log

  }
}

describe('Matrix Size Strategies', function () {
  this.timeout(1000 * 60)
  it('Matrix Size Strategies: test ', () => {
    MatrixSizeStrategies.test()
  })
})