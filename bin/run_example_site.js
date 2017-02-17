const path = require('path')
const process = require('process')
const spawn = require('child_process').spawn
const CLI_PATH = path.resolve(__dirname, '../packages/drivecms-cli/index.js')
const NODE_MODULES_PATH = path.resolve(__dirname, '../node_modules')

const NODEMON = path.resolve(NODE_MODULES_PATH, 'nodemon', 'bin', 'nodemon.js')

process.chdir('./example_site')
child = spawn('node', [CLI_PATH])

child.stdout.on('data', data => {
  console.log(data.toString())
})

child.stderr.on('data', data => {
  console.log(data.toString())
})
