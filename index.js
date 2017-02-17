#!/usr/bin/env node

let path = require('path')
let DriveCMS = require('./src/DriveCMS.js')

let log = require('./src/lib/logger.js')

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

  log.info('Starting DriveCMS')

  let drivecms = new DriveCMS(config)
  drivecms.start().catch(err => console.log(err))
}

if (!module.parent) {
  main()
} else {
  module.exports = DriveCMS
}

