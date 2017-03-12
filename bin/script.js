const path = require('path')
const { spawn } = require('child_process')
const argv = require('minimist')(process.argv.slice(2))

function verifyParams (argv) {
  if (!argv.cmd) {
    throw new Error('cmd argument not provided')
  }

  if (!argv.package) {
    throw new Error('package argument not provided')
  }
}

verifyParams(argv)
const cmd = argv.cmd
const pkg = argv.package

console.log(`Running ${cmd} for ${pkg}`)
const PACKAGE_DIR = path.resolve(__dirname, '..', 'packages', pkg)
spawn('npm', ['run', cmd], {
  cwd: PACKAGE_DIR,
  // https://nodejs.org/api/child_process.html#child_process_options_stdio
  stdio: 'inherit'
})
