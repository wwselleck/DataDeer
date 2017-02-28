const log = require('./lib/logger')
const { makeError } = require('./lib/errors')

/**
 * Core class of DataDeer. Maintains a collection of plugins and fetches
 * data from them.
 */
class DataDeerCore {
  constructor () {
    this.plugins = []
  }

  /**
   * Check if a pluginConfig is compatible with DataDeer
   * @param {Object} pluginConfig - Plugin configuration
   * @param {*} pluginConfig.plugin - Should be a function, but that's what's being checked
   * @param {string} pluginConfig.id - ID to identify plugin output in data object
   */
  _verifyPluginCompat (pluginConfig) {
    log.debug(pluginConfig, 'Verifying plugin compatability')
    const errors = []
    if (pluginConfig.plugin === undefined) {
      errors.push(makeError.pluginUndefined())
      return errors
    }
    if (typeof pluginConfig.plugin !== 'function') {
      errors.push(makeError.notFunction(pluginConfig.plugin.filename))
    }
    if (pluginConfig.id === undefined) {
      errors.push(makeError.noId(pluginConfig.plugin.filename))
    }
    return errors
  }

  /**
   * Use a
   */
  use (pluginConfig) {
    log.debug({ pluginConfig }, `Attemping to use plugin`)
    const errors = this._verifyPluginCompat(pluginConfig)
    if (errors.length !== 0) {
      let errorString = 'Cannot use invalid plugin\n'
      errors.forEach(e => {
        errorString += `${e.toString()}\n`
      })
      log.warn(new Error(errorString))
    }

    this.plugins.push({
      plugin: pluginConfig.plugin(pluginConfig),
      id: pluginConfig.id
    })
    return this
  }

  fetch () {
    const ret = {}
    return Promise.all(this.plugins.map(pluginConfig => {
      const { plugin, id } = pluginConfig
      return plugin().then(data => {
        ret[id] = data
      }).catch(err => {
        log.error({err, plugin}, 'Error while fetching data for plugin')
      })
    })).then(() => {
      return ret
    })
  }
}

function datadeer () {
  return new DataDeerCore()
}

module.exports = datadeer
