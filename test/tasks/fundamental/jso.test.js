describe('JsoTest', function () {
  it('deconstruction: test', () => {
    const brr = ['foo', 'bar', 'baz']
    const crr = {
      foo: null,
      bar: null,
      baz: null
    }
    const sample = { foo: 10, fan: 20, bar: 30, kha: 40, baz: 50 }
    const picker = (({ ...crr }) => ({ ...crr }))
    const picker2 = ({ foo, bar, baz }) => ({ foo, bar, baz })
    sample |> picker |> console.log
    // const frr = Object.fromEntries([
    //   ['foo', 10],
    //   ['bar', 20],
    //   ['baz', 30],
    // ])
    // frr |> console.log
  })
  // it('deconstruct: test 2', () => {
  //   const crr = { 'foo': 10, 'bar': 20, 'baz': 30 }
  //   const [...drr] = crr
  //   drr |> console.log
  // })
})