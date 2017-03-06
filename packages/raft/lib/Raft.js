const log = require('./logger')
const RaftDataManager = require('@wwselleck/raft-datamanager')
const RaftServer = require('./RaftServer')
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
  constructor (config, dataManager, server) {
    this.dataManager = dataManager
    this.server = server
    this.server.setDataManager(dataManager)

    this.plugins = []

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
    this.plugins.push(plugin)
    log.debug({plugin}, 'Attemping to apply plugin')
    plugin(new RaftPluginInterface(this))
    log.debug({plugin}, 'Plugin applied')
  }

  start () {
    return this.server.start()
  }
}

module.exports = (config) => {
  return new Raft(config, new RaftDataManager(), new RaftServer())
}
