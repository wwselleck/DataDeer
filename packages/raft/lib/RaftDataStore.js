/** @module lib/raftDataStore */

const log = require('./logger')
const RaftDataSource = require('./RaftDataSource')

/**
 * Maintains RaftDataSources
 */
class RaftDataStore {
  /**
   * @param {Object} config
   */
  constructor (config = {}) {
    this.config = config
    this.sources = {}

    const { sources = [] } = config
    sources.forEach(source => {
      this.addSource(source)
    })
  }

  /**
   * Check if a SourceConfig is compatible with Raft
   * @param {Raft.SourceConfig} sourceConfig - Source configuration
   * @param {*} sourceConfig.source - Should be a function, but that's what's being checked
   * @param {string} sourceConfig.id - ID to identify plugin output in data object
   */
  _verifySourceCompat (sourceConfig) {
    log.debug(sourceConfig, 'Verifying source config compatability')
    const errors = []
    if (!sourceConfig) {
      errors.push(new Error('Source configuration is invalid'))
      return errors
    }
    if (!sourceConfig.source) {
      errors.push(new Error('Source configuration does not define "source"'))
    }

    if (typeof sourceConfig.source.options !== 'function') {
      errors.push(new Error('Source does not implement "options"'))
    }
    return errors
  }

  /**
   * Use a sourceConfig
   * @param {string} id - ID to use to identify data soruce
   * @param {Raft.SourceConfig} sourceConfig - Source to add
   */
  addSource (id, sourceConfig) {
    log.debug({ id, sourceConfig }, `Attemping to use source`)
    const errors = this._verifySourceCompat(sourceConfig)
    if (errors.length !== 0) {
      let errorString = 'Cannot use invalid source\n'
      errors.forEach(e => {
        errorString += `${e.toString()}\n`
      })
      log.warn(new Error(errorString))
      return
    }
    const { source, options } = sourceConfig
    this.sources[id] = RaftDataSource.create(source, options)
    return this
  }

  getSources () {
    return this.sources
  }

  /**
   * Get a data source by its ID
   * @param id - ID of source
   * @returns {RaftDataSource.RaftDataSource}
   */
  get (id) {
    // TODO error wahtever
    return this.sources[id]
  }

  /**
   * Get all default data from all sources
   */
  fetch () {
    const ret = {}
    const promises = Object.keys(this.sources).map(key => {
      const source = this.get(key)
      log.debug({key}, 'Fetching source default data')
      return source.do().then(data => {
        ret[key] = data
        log.debug({key}, 'Data successfully fetched')
      })
    })
    return Promise.all(promises).then(() => ret)
  }
}

module.exports = {
  /**
   * @param config
   * @returns {module:lib/raftDataStore~RaftDataStore}
   */
  create (config) {
    return new RaftDataStore(config)
  }
}
