const log = require('../lib/logger.js')

class RaftDataSource {
  constructor (source, opts) {
    this.source = source
    this.opts = opts
  }

  do (actionName, actionOptions) {
    log.debug({actionName, actionOptions}, '::do')
    if (!actionName) {
      log.debug('No action name given, attempting to use defaults')
      if (!this.opts.default ||
        this.opts.default.action) {
        throw new Error('Source does not have valid defaults')
      }
      const { action, options } = this.opts.default
      return this.do(action, options)
    }

    const action = this.source.options()[actionName]

    if (!action) {
      log.error({actionName}, 'Actions not implemented')
      return
    }
    return this.source[action.f](actionOptions)
  }

  options () {
    return this.source.options()
  }
}

module.exports = {
  create (source, options) {
    return new RaftDataSource(source, options)
  }
}
