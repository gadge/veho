import { Fun } from '../../src'
import { deco, Str, Typ } from 'xbrief'

class Staff {
  constructor (id, name, pos) {
    this.id = id
    this.name = name
    this.pos = pos
  }

  static fromJson ({ id, name, pos }) {
    return new Staff(id, name, pos)
  }

  get dogTag () {
    return {
      id: this.id,
      name: this.name,
      pos: this.pos
    }
  }

  promote () {
    this.pos++
  }

  demote () {
    this.pos--
  }

  toString () {
    return `[id]:${this.id}, [name]:${this.name}, [pos]:${this.pos}`
  }
}

Staff.staffCopyright = 'MIT'

export class SimpleFunTest {
  static testGetStaticNames () {
    `Test: ${SimpleFunTest.name}.${SimpleFunTest.testGetStaticNames.name}`.wL()
    Fun.getStaticMethodNames.name.deco(Fun.getStaticMethodNames(Staff)).wL()
    Fun.getStaticPropertyNames.name.deco(Fun.getStaticPropertyNames(Staff)).wL()
  }

  static testGetFuncMethods () {
    `Test: ${SimpleFunTest.name}.${SimpleFunTest.testGetFuncMethods.name}`.wL()
    // const funcSet = {
    //   a: x => x ^ 2,
    //   b: x => x * 2,
    //   c: x => x + 1
    // }
    // const fun = Fun.chain(...Object.values(funcSet))
    // Str.tag('JSON.stringify(fun)', deco(fun)).wL()
    // Typ.check(fun).wL()
    // const arr = [1, 2, 3, 5, 7]
    // arr.vBrief(x => Str.tag(x, JSON.stringify(fun(x)))).wL()
  }

  static testFuncChains () {
    const chains = {
      a: x => x * 2,
      b: x => x + 5,
      c: x => x / 3
    }
    const seinFunc = x => 3 * x
    const finalFunc = Fun.chain(seinFunc, ...Object.values(chains))
    'finalFunc'.deco(finalFunc).wL()
    'result'.deco(finalFunc(2)).wL()
    // const z = 2
    //   |> chains.a
    //   |> chains.b
    //   |> chains.c
    // console.log(z)
  }


}