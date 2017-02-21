let bunyan = require('bunyan')

const baseLogger = bunyan.createLogger({
  name: 'DataDeer',
  src: true,
  level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
  stream: process.stdout
})

const CHILD_DEFAULTS = {
  level: 'info',
  stream: process.stdout,
  module: module.parent.filename
}

function createLogger (opts) {
  baseLogger.child(Object.assign({}, CHILD_DEFAULTS, opts))
}

module.exports = {
  createLogger
}
