// Create an object type VehoError
export class VehoError extends Error {
  constructor (message) {
    super()
    this.name = 'VehoError'
    this.message = message
  }

  // Make the exception convert to a pretty string when used as
  // a string (e.g. by the error console)
  toString () {
    return this.name + ': "' + this.message + '"'
  }
}