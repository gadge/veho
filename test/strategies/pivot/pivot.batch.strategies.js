import { Chrono } from 'elprimero'
import { deco, MatX } from 'xbrief'
import { CrosTab, CrosX } from 'crostab'
import { nba_players_performance } from '../../asset/cax/nba.players.perfrormance'
import { Ar } from '../../../src/ext/Ar'

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

const batchAssign = (row, fis, ob) => {
  for (let [f, i] of fis) ob[f].push(row[i])
}

const expandAssignOb = (row, [x, y, fis], s, b, mx, crOb) => {
  let i = s.indexOf(row[x]), j = b.indexOf(row[y])
  if (i < 0) i += assignVert(row[x], s, mx, crOb)
  if (j < 0) j += assignHori(row[y], b, mx, crOb)
  batchAssign(row, fis, mx[i][j])
}

const expandAssignAr = (row, [x, y, idxs], s, b, mx, crAr) => {
  let i = s.indexOf(row[x]), j = b.indexOf(row[y])
  if (i < 0) i += assignVert(row[x], s, mx, crAr)
  if (j < 0) j += assignHori(row[y], b, mx, crAr)
  mx[i][j].forEach((a, i) => a.push(row[idxs[i]]))
}

const assignHori = (y, b, mx, crOb) => {
  for (let i = mx.length - 1; i >= 0; i--) mx[i].push(crOb())
  return b.push(y)
}

const assignVert = (x, s, mx, crOb) => {
  mx.length ? mx.push(mx[0].map(() => crOb())) : mx.push([])
  return s.push(x)
}

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

class PivotBatchStrategies {
  static test () {
    const funcList = {
      stable: (rows, [x, y, fis]) => {
        const fields = Object.keys(fis)
        const fiEntries = Object.entries(fis)
        const { length } = fields
        const crosTab = CrosTab.ini({
          side: [...new Set(rows.map(r => r[x]))],
          banner: [...new Set(rows.map(r => r[y]))],
          ject: (x, y) => toCell(fields)
        })
        for (const row of rows) {
          let ob = crosTab.queryCell(row[x], row[y])
          for (let k = 0, f, i; k < length; k++) {
            [f, i] = fiEntries[k]
            ob[f].push(row[i])
          }
        }
        return crosTab
      },
      dev: (rows, [x, y, fis]) => {
        const fields = Object.keys(fis)
        const fiEntries = Object.entries(fis)
        const { length } = rows
        const [side, banner] = getSideBanner(rows, x, y)
        /**
         * A CrosTab of which each matrix element/cell is an object {field1:*[],field2:*[],...}
         * @type {CrosTab} crosTab
         */
        const crosTab = CrosTab.ini({
          side,
          banner,
          ject: (x, y) => toCell(fields)
        })
        // for (const row of rows) {
        //   let ob = crosTab.queryCell(row[x], row[y])
        //   for (let k = 0, f, i; k < fis.length; k++) {
        //     [f, i] = fiEntries[k]
        //     ob[f].push(row[i])
        //   }
        // }
        for (let i = 0, row; i < length; i++) {
          row = rows[i]
          let ob = crosTab.queryCell(row[x], row[y])
          for (let k = 0, f, idx; k < fis.length; k++) {
            [f, idx] = fiEntries[k]
            ob[f].push(row[idx])
          }
        }
        return crosTab
      },
      edge: (rows, [x, y, fis]) => {
        const [s, b, mx] = [[], [], []]
        const fields = Object.keys(fis)
        const _fis = Object.entries(fis)
        const crOb = () => toCell(fields)
        for (let i = 0, { length } = rows; i < length; i++) {
          expandAssignOb(rows[i], [x, y, _fis], s, b, mx, crOb)
        }
        return CrosTab.from({ side: s, banner: b, matrix: mx })
      },
      vec: (rows, [x, y, fis]) => {
        const [s, b, mx] = [[], [], []]
        const fields = Object.keys(fis)
        const _fis = Object.values(fis)
        const { length } = fields
        const crAr = () => Ar.ini(length, () => [])
        for (let i = 0, { length } = rows; i < length; i++) {
          expandAssignAr(rows[i], [x, y, _fis], s, b, mx, crAr)
        }
        return CrosTab.from({ side: s, banner: b, matrix: mx })
      },
      future: (rows, [x, y, fis]) => {
        const [s, b, mx] = [[], [], []]
        const fields = Object.keys(fis)
        const _fis = Object.values(fis)
        const { length } = fields
        const crAr = () => Ar.ini(length, () => [])
        for (let i = 0, { length } = rows; i < length; i++) {
          expandAssignAr(rows[i], [x, y, _fis], s, b, mx, crAr)
        }
        return CrosTab.from({ side: s, banner: b, matrix: mx })
      }
    }
    const { lapse, result } = Chrono.strategies({
      repeat: 1E+4,
      paramsList: {
        simple: [samples, [0, 1, { v: 2 }]],
        nba: [nbaRows, [0, 1, { GS: 4 }]]
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
      const ct = result.queryCell('nba', 'future')
      CrosX.brief(ct, { abstract: JSON.stringify })|> console.log
      ct.matrix|> MatX.xBrief  |> console.log
    }

  }
}

describe('Pivot Batch Strategies', function () {
  this.timeout(1000 * 60)
  it('Pivot Batch Strategies: test ', () => {
    PivotBatchStrategies.test()
  })
})
