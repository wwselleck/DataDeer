const path = require('path')
const fs = require('fs')
const jsdoc2md = require('jsdoc-to-markdown')

const { runCommand, getPackages } = require('./_util')

getPackages().forEach(pkg => {
  const outFile = fs.createWriteStream(path.resolve(pkg, 'API.md'))
  jsdoc2md.render({
    files: [path.resolve(pkg, 'index.js'), path.resolve(pkg, 'lib/*.js')]
  }).then(md => {
    outFile.write(md)
  }).catch(console.error)

  const html = runCommand('jsdoc', ['index.js', 'lib', '-r', '-d', 'docs/api', '-R', 'README.md'], {
    cwd: pkg
  })
  html.stdout.on('data', data => {
    console.log('jsdom: ' + data)
  })
})
