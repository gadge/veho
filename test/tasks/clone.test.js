import { Chrono } from 'elprimero'
import { nba_players_performance } from '../asset/cax/nba.players.perfrormance'
import { Mx, Dc, clone as clone_tersed } from '../../src/index'
import { MagnitudeForm, MatX, ArrX } from 'xbrief'
import { clone as clone_beta, dpArr as cloneArray_beta } from '../../src/misc/clone'
import { clone as clone_alpha } from '../../src/misc/clone_alpha'
import { Stat } from 'borel'

class CloneTest {
  static Stat

  static cloneArray () {
    const { lapse, result } = Chrono.strategies({
      repeat: 256,
      paramsList: {
        nba_players_performance: [nba_players_performance.rows],
        // null_val: [null],
        // empty_arr: [[]],
        // empty_mtx: [[[]]],
        // arr_5_null: [Ar.ini(5, null)],
        // arr_144_some: [Ar.ini(144, 0)],
        mx_4_4: [Mx.ini(4, 4, (i, j) => i + j)],
        mx_16_32: [Mx.ini(16, 32, (i, j) => i + j)],
        mx_32_16: [Mx.ini(32, 16, (i, j) => i + j)],
        mx_64_16: [Mx.ini(64, 16, (i, j) => i + j)],
        mx_2048_12: [Mx.ini(2048, 12, (i, j) => i + j)],
        mx_128_128: [Mx.ini(128, 128, (i, j) => i + j)]
      },
      funcList: {
        benchmark: it => !!it ? it.slice() : it,
        std_deep_clone: it => JSON.parse(JSON.stringify(it)),
        clone_alpha: it => clone_alpha(it),
        clone_beta: it => clone_beta(it),
        clone_array_beta: it => !!it ? cloneArray_beta(it) : clone_beta(it),
        clone_tersed_beta: it => clone_tersed(it),
        clone_2d: it => Mx.clone(it)
      }
    })
    lapse.brief() |> console.log
    const lex = Dc.ini(result.side, result.column('clone_beta'))
    for (let [k, obj] of lex.entries()) {
      k |> console.log
      if (Array.isArray(obj) && obj.length) {
        if (Array.isArray(obj[0])) {
          MatX.xBrief(obj, { rows: { head: 3, tail: 1 }, columns: { head: 2, tail: 1 } }) |> console.log
        } else {
          `[${ArrX.hBrief(obj, { head: 3, tail: 2 })}]` |> console.log
        }
      } else {
        obj |> console.log
      }
    }
  }
}

describe('Clone Test', function () {
  this.timeout(1000 * 60)
  it('Clone Test: clone Array ', () => {
    CloneTest.cloneArray()
  })
})

export {
  CloneTest
}