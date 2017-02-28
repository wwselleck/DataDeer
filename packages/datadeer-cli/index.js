let path = require('path')
let log = require('./lib/logger.js')
let DataDeerCMS = require('datadeer-cms')

function loadPlugins (pluginConfigs) {

}

function main () {
  const configPath = path.resolve('./datadeercms.config.js')

  log.info({configPath}, 'Attempting to read configuration file')

  let config
  try {
    config = require(configPath)
  } catch (e) {
    log.info({configPath}, 'Error when reading configuration file')
    throw e
  }

  log.info({configPath, config}, 'Configuration read successfully')

  const plugins = loadPlugins(config.plugins)

  log.info('Starting DataDeerCMS...')
  let server = new DataDeerCMS(config)
  server.start().catch(err => console.log(err))
}

if (!module.parent) {
  main()
}
