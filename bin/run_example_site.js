const path = require('path')
const process = require('process')
const { spawn, spawnSync } = require('child_process')
// const CLI_PATH = path.resolve(__dirname, '../packages/raft-cli/index.js')

// const NPM_BIN = spawnSync('npm', ['bin']).stdout.toString().trim()
// const NODEMON = path.resolve(NPM_BIN, 'nodemon')

const PACKAGES_DIR = path.resolve(__dirname, '..', 'packages')
const PACKAGES = ['raft-plugin-googledrive', 'raft-cli']

process.chdir('./example_site')
PACKAGES.forEach(p => {
  const pkg = path.resolve(PACKAGES_DIR, p)
  console.log(pkg)
  console.log(spawnSync('npm', ['link', pkg]).stdout.toString())
})

const child = spawn('npm', ['start'])

child.stdout.on('data', data => {
  console.log(data.toString())
})

child.stderr.on('data', data => {
  console.log(data.toString())
})
