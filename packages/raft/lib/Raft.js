/**
 * Main Raft module. This module is directly exported by the index module
 * @module lib/raft
 * @public
 */

const log = require('./logger')
const RaftDataStore = require('./RaftDataStore')
const OptionTypes = require('./OptionTypes')

/**
 * @typedef {Object} RaftConfig
 * @property {Object.<string, module:lib/raft~SourceConfig>} [dataSources] - Sources to apply
 */

/**
 * @typedef {Object} SourceConfig
 * @property {Object} source - Plugin
 * @property {Object} [options] - Options for plugin
 * @property {Object} [options.default] - Defaults to apply to source. For use with 'fetch'
 * @property {string} [options.default.action] - Name of default action
 * @property {Object} [options.default.options] - Options to give to default action
 */

/**
 * Main Raft class.
 */
class Raft {
  /**
   * @param {module:lib/raft~RaftConfig} config
   * @public
   */
  constructor (config, store) {
    this.config = config
    this.store = store

    const { dataSources } = config
    this._applySources(dataSources)
  }

  /**
   * @param {Object.<string, module:lib/raft~SourceConfig>} sources - sources to apply
   * @returns {void}
   */
  _applySources (sources) {
    log.debug({sources}, 'Attempting to apply sources')
    Object.keys(sources).forEach(sourceName => {
      const source = sources[sourceName]
      this.use(sourceName, source)
    })
  }

  /**
   * Get active sources
   * @return {Object.<string, module:lib/raft~SourceConfig>}
   */
  sources () {
    return this.store.getSources()
  }

  /**
   * Use a source
   * @param {string} id - ID to identify source
   * @param {lib/raft.SourceConfig} sourceConfig - Configuration
   */
  use (id, sourceConfig) {
    log.debug({sourceConfig}, 'Attemping to apply source')
    this.store.addSource(id, sourceConfig)
    log.debug({sourceConfig}, 'Source applied')
    return this
  }

  /**
   * Get a source
   * @param {string} id - Id of source to get
   * @returns {module:lib/raftDataSource~RaftDataSource}
   */
  get (id) {
    return this.store.get(id)
  }

  /**
   * Get all default data from all sources
   * @returns {Object}
   */
  fetch () {
    log.debug('::fetch')
    return this.store.fetch()
  }
}

module.exports = {
  /**
   * Creates an instance of Raft
   * @param {module:lib/raft~RaftConfig} config
   * @returns {module:lib/raft~Raft}
   */
  create (config) {
    return new Raft(config, RaftDataStore.create())
  },
  OptionTypes
}
