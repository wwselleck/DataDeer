console.log("1")
let path = require('path')
console.log("2")
let log = require('./lib/logger.js')
console.log("3")
let DriveCMSServer = require('drivecms-server')

function main () {
  const configPath = path.resolve('./drivecms.config.js')

  log.info({configPath}, 'Attempting to read configuration file')

  let config
  try {
    config = require(configPath)
  } catch (e) {
    log.info({configPath}, 'Error when reading configuration file')
    throw e
  }

  log.info({configPath, config}, 'Configuration read successfully')

  log.info('Starting DriveCMSServer')
  let server = new DriveCMSServer(config)
  server.start().catch(err => console.log(err))
}

if (!module.parent) {
  main()
}
