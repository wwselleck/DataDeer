const path = require('path')
const log = require('./lib/logger.js')
const program = require('commander')
const Raft = require('@wwselleck/raft')
const RaftCLI = require('./lib/RaftCLI')

function resolveConfigPath (configPath) {
  return path.resolve(process.cwd(), configPath)
}

function getConfig (path) {
  let config
  try {
    config = require(path)
  } catch (e) {
    throw new Error('Could not read configuration file')
  }
  return config
}

function main () {
  program
    .option('-c, --config <path>', 'Path to config file', resolveConfigPath)
    .parse(process.argv)

  const defaultConfigPath = path.resolve(process.cwd(), 'raft.config.js')
  const configPath = program.config || defaultConfigPath
  log.debug({ configPath }, 'Attempting to read configuration file')
  const config = getConfig(configPath)
  log.debug({configPath, config}, 'Configuration read successfully')

  let raft = Raft.create(config)
  const cli = RaftCLI.create(raft)
  cli.run()
}

if (!module.parent) {
  main()
}
