const log = require('./logger')
const RaftDataStore = require('./RaftDataStore')
/*
function combineArrays (...arrays) {
  return arrays.reduce((acc, val) => {
    if (val) {
      acc = acc.concat(val)
    }
    return acc
  }, [])
}
*/

/**
 * @typedef {Object} RaftConfig
 * @property {PluginConfig[]} [plugins] - List of plugins to apply
 * @property {PluginConfig[]} [dataSources] - Functionally the same as plugins, useful for logically separating data sources from plugins
 * @property {number} [refreshInterval] - How frequently to refresh the data
 */

/**
 * Main raft class
 */
class Raft {
  /**
   * Create an instance of Raft
   * @param {RaftConfig} config - Raft configuration
   */
  constructor (config, store) {
    this.config = config
    this.store = store

    const { dataSources } = config
    this._applySources(dataSources)
  }

  _applySources (sources) {
    log.debug({sources}, 'Attempting to apply sources')
    Object.keys(sources).forEach(sourceName => {
      const source = sources[sourceName]
      this.use(sourceName, source)
    })
  }

  sources () {
    return this.store.getSources()
  }

  use (id, sourceConfig) {
    log.debug({sourceConfig}, 'Attemping to apply source')
    this.store.addSource(id, sourceConfig)
    log.debug({sourceConfig}, 'Source applied')
    return this
  }

  get (id) {
    return this.store.get(id)
  }

  fetch () {
    log.debug('::fetch')
    return this.store.fetch()
  }
}

module.exports = {
  create (config) {
    return new Raft(config, RaftDataStore.create())
  }
}
