import { Mx } from '../../../src/ext/Mx'

export class MxTest {
  static spliceCols () {
    const cols = [
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4, 5],
    ]
    Mx.spliceCols(cols, [2]) |> console.log
  }
}

describe('Mx Test', function () {
  this.timeout(1000 * 60)
  it('Mx Test: splice Cols ', () => {
    MxTest.spliceCols()
  })
})
