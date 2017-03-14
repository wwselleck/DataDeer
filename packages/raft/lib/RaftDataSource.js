/**
 * @module lib/raftDataSource
 */

const log = require('../lib/logger.js')

/**
 * Wraps a plugin and exposes functions for accessing it
 */
class RaftDataSource {
  /**
   * @param source
   */
  constructor (source, opts) {
    this.source = source
    this.opts = opts
  }

  /**
   * Do an action on the data source
   * @param {string} actionName - Name of the action to do
   * @param {Object} actionOptions - Options to apply to action
   * @returns {Object} - Returned data from action
   */
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

  /**
   * Get the available actions from the data source
   */
  options () {
    return this.source.options()
  }
}

module.exports = {
  /**
   * Create an instance of RaftDataSource
   * @param {Object} source - Source to wrap
   * @param {Object} options - Options for data source
   * @returns {module:lib/raftDataSource~RaftDataSource}
   */
  create (source, options) {
    return new RaftDataSource(source, options)
  }
}
