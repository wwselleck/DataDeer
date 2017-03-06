let path = require('path')
let log = require('./lib/logger.js')
let raft = require('@wwselleck/raft')

function main () {
  const configPath = path.resolve('.', 'raft.config.js')

  log.info({configPath}, 'Attempting to read configuration file')

  let config
  try {
    config = require(configPath)
  } catch (e) {
    log.info({configPath}, 'Error when reading configuration file')
    throw e
  }

  log.info({configPath, config}, 'Configuration read successfully')
  log.info('Starting DataDeerCMS...')
  let server = raft(config)
  server.start().catch(err => console.log(err))
}

if (!module.parent) {
  main()
}
