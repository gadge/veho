import { deco, ArrX, Typ } from 'xbrief'
import { nbaScoreLeaders } from '../asset/map/nba.score.leaders'
import { Ar } from '../../src/ext/Ar'

function take (arr, len) {
  return arr.slice(0, len)
}

const localHBrief = (arr) => `[ ${ArrX.hBrief(arr, { head: 3, tail: 2 })} ]`

class SimpleVectorTest {

  static test_ini () {
    'Ar.ini(5, i => i * 2)' |> console.log
    Ar.ini(5, i => i * 2) |> console.log

    'Ar.ini(128, i => i ^ 2) ' |> console.log
    Ar.ini(128, i => i ** 2)  |> localHBrief |> console.log

    'Ar.ini(5, \'x\')' |> console.log
    Ar.ini(5, 'x') |> console.log

    'Ar.ini(256, null)' |> console.log
    Ar.ini(256, null) |> localHBrief |> console.log
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
        `${take.name}(${k},${p})`.tag(take(v, p) |> ArrX.vBrief).wL()
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
    (arr|>ArrX.vBrief).wL()
    for (let [k, iterInstance] of Object.entries(samples)) {
      k.wL()
      Typ.check(iterInstance).wL()
      ArrX.vBrief(iterInstance).wL()
    }

  }
}

describe('Simple Vector Test', function () {
  this.timeout(1000 * 60)
  it('Simple Vector Test: test ini ', () => {
    SimpleVectorTest.test_ini()
  })
  it('Simple Vector Test: zip test ', () => {
    SimpleVectorTest.zip_test()
  })
  it('Simple Vector Test: test one ', () => {
    SimpleVectorTest.test_one()
  })
})

export {
  SimpleVectorTest
}