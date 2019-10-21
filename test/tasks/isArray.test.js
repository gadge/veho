import { Xr } from 'xbrief'

it('isArray test', function () {
  const arrSet = {
    null: null,
    undefined: undefined,
    num: 0,
    empty: [],
    uno: [0],
    empty_mx: [[]]
  }
  for (let [key, o] of Object.entries(arrSet)) {
    Xr(key, Array.isArray(o)).tx |> console.log
  }
})