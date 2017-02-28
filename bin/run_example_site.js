const path = require('path')
const process = require('process')
const { spawn, spawnSync } = require('child_process')
const CLI_PATH = path.resolve(__dirname, '../packages/datadeer-cli/index.js')

const NPM_BIN = spawnSync('npm', ['bin']).stdout.toString().trim()
const NODEMON = path.resolve(NPM_BIN, 'nodemon')

process.chdir('./example_site')
const child = spawn(NODEMON, [CLI_PATH])

child.stdout.on('data', data => {
  console.log(data.toString())
})

child.stderr.on('data', data => {
  console.log(data.toString())
})
