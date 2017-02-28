let datadeer = require('datadeer-core')
let log = require('./lib/logger.js')
let { loadPlugin } = require('./lib/plugin-loader.js')
const Server = require('./lib/Server')

class DataDeerCMS {
  /**
   * Create an instance of DataDeerCMS
   * @param {Object} config - DataDeerCMS configuration
   * @param {PluginConfig[]} config.plugins - List of plugins
   */
  constructor (config) {
    const { plugins, dataInterval } = config
    const resolvedPlugins = this._resolvePlugins(plugins)
    log.debug({resolvedPlugins}, 'resolved')
    this.pluginConfigs = resolvedPlugins

    const dataFetcher = datadeer()
    this._applyPlugins(dataFetcher, resolvedPlugins)
    this.dataFetcher = dataFetcher

    const server = new Server({
      dataFetcher: dataFetcher.fetch.bind(dataFetcher),
      dataInterval: 3000
    })
    this.server = server

    this.dataInterval = dataInterval
  }

  /**
   * Resolve list of plugins. If a plugin is provided as a string, require that module.
   * @param {PluginConfig[]} pluginConfigs - List of plugins
   * @returns {PluginConfig[]} Resolved plugins
   */
  _resolvePlugins (pluginConfigs) {
    return pluginConfigs.map(pluginConfig => {
      log.debug({pluginConfig}, 'Resolving pluginConfig')
      if (typeof pluginConfig.plugin === 'string') {
        try {
          log.debug(`Plugin ${pluginConfig.plugin} provided as string, attemping to load`)

          const loadedPlugin = loadPlugin(pluginConfig.plugin)
          const _pluginConfig = Object.assign({}, pluginConfig, {plugin: loadedPlugin})
          log.debug({ _pluginConfig }, 'Plugin loaded successfully')
          return _pluginConfig
        } catch (e) {
          log.error(e)
          log.error(e.errors)
        }
      } else {
        return pluginConfig
      }
    })
  }

  /**
   * Apply pluginConfigs to a data fetcher
   * @param {DataDeerCore} dataFetcher - DataDeerCore to apply plugin to
   * @param {PluginConfig[]} pluginConfigs - Plugins to apply
   */
  _applyPlugins (dataFetcher, pluginConfigs) {
    pluginConfigs.forEach(pluginConfig => {
      log.debug({pluginConfig}, 'Attemping to apply plugin')
      dataFetcher.use(pluginConfig)
      log.debug({pluginConfig}, 'Plugin applied')
    })
  }


  start () {
    return this.server.start()
  }
}

module.exports = DataDeerCMS
