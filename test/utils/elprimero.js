const fmT = new Intl.DateTimeFormat(
  undefined,
  {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }
)

let nowTM = () => {
  let d = new Date()
  return `${fmT.format(d)}.${d.getMilliseconds().toPrecision(3)}`
}

export {
  nowTM
}