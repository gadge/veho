import { Chrono } from 'elprimero'
import { deco, MatX, Xr } from 'xbrief'
import { CrosTab, CrosX, Table } from 'crostab'
import { nba_players_performance } from '../../asset/cax/nba.players.perfrormance'
import { Ar } from '../../../src'

const samples = [
  { x: 'USA', y: '2000', v: 200 },
  { x: 'JPN', y: '2000', v: 100 },
  { x: 'RUS', y: '2000', v: 100 },
  { x: 'USA', y: '2010', v: 300 },
  { x: 'CHN', y: '2010', v: 50 },
  { x: 'JPN', y: '2010', v: 100 },
  { x: 'RUS', y: '2010', v: 50 },
  { x: 'USA', y: '2020', v: 250 },
  { x: 'CHN', y: '2020', v: 300 },
]

const { head: banner, rows: matrix } = nba_players_performance
const samples2 = Table.from({ banner, matrix }).matrix.map(row => ({ x: row[0], y: row[1], v: row[4] }))

const { ini } = Ar
const expandAssign = ({ x, y, v }, s, b, mx) => {
  let i = s.indexOf(x), j = b.indexOf(y)
  if (i < 0) i += vertAmpand(x, s, mx)
  if (j < 0) j += horiAmpand(y, b, mx)
  mx[i][j] = v
}

const vertAmpand = (x, s, mx) => {
  mx.length ? mx.push(mx[0].map(() => [])) : mx.push([])
  return s.push(x)
}

const horiAmpand = (y, b, mx) => {
  for (let i = mx.length - 1; i >= 0; i--) mx[i].push([])
  return b.push(y)
}

const getSideBanner = (samples) => {
  const
    { length } = samples,
    s = Array(length),
    b = Array(length)
  for (let i = 0, x, y; i < length; i++) {
    ({ x, y } = samples[i])
    s[i] = x
    b[i] = y
  }
  return [[...new Set(s)], [...new Set(b)]]
}

const toCell = fields => {
  let o = {}, x
  for (x of fields) o[x] = []
  return o
}

class PivotSimpleStrategies {
  static test () {
    const { lapse, result } = Chrono.strategies({
      repeat: 1E+5,
      paramsList: {
        simple: [samples],
        nba: [samples2]
        // misc: [[[]], { x: 3, y: 2 }],
      },
      funcList: {
        stable: (samples) => {
          const crosTab = CrosTab.ini({
            side: [...new Set(samples.map(({ x }) => x))],
            banner: [...new Set(samples.map(({ y }) => y))],
            ject: (x, y) => []
          })
          for (const { x, y, v } of samples) crosTab.queryCell(x, y).push(v)
          return crosTab
        },
        dev: (samples) => {
          const { length } = samples
          const [side, banner] = getSideBanner(samples)
          /**
           * A CrosTab of which each matrix element/cell is an object {field1:*[],field2:*[],...}
           * @type {CrosTab} crosTab
           */
          const crosTab = CrosTab.ini({
            side,
            banner,
            ject: (x, y) => []
          })
          for (let i = 0, x, y, v; i < length; i++) {
            ({ x, y, v } = samples[i])
            crosTab.queryCell(x, y).push(v)
          }
          return crosTab
        },
        edge: (samples) => {
          const [s, b, mx] = [[], [], []]
          for (let i = 0, { length } = samples; i < length; i++)
            expandAssign(samples[i], s, b, mx)
          return CrosTab.from({ side: s, banner: b, matrix: mx })
        },
      }
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    result.brief() |> console.log

    'stable' |> console.log
    const ct = result.queryCell('simple', 'stable')
    ct|> CrosX.brief |> console.log
    ct.matrix|> MatX.xBrief |> console.log

    'dev ' |> console.log
    const ct2 = result.queryCell('simple', 'dev')
    ct2|> CrosX.brief |> console.log
    ct2.matrix|> MatX.xBrief |> console.log

    'edge ' |> console.log
    const ct3 = result.queryCell('simple', 'edge')
    ct3|> CrosX.brief |> console.log
    ct3.matrix|> MatX.xBrief |> console.log
  }
}

describe('Pivot Simple Strategies', function () {
  this.timeout(1000 * 60)
  it('Pivot Simple Strategies: test', () => {
    PivotSimpleStrategies.test()
  })
})