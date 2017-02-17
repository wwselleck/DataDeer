let authenticateOAuth = require('./OAuth.js')
let authenticateService = require('./ServiceAuth.js')

let log = require('../lib/logger.js')

let authModes = {
  service: authenticateService,
  oauth2: authenticateOAuth
}

function authenticate (opts) {
  if (!authModes[opts.mode]) {
    log.error({opts}, 'Attemping to authenticate with an invalid mode')
  }
  return authModes[opts.mode](opts)
}

module.exports = { authenticate }
