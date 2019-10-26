import { Mx } from '../../src/ext/Mx'
import { MatX } from 'xbrief'
import { Chrono } from 'elprimero'

export class MxTest {
  static selectTest () {
    const { lapse, result } = Chrono.strategies({
      repeat: 2E+6,
      paramsList: {
        simple: [[
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4]
        ], 1, 3, 0],
      },
      funcList: {
        bench: (rows) => rows.map(r => r),
        native: (rows, ...indexes) => rows.map(r => indexes.map(i => r[i])),
        stable: (mx, ...indexes) => {
          let [h, w] = Mx.size(mx), l = indexes.length
          if (!h || !w || !l) return mx
          if (l === 1) {
            const [i] = indexes
            return mx.map(r => [r[i]])
          } else {
            let _mx = Array(h), r, _r, i
            for (--h; h >= 0; --h) {
              r = mx[h]
              _r = Array(l)
              for (i = 0; i < l; i++) _r[i] = r[indexes[i]]
              _mx[h] = _r
            }
            return _mx
          }
        },
      }
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    // result.brief() |> console.log
    result.queryCell('simple', 'stable') |> MatX.xBrief |> console.log
  }
}

describe('Mx Test', function () {
  this.timeout(1000 * 60)
  it('Mx Test: select Test ', () => {
    MxTest.selectTest()
  })
})
