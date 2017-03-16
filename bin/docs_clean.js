const path = require('path')
const { runCommand, getPackages } = require('./_util')

getPackages().forEach(pkg => {
  const mdOut = path.resolve(pkg, 'API.md')
  const htmlOut = path.resolve(pkg, 'docs/api')
  runCommand('rm', ['-r', mdOut, htmlOut])
})
