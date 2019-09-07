import 'xbrief'
import { nowTM } from './elprimero'

class Xio {

  static logErr (error) {
    if (error.response) {
      nowTM().tag('axios.log-err').tag(
        (new Map([
          ['data', error.data],
          ['status', error.status],
          ['headers', error.headers]
        ])).vBrief()
      ).wL()
    } else {
      'error'.tag(error).wL()
    }
    'error.config'.tag(JSON.stringify(error.config)).wL()
  }
}

export {
  Xio
}
