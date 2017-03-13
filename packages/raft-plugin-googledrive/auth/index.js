let authenticateOAuth = require('./OAuth.js')
let authenticateService = require('./ServiceAuth.js')

let authModes = {
  service: authenticateService,
  oauth2: authenticateOAuth
}

function authenticate (opts) {
  if (!authModes[opts.type]) {
    throw new Error('Attempted to authenticate with an invalid mode')
  }
  return authModes[opts.type](opts)
}

module.exports = { authenticate }
