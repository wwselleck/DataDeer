let bunyan = require('bunyan')

const baseLogger = bunyan.createLogger({
  name: 'DataDeer',
  src: true,
  level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
  stream: process.stdout
})

const CHILD_DEFAULTS = {
  level: 'debug',
  module: module.parent.filename
}

function createLogger (opts) {
  return baseLogger.child(Object.assign({}, CHILD_DEFAULTS, opts))
}

module.exports = {
  createLogger
}
