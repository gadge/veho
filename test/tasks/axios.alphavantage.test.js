import axios from 'axios'
import { Xio } from '../utils/axios-ext'
import { deco } from 'xbrief'
import { iterateStaticMethod } from '../utils/iterateStaticMethod'

axios.defaults.withCredentials = true

class TestAxiosAlphaVantage {
  static async test () {

    const arr = [1, 2, 3, 4, 5]
    let content = ''
    await axios
      .get(`https://www.alphavantage.co/query`, {
        params: {
          'function': 'TIME_SERIES_MONTHLY',//TIME_SERIES_INTRADAY
          'symbol': 'MSFT',
          'apikey': 'DA0GB1RTQ5343QDB'
        }
      })
      .then(response => {
        content = response.data
        console.log(response.data)
      })
      .catch(Xio.logErr)
    deco(content).wL()
    // const message = 'Hello ES6!'
    // // arr.vBrief().wL()
    // message.wL()
    // arr.vBrief().wL()
    return content
  }

  static testAsync () {
    return axios
      .get(`https://www.alphavantage.co/query`, {
        params: {
          'function': 'TIME_SERIES_MONTHLY',//TIME_SERIES_INTRADAY
          'symbol': 'MSFT',
          'apikey': 'DA0GB1RTQ5343QDB'
        }
      })
      .then(response => {
        // console.log(response.data)
        return response.data
      })
      .catch(Xio.logErr)
  }

}

export {
  TestAxiosAlphaVantage
}
