const log = require('../lib/logger.js')

function fromObj (obj) {
  return new (class extends RaftDataSource {
    constructor (obj) {
      super()
      this.obj = obj
    }

    options () {
      return Promise.resolve(this.obj)
    }
  })(obj)
}

class RaftDataSource {
  constructor (source, options) {
    this.source = source
    this.options = options
  }

  do (actionName, actionOptions) {
    log.debug({actionName, actionOptions}, '::do')
    if (!actionName) {
      log.debug('No action name given, attempting to use defaults')
      const { action, options } = this.options.default
      return this.do(action, options)
    }

    const action = this.source.options()[actionName]

    if (!action) {
      log.error({actionName}, 'Actions not implemented')
      return
    }
    return this.source[action.f](actionOptions)
  }
}

RaftDataSource.fromObj = fromObj

module.exports = {
  create (source, options) {
    return new RaftDataSource(source, options)
  }
}
