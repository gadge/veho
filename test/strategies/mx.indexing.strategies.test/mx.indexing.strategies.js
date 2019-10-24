import { Chrono } from 'elprimero'

const a = 1, b = -2, c = 1
const _mxOb = [
  [{ a, b, c }, { a, b, c }, { a, b, c }],
  [{ a, b, c }, { a, b, c }, { a, b, c }],
  [{ a, b, c }, { a, b, c }, { a, b, c }]
]

const _mxAr = [
  [[a, b, c], [a, b, c], [a, b, c]],
  [[a, b, c], [a, b, c], [a, b, c]],
  [[a, b, c], [a, b, c], [a, b, c]]
]

const _obMx = {
  a: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
  b: [[-2, -2, -2], [-2, -2, -2], [-2, -2, -2]],
  c: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
}

const oVs = Object.values(_obMx)

const locOb = (ob, i, j) => {
  oVs.map(x => x[i][j])
}

const calcOb = ({ a, b, c }) => (-b + Math.sqrt(b ^ 2 - 4 * a * c)) / (2 * a)
const calcAr = ([a, b, c]) => (-b + Math.sqrt(b ^ 2 - 4 * a * c)) / (2 * a)

class MxIndexingStrategies {
  static test () {
    const { lapse, result } = Chrono.strategies({
      repeat: 1E+6,
      paramsList: {
        mxThenCalcOb: [{}],
        calcObThenMx: [],
      },
      funcList: {
        objectOfMatrix: () => {
          const ovs = Object.values(_obMx)
          let [mxa] = ovs, { length: ht } = mxa, [row] = mxa, { length: wd } = row
          const mx = Array(ht)
          for (let i = 0; i < ht; i++) {
            mx[i] = Array(wd)
            for (let j = 0; j < wd; j++) {
              mx[i][j] = calcAr(ovs.map(x => x[i][j]))
            }
          }
          return mx
        },
        matrixOfObject: () => {
          let { length: ht } = _mxOb, [row] = _mxOb, { length: wd } = row
          const mx = Array(ht)
          for (let i = 0; i < ht; i++) {
            mx[i] = Array(wd)
            for (let j = 0; j < wd; j++) mx[i][j] = calcOb(_mxOb[i][j])
          }
          return mx
        },
        matrixOfArray: () => {
          let { length: ht } = _mxAr, [row] = _mxAr, { length: wd } = row
          const mx = Array(ht)
          for (let i = 0; i < ht; i++) {
            mx[i] = Array(wd)
            for (let j = 0; j < wd; j++) mx[i][j] = calcAr(_mxAr[i][j])
          }
          return mx
        },
      }
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    result.brief() |> console.log

  }
}

describe('Mx Indexing Strategies', function () {
  this.timeout(1000 * 60)
  it('Mx Indexing Strategies: test', () => {
    MxIndexingStrategies.test()
  })
})