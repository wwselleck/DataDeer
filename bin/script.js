const argv = require('minimist')(process.argv.slice(2))
const { runCommand, getPackage } = require('./_util')

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
const PACKAGE_DIR = getPackage(pkg)
runCommand('npm', ['run', cmd], {
  cwd: PACKAGE_DIR,
  stdio: 'inherit'
})
