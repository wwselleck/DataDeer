const path = require('path')
const fs = require('fs')
const { runCommand, getPackages } = require('./_util')

getPackages().forEach(pkg => {
  const outFile = fs.createWriteStream(path.resolve(pkg, 'API.md'))

  const md = runCommand('jsdoc2md', ['index.js', 'lib/**/*.js'], {
    cwd: pkg
  })
  md.stdout.pipe(outFile)

  runCommand('jsdoc', ['index.js', 'lib', '-r', '-d', 'docs', '-R', 'README.md'], {
    cwd: pkg
  })
})
