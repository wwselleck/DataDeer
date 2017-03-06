const log = require('./lib/logger')
const { makeError } = require('./lib/errors')

/**
 * Core class of DataDeer. Maintains a collection of plugins and fetches
 * data from them.
 */
class RaftDataManager {

  /**
   * Create a DataDeer instance
   * @param {Config} config - DataDeer configuration
   * @param {SourceConfig[]} config.sources -  Data sources to be used at initialization
   * @param {DataDeerPlugin} config.sources.plugin - Plugin to use
   * @param {object} config.sources.options - Options to use to create plugin instance
   * @param {string} config.sources.id - ID to use to identify data
   */
  constructor (config = {}) {
    this.config = config
    this.sources = []

    const { sources = [] } = config
    sources.forEach(source => {
      this.use(source)
    })
  }

  /**
   * Check if a pluginConfig is compatible with DataDeer
   * @param {Object} sourceConfig - Plugin configuration
   * @param {*} sourceConfig.plugin - Should be a function, but that's what's being checked
   * @param {string} sourceConfig.id - ID to identify plugin output in data object
   */
  _verifysourceCompat (source) {
    log.debug(source, 'Verifying source config compatability')
    const errors = []
    if (source === undefined) {
      errors.push(makeError.sourceUndefined())
      return errors
    }
    if (typeof source.fetch !== 'function') {
      errors.push(makeError.notFunction(source.filename))
    }
    return errors
  }

  /**
   * Use a sourceConfig
   */
  use (id, source) {
    log.debug({ id, source }, `Attemping to use source`)
    const errors = this._verifysourceCompat(source)
    if (errors.length !== 0) {
      let errorString = 'Cannot use invalid source\n'
      errors.forEach(e => {
        errorString += `${e.toString()}\n`
      })
      log.warn(new Error(errorString))
    }

    this.sources.push({id, source})
    return this
  }

  fetch () {
    const ret = {}
    return Promise.all(this.sources.map(sourceConfig => {
      const { source, id } = sourceConfig
      return source.fetch().then(data => {
        ret[id] = data
      }).catch(err => {
        log.error({err, source}, 'Error while fetching data for source')
      })
    })).then(() => {
      return ret
    })
  }
}

module.exports = RaftDataManager
