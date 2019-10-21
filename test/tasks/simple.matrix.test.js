import { Mx } from '../../src/ext/Mx'
import { deco, MatX } from 'xbrief'
import { GP } from 'elprimero'
import { Typ, check } from 'typen'

const matrices = {
  empty_matrix: [[]],
  one_row_matrix: [[1, 2, 3, 4, 5]],
  matrix_lack: [
    [1, , 3, 4, 5],
    [1, 2, , 4, 5],
    [1, 2, 3, , 5],
  ],
  simple_matrix: Mx.ini(3, 5, (x, y) => x + y + 1)
}

class SimpleMatrixTest {
  static testIni () {
    const matrix = Mx.ini(5, 4, (x, y) => x + y)
    matrix |> console.log
    GP.now().tag(MatX.xBrief(matrix)).wL()
  }

  static testColumnIndexes () {
    for (let [k, v] of Object.entries(matrices)) {
      k.tag('Mx.columnIndexes').tag(Mx.columnIndexes(v)).tag(MatX.xBrief(v)).wL()
    }
  }

  static testTranspose () {
    // null: null,
    //   undefined: undefined,
    //   empty_array: [],
    //   simple_array: [1, 2, 3, 4, 5],
    for (let [k, v] of Object.entries(matrices)) {
      k.toString().tag(deco(v)).wL();
      (`${k}.transposed`).tag(v|>Mx.transpose|>MatX.xBrief).wL()
    }
  }
}

describe('Simple Matrix Test', function () {
  this.timeout(1000 * 60)
  it('Simple Matrix Test: test Ini ', () => {
    SimpleMatrixTest.testIni()
  })
  it('Simple Matrix Test test Transpose : ', () => {
    SimpleMatrixTest.testTranspose()
  })
  it('Simple Matrix Test: test Column Indexes ', () => {
    SimpleMatrixTest.testColumnIndexes()
  })
})

export {
  SimpleMatrixTest
}