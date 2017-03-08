const log = require('./logger')
const RaftDataStore = require('./RaftDataStore')
const RaftPluginInterface = require('./RaftPluginInterface')

function combineArrays (...arrays) {
  return arrays.reduce((acc, val) => {
    if (val) {
      acc = acc.concat(val)
    }
    return acc
  }, [])
}

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
    this.store = store
    const { plugins, dataSources } = config
    this._applyPlugins(combineArrays(plugins, dataSources))

    this.config = config
  }

  _applyPlugins (plugins) {
    plugins.forEach(plugin => {
      this.use(plugin)
    })
  }

  use (plugin) {
    log.debug({plugin}, 'Attemping to apply plugin')
    plugin(new RaftPluginInterface(this))
    log.debug({plugin}, 'Plugin applied')
    return this
  }

  _fetchAll () {
    return this.store.fetch()
  }

  get (id) {
    return this.store.get(id)
  }
}

module.exports = {
  create (config) {
    return new Raft(config, RaftDataStore.create())
  }
}
