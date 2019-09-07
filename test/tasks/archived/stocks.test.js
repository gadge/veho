import * as Stocks from 'node_modules/stocks.js/src/stocks.js'
import 'xbrief'

let s = new Stocks('DA0GB1RTQ5343QDB') // replace XXXX with your API Key

async function stocks_call () {
  let result = await s.technicalIndicator({
    symbol: 'MSFT',
    interval: 'monthly',
    indicator: 'ADX',
    time_period: 10
  })
  console.log(result)
}

function testStocks () {
  'calling...'.wL()
  stocks_call()
}

export {
  testStocks
}