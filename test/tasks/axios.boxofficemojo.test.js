import 'xbrief'
import axios from 'axios'
import { Xio } from '../utils/axios-ext'
import { deco } from 'xbrief'

axios.defaults.withCredentials = true

function testAxiosBoxOfficeMojo () {
  const arr = 'Let\'s testIni boxOfficeMojo'
  let content = ''
  axios
    .get(`https://www.boxofficemojo.com/yearly/chart/`, {
      params: {
        'yr': '2019',
        'p': '.htm',
      }
    })
    .then(response => {
      content = response.data
      console.log(response.data)
    })
    .catch(Xio.logErr)
  deco(content).wL()
}

export {
  testAxiosBoxOfficeMojo
}
