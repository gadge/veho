// import { Mat } from '../../dist/index.esm'
import { Mat } from '../../src/ext/Mat'
import { deco, MatX, Typ } from 'xbrief'
import { GP } from 'elprimero'
import { Jso } from '../../src/ext/Jso'

const matrices = {
  empty_matrix: [[]],
  one_row_matrix_lack: [
    [1, , 3, 4, 5],
    [1, 2, , 4, 5],
    [1, 2, 3, , 5],
  ],
  one_row_matrix: [[1, 2, 3, 4, 5]],
  simple_matrix: Mat.ini(3, 5, (x, y) => x + y + 1)
}

class SimpleMatrixTest {
  static testIni () {
    const matrix = Mat.ini(5, 4, (x, y) => x + y)
    matrix |> console.log
    GP.now().tag(MatX.xBrief(matrix)).wL()
  }

  static testColumnIndexes () {
    const one_row_matrix_lack = [
      ['Id', '2', 'Des', '4', '5'],
      ['TSLA', '2', undefined, '4', '5'],
      ['MSFT', '2', undefined, '4', '5']
    ]
    const colIndexes = Mat.columnIndexes(one_row_matrix_lack)
    Typ.check(colIndexes).wL()
    const colIndexes2 = Mat.columnIndexes2(one_row_matrix_lack)
    Typ.check(colIndexes2).wL()
    for (let [k, v] of Object.entries(matrices)) {
      k.tag('Mat.columnIndexes').tag(Mat.columnIndexes(v)).tag(MatX.xBrief(v)).wL()
      k.tag('Mat.columnIndexes2').tag(Mat.columnIndexes2(v)).tag(MatX.xBrief(v)).wL()
    }
  }

  static testTranspose () {
    // null: null,
    //   undefined: undefined,
    //   empty_array: [],
    //   simple_array: [1, 2, 3, 4, 5],
    for (let [k, v] of Object.entries(matrices)) {
      k.toString().tag(deco(v)).wL();
      (`${k}.transposed`).tag(v|>Mat.transpose|>MatX.xBrief).wL()
    }
  }
}

export {
  SimpleMatrixTest
}