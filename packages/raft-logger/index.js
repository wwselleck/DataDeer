let bunyan = require('bunyan')

const baseLogger = bunyan.createLogger({
  name: 'Raft',
  src: true,
  level: process.env.RAFT_DEBUG ? 'debug' : 'error',
  stream: process.stdout,
  serializers: {
    err: bunyan.stdSerializers.err
  }
})

const CHILD_DEFAULTS = {
  module: module.parent.filename
}

function createLogger (opts) {
  return baseLogger.child(Object.assign({}, CHILD_DEFAULTS, opts))
}

module.exports = {
  createLogger
}
