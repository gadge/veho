// Create an object type Er
export class Er extends Error {
  constructor (name, message) {
    super()
    this.name = name
    this.message = message
  }

  static ini ({ name, message }) {
    return new Er(name || 'Error', message || '')
  }

  // Make the exception convert to a pretty string when used as
  // a string (e.g. by the error console)
  toString () {
    return `${this.name}: "${this.message}"`
  }
}