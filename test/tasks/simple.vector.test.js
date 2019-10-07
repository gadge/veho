import { deco, VecX, Typ } from 'xbrief'
import { nbaScoreLeaders } from '../asset/map/nba.score.leaders'
import { iterateStaticMethod } from '../utils/iterateStaticMethod'
import { Vec } from '../../src/ext/Vec'

function take (arr, len) {
  return arr.slice(0, len)
}

const localHBrief = (arr) => `[ ${VecX.hBrief(arr, { head: 3, tail: 2 })} ]`

class SimpleVectorTest {
  static test_ini () {
    'Vec.ini(5, i => i * 2)' |> console.log
    Vec.ini(5, i => i * 2) |> console.log

    'Vec.ini(128, i => i ^ 2) ' |> console.log
    Vec.ini(128, i => i ** 2)  |> localHBrief |> console.log

    'Vec.ini(5, \'x\')' |> console.log
    Vec.ini(5, 'x') |> console.log

    'Vec.ini(256, null)' |> console.log
    Vec.ini(256, null) |> localHBrief |> console.log
  }

  static zip_test () {
    const chiefs = ['Sorkin', 'Wintour', 'Portman']
    const profs = ['Screen writing', 'Journalism', 'Acting']
    chiefs.zip(profs, (a, b) => `${a}: ${b}`) |> console.log
  }

  static test_one () {
    let specials = {
      zeroLengthArray: new Array(0),
      agents: ['NASA', 'Tesla', 'Sukhoi', 'Virgin']
    }
    deco(specials).wL()
    let parameters = [-1, 0, 1, 3]
    for (let [k, v] of Object.entries(specials)) {
      for (let p of parameters) {
        `${take.name}(${k},${p})`.tag(take(v, p).vBrief()).wL()
      }
    }
    return 0
  }

  static test_take () {
    let names = [...nbaScoreLeaders.keys()]
    names.take(5).vBrief().wL()
  }

  static test_iterator () {
    let arr = ['NASA', 'Tesla', , 'Sukhoi', 'Virgin']
    let samples = {
      iterObjectKeys: Object.keys(arr),
      iterObjectKeys_Arr: [...Object.keys(arr)],
      iterArrPrototypeKeys: arr.keys(),
      iterArrPrototypeKeys_Arr: [...arr.keys()]
    };
    (arr|>VecX.vBrief).wL()
    for (let [k, iterInstance] of Object.entries(samples)) {
      k.wL()
      Typ.check(iterInstance).wL()
      VecX.vBrief(iterInstance).wL()
    }

  }
}

// test('SimpleVectorTest vec.ini test', () => {
//   SimpleVectorTest.test_ini()
// })
//
// test('SimpleVectorTest zip test', () => {
//   SimpleVectorTest.zip_test()
// })

export {
  SimpleVectorTest
}