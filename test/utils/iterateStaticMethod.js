import { Fn } from '../../src/ext/Fn'
import { GP } from 'elprimero'
import { deco } from 'xbrief'

export function iterateStaticMethod (someClass) {
  const funcNames = Fn.getStaticMethodNames(someClass)
  const results = funcNames.map(async name => {
    const func = someClass[name]
    const title = `${someClass.name}.${name}`
    GP.now().tag(title).wL()
    // ''.wL()
    const result = await func()
    return deco({
      class: someClass.name,
      function: func.name,
      result: result
    })
  })
  Promise.all(results).then(results => {
    try {
      for (const result of results) {
        GP.now().tag(result).wL()
      }
    } catch (e) {
      GP.now().tag('error').wL()
      console.dir(e)
    }
  })
}