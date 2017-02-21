let bunyan = require('bunyan')

module.exports = bunyan.createLogger({
  name: 'DriveCMS',
  src: true,
  level: 'debug',
  streams: [
    {
      stream: process.stdout
    },
    {
      path: './logfile.log'
    }
  ]
})
