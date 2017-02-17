let fs = require('fs')
let readline = require('readline')
let GoogleAuth = require('google-auth-library')
let log = require('../lib/logger.js')

function authenticateOAuth (opts) {
  return new Promise((resolve, reject) => {
    fs.readFile(opts.creds_path, (err, creds) => {
      if (err) {
        log.error({err}, 'Error loading creds file')
      }
      creds = JSON.parse(creds)
      let clientSecret = creds.installed.client_secret
      let clientId = creds.installed.client_id
      let redirectUrl = creds.installed.redirect_uris[0]
      let auth = new GoogleAuth()
      let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

      fs.readFile(opts.token_path, (err, token) => {
        if (err) {
          return getNewToken(oauth2Client, opts.token_path, opts.scopes).then(oauth => {
            resolve(oauth)
          })
        }
        oauth2Client.credentials = JSON.parse(token)
        resolve(oauth2Client)
      })
    })
  })
}

function storeToken (token, tokenPath) {
  fs.writeFile(tokenPath, JSON.stringify(token))
}

function getNewToken (oauth, tokenPath, scopes) {
  return new Promise((resolve, reject) => {
    let authUrl = oauth.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    })

    console.log(`We need to authorization to access your Google Drive files. Please visit this url: ${authUrl}`)

    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question('Enter the code you get from that page here: ', code => {
      rl.close()
      oauth.getToken(code, (err, token) => {
        if (err) {
          log.error({err}, 'Error while trying to retrieve access token')
          return
        }
        oauth.credentials = token
        storeToken(token, tokenPath)
        resolve(oauth)
      })
    })
  })
}

module.exports = authenticateOAuth
