const log = require('./logger')
const RaftDataSource = require('./RaftDataSource')

class RaftDataStore {
  constructor (config = {}) {
    this.config = config
    this.sources = {}

    const { sources = [] } = config
    sources.forEach(source => {
      this.addSource(source)
    })
  }

  default () {
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

  /**
   * Check if a pluginConfig is compatible with DataDeer
   * @param {Object} sourceConfig - Plugin configuration
   * @param {*} sourceConfig.plugin - Should be a function, but that's what's being checked
   * @param {string} sourceConfig.id - ID to identify plugin output in data object
   */
  _verifysourceCompat (sourceConfig) {
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
   */
  addSource (id, sourceConfig) {
    log.debug({ id, sourceConfig }, `Attemping to use source`)
    const errors = this._verifysourceCompat(sourceConfig)
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

  get (id) {
    // TODO error wahtever
    return this.sources[id]
  }

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
  create (config) {
    return new RaftDataStore(config)
  }
}
