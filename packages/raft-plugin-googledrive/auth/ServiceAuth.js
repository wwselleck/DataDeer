let fs = require('fs')
let GoogleAuth = require('google-auth-library')
let log = require('../lib/logger.js')

// https://dannysu.com/2014/01/16/google-api-service-account/
function authenticateService (config) {
  log.info({config}, 'Attemping to authenticate with Service Account strategy')
  return new Promise((resolve, reject) => {
    let authConfig = config
    if (authConfig.path) {
      log.debug({path: authConfig.path}, 'Path property detected on auth configuration, attempting to read credentials file')
      let creds = JSON.parse(fs.readFileSync(authConfig.path, 'utf8'))
      log.debug({authConfig}, 'Credentials file read successfully')
      authConfig = Object.assign({}, authConfig, creds)
    }
    let auth = new GoogleAuth()
    let oauth2Client = new auth.OAuth2()
    let { client_email, private_key, scopes } = authConfig
    let jwt = new auth.JWT(client_email, null, private_key, scopes)
    jwt.authorize((err, result) => {
      if (err) {
        return reject(err)
      }
      oauth2Client.setCredentials({
        access_token: result.access_token
      })
      resolve(oauth2Client)
    })
  })
}

module.exports = authenticateService
