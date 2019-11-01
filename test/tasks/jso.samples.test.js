import { Samples } from '../../src/ext/Samples'

const samples = [
  { country: 'USA', year: '2017', gdp: 19390, pop: 325 },
  { country: 'USA', year: '2012', gdp: 16155, pop: 313 },
  { country: 'CHN', year: '2017', gdp: 12237, pop: 1386 },
  { country: 'CHN', year: '2012', gdp: 8560, pop: 1350 },
  { country: 'JPN', year: '2017', gdp: 4872, pop: 126 },
  { country: 'JPN', year: '2012', gdp: 6203, pop: 127 },
  { country: 'DEU', year: '2017', gdp: 3677, pop: 82 },
  { country: 'DEU', year: '2012', gdp: 3543, pop: 80 },
  { country: 'RUS', year: '2017', gdp: 1577, pop: 144 },
  { country: 'RUS', year: '2012', gdp: 2210, pop: 143 },
  { country: 'GBR', year: '2017', gdp: 2622, pop: 66 },
  { country: 'GBR', year: '2012', gdp: 2662, pop: 63 },
]

export class JsoSamplesTest {
  static samplesToTable () {
    'samples original' |> console.log
    samples |> console.log
    '' |> console.log

    'table full' |> console.log
    const tableFull = Samples.toTable(samples,)
    tableFull |> console.log
    '' |> console.log

    'table picked' |> console.log
    const tablePick = Samples.toTable(samples, { fields: ['country', 'year', 'pop'] })
    tablePick |> console.log
    '' |> console.log
  }

  static tableToSample () {
    'table original' |> console.log
    const table = Samples.toTable(samples, {
      fields: [['country', 'nation'], 'year', 'pop', ['sales', 'rev']]
    })
    table |> console.log
    '' |> console.log

    'samples' |> console.log
    const sampleList = Samples.fromTable(table)
    sampleList |> console.log
    '' |> console.log

    'samples select' |> console.log
    const sampleSelect = Samples.select(sampleList, ['nation', 'rev'])
    sampleSelect |> console.log
    '' |> console.log

    'samples picked' |> console.log
    const sampleListPicked = Samples.fromTable(table, [['nation', 'c'], 'year', ['pop', 'population'], 'marketcap'])
    sampleListPicked |> console.log
    '' |> console.log
  }

  static crosTabToSamples () {
    'crosTab original' |> console.log
    const { head, rows } = Samples.toTable(samples)
    const y = head.indexOf('country')
    const columns = [...new Set(rows.map(row => row[y]))]
    const newRows = columns.map(country => rows.filter(row => row[y] === country)[0])
    const crosTab = { matrix: newRows, side: columns, banner: head }
    crosTab |> console.log
    '' |> console.log

    'samples' |> console.log
    const sampleList = Samples.fromCrosTab(crosTab)
    sampleList |> console.log
    '' |> console.log

    'to matrix' |> console.log
    const matrix = Samples.toMatrix(samples)
    matrix |> console.log
    '' |> console.log
  }
}

describe('Ob Samples Test', function () {
  it('Ob Samples Test: samples To Table ', () => {
    JsoSamplesTest.samplesToTable()
  })
  it('Jso Samples Test: table To Sample ', () => {
    JsoSamplesTest.tableToSample()
  })
  it('Jso Samples Test: cros Tab To Samples ', () => {
    JsoSamplesTest.crosTabToSamples()
  })
})
