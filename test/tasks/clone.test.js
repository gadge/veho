import { Chrono } from 'elprimero'
import { nba_players_performance } from '../asset/cax/nba.players.perfrormance'
import { Mat, Vec, Dic } from '../../src/index'
import { MagnitudeForm, MatX, VecX } from 'xbrief'
import { clone as clone_beta, cloneArray as cloneArray_beta } from '../../src/misc/clone'
import { clone as clone_alpha } from '../../src/misc/clone_alpha'
import { clone as clone_tersed } from '../dist/index.esm'
import { Stat } from 'borel'

class CloneTest {
  static Stat

  static cloneArray () {
    const { lapse, result } = Chrono.crossByParamAndFuncs({
      repeat: 512,
      paramsList: {
        nba_players_performance: [nba_players_performance.rows],
        // null_val: [null],
        // empty_arr: [[]],
        // empty_mtx: [[[]]],
        // arr_5_null: [Vec.ini(5, null)],
        // arr_144_some: [Vec.ini(144, 0)],
        mx_4_4: [Mat.ini(4, 4, (i, j) => i + j)],
        mx_16_32: [Mat.ini(16, 32, (i, j) => i + j)],
        mx_32_16: [Mat.ini(32, 16, (i, j) => i + j)],
        mx_64_16: [Mat.ini(64, 16, (i, j) => i + j)],
        mx_2048_12: [Mat.ini(2048, 12, (i, j) => i + j)],
        mx_128_128: [Mat.ini(128, 128, (i, j) => i + j)]
      },
      funcList: {
        benchmark: it => !!it ? it.slice() : it,
        std_deep_clone: it => JSON.parse(JSON.stringify(it)),
        clone_alpha: it => clone_alpha(it),
        clone_beta: it => clone_beta(it),
        clone_array_beta: it => !!it ? cloneArray_beta(it) : clone_beta(it),
        clone_tersed_beta: it => clone_tersed(it),
        clone_2d: it => Mat.clone(it)

      }
    })
    const f = new MagnitudeForm(0)
    lapse
      .unshiftRow('AVG', lapse.columns.map(col => col |> Stat.avg |> f.format))
      .brief() |> console.log
    const lex = Dic.ini(result.side, result.column('clone_beta'))
    for (let [k, obj] of lex.entries()) {
      k |> console.log
      if (Array.isArray(obj) && obj.length) {
        if (Array.isArray(obj[0])) {
          MatX.xBrief(obj, { rows: { head: 3, tail: 1 }, columns: { head: 2, tail: 1 } }) |> console.log
        } else {
          `[${VecX.hBrief(obj, { head: 3, tail: 2 })}]` |> console.log
        }
      } else {
        obj |> console.log
      }
    }

  }

  static cloneMap () {

  }

  static cloneObject () {

  }
}

//
// test('CloneTest cloneArray', () => {
//   CloneTest.cloneArray()
// })

export {
  CloneTest
}