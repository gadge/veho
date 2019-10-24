import { Chrono } from 'elprimero'
import { CrosTabX } from 'xbrief'
import { CrosTab, CrosX } from 'crostab'
import { nba_players_performance } from '../../asset/cax/nba.players.perfrormance'
import { pivotAmp } from './resources/pivotAmp'
import { Pivot } from '../../../src/utils/Pivot'

const samples = [
  ['USA', '2000', 200],
  ['JPN', '2000', 100],
  ['RUS', '2000', 100],
  ['USA', '2010', 300],
  ['CHN', '2010', 50],
  ['JPN', '2010', 100],
  ['RUS', '2010', 50],
  ['USA', '2020', 250],
  ['CHN', '2020', 300],
]

const nbaRows = nba_players_performance.rows

const getSideBanner = (rows, x, y) => {
  const
    { length } = rows,
    s = Array(length),
    b = Array(length)
  for (let i = 0, row; i < length; i++) {
    row = rows[i]
    s[i] = row[x]
    b[i] = row[y]
  }
  return [[...new Set(s)], [...new Set(b)]]
}

const toCell = fields => {
  let o = {}, x
  for (x of fields) o[x] = []
  return o
}

let pvt

export class PivotStrategies {
  static test () {
    const funcList = {
      stable: (rows, [x, y, v]) => {
        const crosTab = CrosTab.ini({
          side: [...new Set(rows.map(r => r[x]))],
          banner: [...new Set(rows.map(r => r[y]))],
          ject: (x, y) => []
        })
        for (const row of rows) crosTab.queryCell(row[x], row[y]).push(row[v])
        return crosTab
      },
      dev: (rows, [x, y, v]) => {
        const { length } = rows
        const [side, banner] = getSideBanner(rows, x, y)
        const crosTab = CrosTab.ini({
          side,
          banner,
          ject: (x, y) => []
        })
        for (let i = 0, row; i < length; i++) {
          row = rows[i]
          crosTab.queryCell(row[x], row[y]).push(row[v])
        }
        return crosTab
      },
      edge: pivotAmp,
      class: (rows, [x, y, v]) => {
        // return new Pivot(rows).pivot([x, y, v])
        if (!pvt || pvt.rows.length !== rows.length) {
          pvt = new Pivot(rows)
          return pvt.pivot([x, y, v])
        }
        return pvt.pivot([x, y, v], { ini: false })
      },
    }
    const { lapse, result } = Chrono.strategies({
      repeat: 1E+3,
      paramsList: {
        simple: [samples, [0, 1, 2]],
        nba: [nbaRows, [0, 1, 4]]
      },
      funcList
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    result.brief() |> console.log

    for (let key of Object.keys(funcList).filter(key => key === 'dev')) {
      key |> console.log
      result
        .queryCell('nba', key)
        |> (_ => CrosTabX.brief(_, { abstract: JSON.stringify }))
        |> console.log
      '' |> console.log
    }

  }
}

// describe('Pivot Strategies', function () {
//   this.timeout(1000 * 60)
//   it('Pivot Strategies: test ', () => {
//     PivotStrategies.test()
//   })
// })