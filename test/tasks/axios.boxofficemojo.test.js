import 'xbrief'
import axios from 'axios'
import { Xio } from '../utils/axios-ext'
import { deco } from 'xbrief'

axios.defaults.withCredentials = true

async function testAxiosBoxOfficeMojo () {
  'Let\'s testIni boxOfficeMojo' |> console.log
  let content = ''
  await axios
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
  deco(content) |> console.log
}

describe('test Axios Box Office Mojo', function () {
  this.timeout(1000 * 60)
  it('test Axios Box Office Mojo: ', async () => {
    await testAxiosBoxOfficeMojo()
  })
})


export {
  testAxiosBoxOfficeMojo
}
