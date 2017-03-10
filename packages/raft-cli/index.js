const path = require('path')
const log = require('./lib/logger.js')
const program = require('commander')
const { Raft } = require('@wwselleck/raft')
const RaftCLI = require('./lib/RaftCLI')

function getConfig (path) {
  let config
  try {
    config = require(path)
  } catch (e) {
    log.info({path}, 'Error when reading configuration file')
    throw e
  }
  return config
}

function main () {
  program
    .option('-c, --config <path>', 'Path to config file')
    .parse(process.argv)

  const defaultConfigPath = path.resolve('.', 'raft.config.js')
  const configPath = program.config || defaultConfigPath
  log.debug({ configPath }, 'Attempting to read configuration file')
  const config = getConfig(configPath)
  log.info({configPath, config}, 'Configuration read successfully')

  let raft = Raft.create(config)
  const cli = RaftCLI.create(raft)
  cli.run()
}

if (!module.parent) {
  main()
}
