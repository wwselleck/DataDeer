const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const PACKAGES_DIR = path.resolve(__dirname, '../packages')

function runCommand (cmd, args, options) {
  return spawn(cmd, args, options)
}

function getPackage (name) {
  return path.resolve(PACKAGES_DIR, name)
}

function getPackages () {
  return fs.readdirSync(PACKAGES_DIR)
    .map(file => path.resolve(PACKAGES_DIR, file))
    .filter(f => fs.lstatSync(path.resolve(f)).isDirectory())
}

module.exports = {
  runCommand,
  getPackage,
  getPackages
}
