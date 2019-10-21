import { CrosTab } from 'crostab'

const assignAmp = ([x, y, v], s, b, mx) => {
  mx[vertAmp(s.indexOf(x), x, s, mx)][horiAmp(b.indexOf(y), y, b, mx)].push(v)
}

const vertAmp = (i, x, s, mx) => {
  if (i >= 0) return i
  mx.length ? mx.push(mx[0].map(() => [])) : mx.push([])
  return i + s.push(x)
}

const horiAmp = (j, y, b, mx) => {
  if (j >= 0) return j
  for (let i = mx.length - 1; i >= 0; i--) mx[i].push([])
  return j + b.push(y)
}

export const pivotAmp = (rows, [x, y, v]) => {
  const s = [], b = [], mx = []
  for (let i = 0, { length } = rows, row; i < length; i++) {
    row = rows[i]
    assignAmp([row[x], row[y], row[v]], s, b, mx)
  }

  return CrosTab.from({ side: s, banner: b, matrix: mx })
}